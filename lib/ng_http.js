// TODO: Use $httpBackend instead?
function NgHttpClient($http) {
  this._$http = $http;
}

/**
 * @param {RestRequest} req
 */
NgHttpClient.prototype.execute = function(req) {
  return this._$http[req.method](req.url, req.body);
}