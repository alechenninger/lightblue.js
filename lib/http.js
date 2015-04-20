var assertArg = require("./clientutil.js").assertArg;

/**
 * @constructor
 * @param {String} method Http method, case insensitive.
 * @param {Url} url
 * @param {String=} body The request body.
 */
exports.HttpRequest = function(method, url, body) {
  this.method = assertArg.isNotBlankString(method, "method");
  this.url = assertArg.isTypeOf(url, "string", "url");
  this.body = (typeof body === "string") ? body : "";
  
  this.METHOD = this.method.toUpperCase();
};

/**
 * @interface HttpClient
 */
 
/**
 * @function
 * @name HttpClient#execute
 * @return {Promise}
 */