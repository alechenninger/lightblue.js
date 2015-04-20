var q     = require("q");
var http  = require("http");
// TODO: What will browserify do with requiring https?
var https = require("https");
var url   = require("url");
var util  = require("./clientutil");

var isDefined = util.isDefined;
var ifDefined = util.ifDefined;

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
  
  if (requestOpts.url.indexOf("https") === 0) {
    exec = this._execSsl;
  } else {
    exec = this._exec;
  }
  
  var options = url.parse(requestOpts.url);
  options.method = requestOpts.METHOD;
  options.headers = {
    "Content-Type": "application/json",
    "Content-Length": requestOpts.body.length
  };
  
  if (isDefined(this._auth)) {
    options.auth = this._auth;
  }
  
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