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

function NamesRequest(host, statuses) {
  var query = (statuses && statuses.length > 0)
      ? "s=" + statuses.join(",")
      : "";

  HttpRequest.call(this, "get", resolve(host, query));
}

NamesRequest.prototype = Object.create(HttpRequest.prototype);
NamesRequest.prototype.constructor = NamesRequest;

/**
 * Request the versions available for a particular entity.
 * @param  {String} entityName
 */
LightblueMetadataClient.prototype.getVersions = function(entityName) {
  return this._execute(new VersionsRequest(this._host, entityName));
};

function VersionsRequest(host, entityName) {
  if (isEmpty(entityName)) {
    throw new Error("entityName required for versions request.");
  }

  HttpRequest.call(this, "get", resolve(host, entityName));
}

VersionsRequest.prototype = Object.create(HttpRequest.prototype);
VersionsRequest.prototype.constructor = VersionsRequest;

/**
 * Returns the metadata details for the specified version of an entity.
 * @param  {String} entityName Name of the entity.
 * @param  {String} version    Version (required).
 */
LightblueMetadataClient.prototype.getMetadata = function(entityName, version) {
  return this._execute(new MetadataRequest(this._host, entityName, version));
};

function MetadataRequest(host, entityName, version) {
  if (isEmpty(entityName) || isEmpty(version)) {
    throw new Error("entityName and version required for metadata request.");
  }

  HttpRequest.call(this, "get", resolve(host, entityName, version));
}

MetadataRequest.prototype = Object.create(HttpRequest.prototype);
MetadataRequest.prototype.constructor = MetadataRequest;

/**
 * Request the roles available for all entities, or a particular entity, or a
 * particular version of an entity.
 * @param  {String} [entityName]
 * @param  {String} [version]
 */
LightblueMetadataClient.prototype.getRoles = function(entityName, version) {
  return this._execute(new RolesRequest(this._host, entityName, version));
};

function RolesRequest(host, entityName, version) {
  HttpRequest.call(this, "get", resolve(host, entityName, version, "roles"));
}

RolesRequest.prototype = Object.create(HttpRequest.prototype);
RolesRequest.prototype.constructor = RolesRequest;

LightblueMetadataClient.prototype.getDependencies = function(entityName, version) {
  return this._execute(new DependenciesRequest(this._host, entityName, version));
};

function DependenciesRequest(host, entityName, version) {
  if (isEmpty(entityName) && !isEmpty(version)) {
    throw new Error("entityName required with version for dependencies request");
  }

  HttpRequest.call(this, "get", resolve(host, entityName, version, "dependencies"));
}

DependenciesRequest.prototype = Object.create(HttpRequest.prototype);
DependenciesRequest.prototype.constructor = DependenciesRequest;

LightblueMetadataClient.prototype.putMetadata = function(metadata) {
  return this._execute(new PutMetadataRequest(this._host, metadata));
};

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
    throw new Error("Entity name and version required in metadata");
  }

  HttpRequest.call(this, "put", resolve(host, name, version));
}

PutMetadataRequest.prototype = Object.create(HttpRequest.prototype);
PutMetadataRequest.prototype.constructor = PutMetadataRequest;

LightblueMetadataClient.prototype.addSchema = function(schema) {
  return this._execute(new AddSchemaRequest(this._host, schema));
};

function AddSchemaRequest(host, schema) {
  var name;
  var version;

  if (util.isObject(schema) &&
      util.isObject(schema.version)) {
    name = schema.name;
    version = schema.version.value;
  }

  if (isEmpty(name) || isEmpty(version)) {
    throw new Error("Entity name and version required in schema");
  }

  HttpRequest.call(this, "put", resolve(host, name, "schema=" + version));
}

AddSchemaRequest.prototype = Object.create(HttpRequest.prototype);
AddSchemaRequest.prototype.constructor = AddSchemaRequest;

LightblueMetadataClient.prototype.updateEntityInfo = function(entityInfo) {
  return this._execute(new UpdateEntityInfoRequest(this._host, entityInfo));
};

function UpdateEntityInfoRequest(host, entityInfo) {
  var name;

  if (util.isObject(entityInfo)) {
    name = entityInfo.name;
  }

  if (isEmpty(name)) {
    throw new Error("Entity name required in entityInfo");
  }

  HttpRequest.call(this, "put", resolve(host, name));
}

UpdateEntityInfoRequest.prototype = Object.create(HttpRequest.prototype);
UpdateEntityInfoRequest.prototype.constructor = UpdateEntityInfoRequest;

LightblueMetadataClient.prototype.updateSchemaStatus = function(entityName, version, status, comment) {
  return this._execute(new UpdateSchemaStatusRequest(this._host, entityName, version, status, comment));
};

LightblueMetadataClient.prototype.activateSchema = function(entityName, version, comment) {
  return this.updateSchemaStatus(entityName, version, 'active', comment);
};

LightblueMetadataClient.prototype.deprecateSchema = function(entityName, version, comment) {
  return this.updateSchemaStatus(entityName, version, 'deprecated', comment);
};

LightblueMetadataClient.prototype.disableSchema = function(entityName, version, comment) {
  return this.updateSchemaStatus(entityName, version, 'disabled', comment);
};

function UpdateSchemaStatusRequest(host, entityName, version, status, comment) {
  if (isEmpty(entityName) || isEmpty(version) || isEmpty(status)) {
    throw new Error("entityName, version, and status are required.");
  }

  var _status = status.toLowerCase();

  if (["active", "deprecated", "disabled"].indexOf(_status) === -1) {
    throw new Error("Status was '" + _status + "' but must be one of: 'active', 'deprecated', 'disabled'");
  }

  var url = isEmpty(comment)
      ? resolve(host, entityName, version, status)
      : resolve(host, entityName, version, status + "?comment=" + encodeURIComponent(comment));

  HttpRequest.call(this, "put", url);
}

UpdateSchemaStatusRequest.prototype = Object.create(HttpRequest.prototype);
UpdateSchemaStatusRequest.prototype.constructor = UpdateSchemaStatusRequest;

LightblueMetadataClient.prototype.removeDefaultVersion = function(entityName) {
  return this._execute(new RemoveDefaultVersionRequest(this._host, entityName));
};

function RemoveDefaultVersionRequest(host, entityName) {
  if (isEmpty(entityName)) {
    throw new Error("entityName required to remove default version");
  }

  HttpRequest.call(this, "delete", resolve(host, entityName, "default"));
}

RemoveDefaultVersionRequest.prototype = Object.create(HttpRequest.prototype);
RemoveDefaultVersionRequest.prototype.constructor = RemoveDefaultVersionRequest;

LightblueMetadataClient.prototype.setDefaultVersion = function(entityName, version) {
  return this._execute(new SetDefaultVersionRequest(this._host, entityName, version));
};

function SetDefaultVersionRequest(host, entityName, version) {
  if (isEmpty(entityName)) {
    throw new Error("entityName is required to set default version");
  }

  if (isEmpty(version)) {
    throw new Error("version is required to set default version");
  }

  HttpRequest.call(this, "post", resolve(host, entityName, version, "default"));
}

SetDefaultVersionRequest.prototype = Object.create(HttpRequest.prototype);
SetDefaultVersionRequest.prototype.constructor = SetDefaultVersionRequest;
