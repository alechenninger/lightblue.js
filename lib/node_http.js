var q     = require("q");
var http  = require("http");
var https = require("https");

/**
 * @param {String} options.auth.user Username to use for basic auth
 * @param {String} options.auth.pass Password to use for basic auth
 */
function NodeHttpClient(options) {
  this._exec = http.request;
  this._execSsl = https.request;
    
  if (options instanceof Object) {
    this._auth = ifDefined(options.auth, undefined);
    // TODO: Support ssl certs
  }
}

/**
 * @param {HttpRequest} requestOpts
 */
NodeHttpClient.prototype.execute = function(requestOpts) {
  var deferred = q.defer();
  var promise = deferred.promise;
  
  var exec;
  var hostname;
  
  if (requestOpts.href.indexOf("https") === 0) {
    hostname = requestOpts.url.host.substr("https://".length);
    exec = this._execSsl;
  } else {
    hostname = requestOpts.url.host.substr("http://".length);
    exec = this._exec;
  }
  
  var options = {
    hostname: hostname,
    port: requestOpts.url.port,
    path: requestOpts.url.path,
    method: requestOpts.METHOD,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": requestOpts.body.length
    },
    // TODO: Does this work?
    auth: this._auth
  };
  
  var request = exec(options, function(res) {
    var responseBody = "";
    
    res.setEncoding("utf8");
    
    res.on("data", function(chunk) {
      responseBody += chunk;
    });
    
    res.on("end", function() {
      // TODO: resolve with more than just body?
      // TODO: error on lightblue error?
      deferred.resolve(responseBody);
    });
    
    res.on("error", function(error) {
      // TODO: what is this resolving with?
      deferred.reject(error);
    });
  });
  
  request.write(requestOpts.body, "utf8");
  request.end();
  
  request.on("error", function(error) {
    // TODO: reject with something consistent
    deferred.reject(error);
  });
  
  promise.success = function(callback) {
    return promise.then(callback);
  };
  
  promise.error = function(callback) {
    return promise.then(null, callback);
  };
  
  return promise;
};

function ifDefined(it, otherwise) {
  if (typeof it === "undefined") {
    return otherwise;
  }
  
  return it;
}