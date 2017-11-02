var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) { throw err; }
    data = data.split('\n');
    callback(data);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(data) {
    var isInList = data.indexOf(url) >= 0;
    callback(isInList);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.writeFileSync(exports.paths.list, url);
  callback();
};

exports.isUrlArchived = function(url, callback) {
  var isArchived = fs.existsSync(exports.paths.archivedSites + '/' + url);
  callback(isArchived);
};

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    var options = {
      host: url,
    };

    callback = function(response) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        fs.writeFile(exports.paths.archivedSites + '/' + url, str);
      });
    };
    
    var req = http.request(options, callback);
    req.end();
  });
};

