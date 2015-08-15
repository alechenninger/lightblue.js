var Buffer = require("buffer").Buffer;
var util = require("./clientutil.js");

var isObject = util.isObject;

module.exports = NgHttpClient;

// TODO: Use $httpBackend instead?
function NgHttpClient($http, auth) {
  this._$http = $http;

  if(isObject(auth) && "username" in auth && "password" in auth) {
    var authBuffer = new Buffer(auth.username + ":" + auth.password);
    var encoded = authBuffer.toString("Base64");
    this._headers = {
      Authorization: "Basic " + encoded
    };
  }
}

/**
 * @param {RestRequest} req
 */
NgHttpClient.prototype.execute = function(req) {
  return this._$http({
    method: req.method,
    url: req.url,
    data: req.body,
    withCredentials: true,
    headers: this._headers
  });
};
