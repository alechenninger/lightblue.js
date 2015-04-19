var assertArg = require("./clientutil.js").assertArg;

/**
 * @constructor
 * @param {String} method Http method, case insensitive.
 * @param {Url} url
 * @param {String=} body The request body.
 */
exports.HttpRequest = function(method, url, body) {
  this.method = assertArg.isNotBlankString(method, "method");
  this.body = (typeof body === "string") ? body : "";
  this.url = assertArg.isInstance(url, Url, "url");
  
  // derived properties
  this.METHOD = this.method.toUpperCase();
  this.href = url.toString();
};

/**
 * @constructor
 * @param {String} host
 * @param {Object} options
 * @param {Number=} options.port
 * @param {String=} options.path Includes query string
 */
exports.Url = Url;

function Url(host, options) {
  if (!/https?:\/\/[^\s]+$/.test(host)) {
    throw new Error("Invalid url host syntax: " + host);
  }

  this.host = host;
  
  var port, path;
  
  if (options instanceof Object) {
    port = options.port || 80;
    path = options.path || "/";
  } else {
    port = 80;
    path = "/";
  }
  
  this.port = port;
  this.path = path;
}

Url.prototype.toString = function() {
  return this.host + ":" + this.port + this.path;
};