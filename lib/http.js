/**
 * @constructor
 * @param {String} method Http method, case insensitive.
 * @param {Url} url
 * @param {String=} body The request body.
 */
exports.HttpRequest = function(method, url, body) {
  this.method = (typeof method === "string") ? method.toLowerCase() : "";
  this.METHOD = this.method.toUpperCase();
  this.body = body;
  this.url = url;
  this.href = url.toString();
}

/**
 * @constructor
 * @param {String} host
 * @param {Object} options
 * @param {Number=} options.port
 * @param {String=} options.path Includes query string
 */
exports.Url = Url;

function Url(host, options) {
    this.host = host;
    
    if (options instanceof Object) {
        this.port = options.port || 80;
        this.path = options.path || "/";
    }
}

Url.prototype.toString = function() {
    return this.host + ":" + this.port + this.path;
}