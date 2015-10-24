var DataClient      = require("./data.js");
var MetadataClient  = require("./metadata.js");
var LightblueClient = require("./client.js");
var query           = require("./query.js");
var NodeHttpClient  = require("./nodehttp.js");
var NgHttpClient    = require("./nghttp.js");

// TODO: create a separate angular library which doesn't add lightblue global
// Install angular module if angular is present
var isNgPresent = require("./nglightblue.js").isNgPresent;

var resolve = require("./clientutil.js").resolve;

exports.getDataClient = getDataClient;
exports.getMetadataClient = getMetadataClient;
exports.getClient = getClient;
exports.getHttpClient = getHttpClient;
exports.query = query;

/**
 * Returns a LightblueDataClient.
 * @param {String} dataHost The full path for the base Lightblue data REST
 *     context.
 * @param {Object} options Configuration object.
 * @return {LightblueDataClient}
 */
function getDataClient(dataHost, options) {
  return new DataClient(getHttpClient(options), dataHost);
}

/**
 * Returns a LightblueMetadataClient.
 * @param {String} metadataHost The full path for the base Lightblue metadata
 *     REST context.
 * @param {Object} options Configuration object.
 * @return {LightblueMetadataClient}
 */
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
  if (isNgPresent() && typeof options == "object" && "$http" in options) {
    return new NgHttpClient(options.$http, options.auth);
  }

  return new NodeHttpClient(options);
}
