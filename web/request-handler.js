var path = require('path');
var fs = require('fs');


var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log('request URL: ' + req.url);
  // console.log('request Method: ' + req.method);
  // console.log('--------------');
  
  if (req.method === 'GET' && req.url === '/') {
    httpHelpers.serveAssets(res, 'index.html');
  } else if (req.method === 'GET' && req.url === '/styles.css') {
    httpHelpers.serveAssets(res, 'styles.css');
  } else if (req.method === 'GET') {
    httpHelpers.checkArchives(req, res);
  } else if (req.method === 'POST' && req.url === '/') {
    httpHelpers.handlePostRequest(req, res);
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('error');
  }
  // res.end(archive.paths.list);
};
