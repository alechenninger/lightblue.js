var q = require("q");
var http = require("http");
var https = require("https");
var url = require("url");
var util = require("./clientutil");

var isDefined = util.isDefined;
var ifDefined = util.ifDefined;

module.exports = NodeHttpClient;

/**
 * @param {String} options.auth.user Username to use for basic auth
 * @param {String} options.auth.pass Password to use for basic auth
 * @param {http.Agent} options.httpAgent Node "agent" to use for http requests.
 *         Has same configuration API and semantics as
 *         https://nodejs.org/api/http.html#http_class_http_agent
 * @param {https.Agent} options.httpsAgent Node "agent" to use for https requests.
 *         Has same configuration API and semantics as
 *         https://nodejs.org/api/http.html#http_class_http_agent
 *         except with additional SSL configuration as outlined here:
 *         https://nodejs.org/api/https.html#https_https_request_options_callback
 */
function NodeHttpClient(options) {
  this._exec = http.request;
  this._execSsl = https.request;

  if (options instanceof Object) {
    this._auth = ifDefined(options.auth, null);
    this._httpAgent = options.httpAgent;
    this._httpsAgent = options.httpsAgent;
  }
}

/**
 * @param {HttpRequest} requestOpts
 */
NodeHttpClient.prototype.execute = function(requestOpts) {
  var deferred = q.defer();
  var promise = deferred.promise;
  var isHttps = requestOpts.url.indexOf("https") === 0;

  var exec = isHttps ? this._execSsl : this._exec;

  var body = isDefined(requestOpts.body) ? JSON.stringify(requestOpts.body) : "";

  var options = url.parse(requestOpts.url);
  options.method = requestOpts.method.toUpperCase();
  options.headers = {
    "Content-Type": "application/json",
    "Content-Length": body.length
  };
  options.agent = isHttps ? this._httpsAgent : this._httpAgent;

  if (this._auth !== null) {
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

  request.on("error", function(error) {
    // TODO: reject with something consistent
    deferred.reject(error);
  });

  request.write(body, "utf8");
  request.end();

  promise.success = function(callback) {
    return promise.then(callback);
  };

  promise.error = function(callback) {
    return promise.then(null, callback);
  };

  return promise;
};
