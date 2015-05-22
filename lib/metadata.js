var util = require("./clientutil");
var http = require("./http");

var isEmpty = util.isEmpty;
var resolve = util.resolve;

var HttpRequest = http.HttpRequest;

module.exports = LightblueMetadataClient;

/**
 * Client for making requests against a Lightblue metadata endpoint.
 * @constructor
 * @param {String} host - The URL where the rest data server is deployed. This 
 *     path will be the base for requests, like ${host}/${entityName}, so if the
 *     app is deployed under a particular context (like /rest/metadata), this 
 *     must be included in the host.
 */
function LightblueMetadataClient(httpClient, host) {
  this._httpClient = httpClient;
  this._host = host;
}

LightblueMetadataClient.prototype._execute = function(request) {
  return this._httpClient.execute(request);
};

/**
 * Request entity names of certain statuses.
 * @param  {String[]} [statuses] An optional array of statuses to reduce the 
 *     search to.
 */
LightblueMetadataClient.prototype.getNames = function(statuses) {
  return this._execute(new NamesRequest(this._host, statuses));
};

/**
 * Request the versions available for a particular entity.
 * @param  {String} entityName
 */
LightblueMetadataClient.prototype.getVersions = function(entityName) {
  return this._execute(new VersionsRequest(this._host, entityName));
};

/**
 * Returns the metadata details for the specified version of an entity.
 * @param  {String} entityName Name of the entity.
 * @param  {String} version    Version (required).
 */
LightblueMetadataClient.prototype.getMetadata = function(entityName, version) {
  return this._execute(new MetadataRequest(this._host, entityName, version));
};

/**
 * Request the roles available for all entities, or a particular entity, or a 
 * particular version of an entity.
 * @param  {String} [entityName]
 * @param  {String} [version]
 */
LightblueMetadataClient.prototype.getRoles = function(entityName, version) {
  return this._execute(new RolesRequest(this._host, entityName, version));
};

function NamesRequest(host, statuses) {
  var query = (statuses && statuses.length > 0)
      ? "s=" + statuses.join(",")
      : "";

  HttpRequest.call(this, "get", resolve(host, query));
}

NamesRequest.prototype = Object.create(HttpRequest.prototype);
NamesRequest.prototype.constructor = NamesRequest;

function VersionsRequest(host, entityName) {
  if (isEmpty(entityName)) {
    throw new Error("entityName required for versions request.")
  }

  HttpRequest.call(this, "get", resolve(host, entityName));
}

VersionsRequest.prototype = Object.create(HttpRequest.prototype);
VersionsRequest.prototype.constructor = VersionsRequest;

function RolesRequest(host, entityName, version) {
  HttpRequest.call(this, "get", resolve(host, entityName, version, "roles"));
}

RolesRequest.prototype = Object.create(HttpRequest.prototype);
RolesRequest.prototype.constructor = RolesRequest;

function MetadataRequest(host, entityName, version) {
  if (isEmpty(entityName) || isEmpty(version)) {
    throw new Error("entityName and version required for metadata request.")
  }

  HttpRequest.call(this, "get", resolve(host, entityName, version));
}