var DataClient      = require("./data.js");
var MetadataClient  = require("./metadata.js");
var LightblueClient = require("./client.js");
var query           = require("./query.js");
var NodeHttpClient  = require("./nodehttp.js");

// TODO: reorganize modules
// Install angular module if angular is present
require("./nglightblue.js");

var resolve = require("./clientutil.js").resolve;

exports.getDataClient = getDataClient;
exports.getMetadataClient = getMetadataClient;
exports.getClient = getClient;
exports.field = query.field;

/**
 * Returns a LightblueDataClient.
 * @param  {String} dataHost The full path for the base Lightblue data REST 
 *     context.
 * @return {LightblueDataClient}
 */
function getDataClient(dataHost, options) {
  return new DataClient(getHttpClient(options), dataHost);
}

function getMetadataClient(metadataHost, options) {
  return new MetadataClient(getHttpClient(options), metadataHost);
}

/**
 * Returns a LightblueClient.
 * @param {String} dataHost The full path for the base Lightblue data service.
 * @param {String=} metadataHost The full path for the base Lightblue metadata
 *     service.
 * @param {Object=} options Configuration for http client.
 * @param {HttpClient} http An http client.
 */
function getClient(dataHost, metadataHost, options) {
  // metadataHost and options are optional
  if (typeof metadataHost != "string") {
    if (typeof metadataHost == "object") {
      options = metadataHost;
    }
    
    dataHost = resolve(dataHost, "data");
    metadataHost = resolve(dataHost, "metadata");
  }

  var dataClient = getDataClient(dataHost, options);
  var metadataClient = getMetadataClient(metadataHost, options);

  return new LightblueClient(dataClient, metadataClient);
}

function getHttpClient(options) {
  return new NodeHttpClient(options);
}