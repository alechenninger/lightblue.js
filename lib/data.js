var resolve = require("./clientutil").resolve;
var http    = require("./http");

var HttpRequest = http.HttpRequest;
var Url = http.Url;

module.exports = LightblueDataClient;

/**
 * Client for making requests against a Lightblue data endpoint.
 * @constructor
 * @param {String} host - The URL where the rest data server is deployed. This 
 *     path will be the base for requests, like ${host}/find, so if the app is
 *     deployed under a particular context (like /rest/data), this must be 
 *     included in the host.
 */
function LightblueDataClient(host) {
  this.host = host;
}

LightblueDataClient.prototype.find = function(config) {
  return this._execute(new FindRequest(this.host, config));
};

LightblueDataClient.prototype.insert = function(config) {
  return new InsertRequest(this.host, config);
};

LightblueDataClient.prototype.update = function(config) {
  return new UpdateRequest(this.host, config);
};

LightblueDataClient.prototype.save = function(config) {
  return new SaveRequest(this.host, config);
};

LightblueDataClient.prototype.delete = function(config) {
  return new DeleteRequest(this.host, config);
};

/**
 * @param {Object} config The config object for the request.
 */
function FindRequest(host, config) {
  var url = resolve(host, "find", config.entity, config.version);
  var body = {
    objectType: config.entity,
    version: config.version,
    query: config.query,
    projection: config.projection
  };

  if (config.sort instanceof Object && Object.keys(config.sort).length > 0) {
    body.sort = config.sort;
  }

  if (config.range) {
    body.range = [];
    body.range[0] = config.range.from || config.range[0] || 0;
    body.range[1] = config.range.to || config.range[1];
  }

  HttpRequest.call(this, "post", url, body);
}

FindRequest.prototype = Object.create(HttpRequest.prototype);
FindRequest.prototype.constructor = FindRequest;

/**
 * @param {Object} config The config object for the request.
 */
function InsertRequest(host, config) {
  var url = resolve(host, "insert", config.entity, config.version);
  var body = {
    objectType: config.entity,
    version: config.version,
    data: config.data,
    projection: config.projection
  };

  HttpRequest.call(this, "put", url, body);
}

InsertRequest.prototype = Object.create(HttpRequest.prototype);
InsertRequest.prototype.constructor = InsertRequest;

/**
 * @param {Object} config The config object for the request.
 */
function SaveRequest(host, config) {
  var url = resolve(host, "save", config.entity, config.version);
  var body = {
    objectType: config.entity,
    version: config.version,
    data: config.data,
    upsert: config.upsert,
    projection: config.projection
  }

  HttpRequest.call(this, "post", url, body);
}

SaveRequest.prototype = Object.create(HttpRequest.prototype);
SaveRequest.prototype.constructor = SaveRequest;

/**
 * @param {Object} config The config object for the request.
 */
function UpdateRequest(host, config) {
  var url = resolve(host, "update", config.entity, config.version);
  var body = {
    objectType: config.entity,
    version: config.version,
    query: config.query,
    update: config.update,
    projection: config.projection
  };

  HttpRequest.call(this, "post", url, body);
}

UpdateRequest.prototype = Object.create(HttpRequest.prototype);
UpdateRequest.prototype.constructor = UpdateRequest;

/**
 * @param {Object} config The config object for the request.
 */
function DeleteRequest(host, config) {
  var url = resolve(host, "delete", config.entity, config.version);
  var body = {
    objectType: config.entity,
    version: config.version,
    query: config.query
  };

  HttpRequest.call(this, "post", url, body);
}

DeleteRequest.prototype = Object.create(HttpRequest.prototype);
DeleteRequest.prototype.constructor = DeleteRequest;