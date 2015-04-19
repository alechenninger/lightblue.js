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
    this._auth = ifDefined(options.auth, null);
    //this.
  }
}

/**
 * @param {RestRequest} req
 */
NodeHttpClient.prototype.execute = function(req) {
  var deferred = q.defer();
  
  // TODO: Lookup how angular does this for reference
  return {
    success: function(callback) {
      
    },
    error: function(callback) {
      
    }
  };
};

function ifDefined(it, otherwise) {
  if (typeof it === "undefined") {
    return otherwise;
  }
  
  return it;
}