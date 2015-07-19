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

LightblueMetadataClient.prototype.getDependencies = function(entityName, version) {
  return this._execute(new DependenciesRequest(this._host, entityName, version));
};

LightblueMetadataClient.prototype.putMetadata = function(metadata) {
  return this._execute(new PutMetadataRequest(this._host, metadata));
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
    throw new Error("entityName required for versions request.");
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
    throw new Error("entityName and version required for metadata request.");
  }

  HttpRequest.call(this, "get", resolve(host, entityName, version));
}

MetadataRequest.prototype = Object.create(HttpRequest.prototype);
MetadataRequest.prototype.constructor = MetadataRequest;

function DependenciesRequest(host, entityName, version) {
  if (isEmpty(entityName) && !isEmpty(version)) {
    throw new Error("entityName required with version for dependencies request");
  }

  HttpRequest.call(this, "get", resolve(host, entityName, version, "dependencies"));
}

DependenciesRequest.prototype = Object.create(HttpRequest.prototype);
DependenciesRequest.prototype.constructor = DependenciesRequest;

function PutMetadataRequest(host, metadata) {
  var name;
  var version;

  if (util.isObject(metadata) &&
      util.isObject(metadata.entityInfo) &&
      util.isObject(metadata.schema) &&
      util.isObject(metadata.schema.version)) {
    name = metadata.schema.name;
    version = metadata.schema.version.value;

    if (name !== metadata.entityInfo.name) {
      throw new Error("Entity name does not match in entityInfo and schema.");
    }
  } else {
    throw new Error("metadata must be a valid metadata object\n." +
        "See: https://github.com/lightblue-platform/lightblue-core/blob" +
        "/master/metadata/src/main/resources/json-schema/metadata" +
        "/metadata.json");
  }

  if (isEmpty(name) || isEmpty(version)) {
    throw new Error("entityName and version required in metadata");
  }

  HttpRequest.call(this, "put", resolve(host, name, version));
}

PutMetadataRequest.prototype = Object.create(HttpRequest.prototype);
PutMetadataRequest.prototype.constructor = PutMetadataRequest;

function AddSchemaRequest(host, schema) {
  // TODO: validate schema json schema?

  if (isEmpty(name) || isEmpty(version)) {
    throw new Error("entityName and version required in metadata");
  }

  HttpRequest.call(this, "put", resolve(host, name, "schema=" + version));
}

AddSchemaRequest.prototype = Object.create(HttpRequest.prototype);
AddSchemaRequest.prototype.constructor = AddSchemaRequest;
