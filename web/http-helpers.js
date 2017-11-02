var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var archive = require('../helpers/archive-helpers');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset) {
  if (asset === 'styles.css') {
    headers['Content-Type'] = 'text/css';
  }
  res.writeHead(200, headers);
  headers['Content-Type'] = 'text/html';
  fs.createReadStream(archive.paths.siteAssets + '/' + asset).pipe(res);
};

exports.handlePostRequest = function(req, res) {
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    body = qs.parse(body);
    var url = body.url;
    exports.checkArchives(req, res);
  });
};

exports.checkArchives = function(req, res) {
  archive.isUrlArchived(req.url, function(exists) {
    if (exists) {
      exports.serveFile(req, res);
    } else {
      if (req.method === 'GET') {
        res.writeHead(404, headers);
        res.end('error, file not found');
      } else {
        res.writeHead(200, headers);
        fs.createReadStream(archive.paths.siteAssets + '/loading.html').pipe(res);
        fs.appendFileSync(archive.paths.list, url);
        // Do worker stuff
      }
    }
  });
};

exports.serveFile = function(req, res) {
  res.writeHead(200, headers);
  fs.createReadStream(archive.paths.archivedSites + '/' + req.url).pipe(res);
};

