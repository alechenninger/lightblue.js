var DataClient     = require("./data.js");
var MetadataClient = require("./metadata.js");
var query          = require("./query.js");

var resolve = require("./clientutil.js").resolve;

// TODO: Refactor exports and modules usage
exports.getDataClient = getDataClient;
exports.getMetadataClient = getMetadataClient;
exports.getClient = getClient;
exports.field = query.field;

function LightblueClient(dataClient, metadataClient) {
  this.data = dataClient;
  this.metadata = metadataClient;
}

/**
 * Returns a LightblueDataClient.
 * @param  {String} dataHost The full path for the base Lightblue data REST 
 *     context.
 * @return {LightblueDataClient}
 */
function getDataClient(httpClient, dataHost) {
  return new DataClient(httpClient, dataHost);
}

function getMetadataClient(httpClient, metadataHost) {
  return new MetadataClient(httpClient, metadataHost);
}

/**
 * Returns a LightblueClient.
 * @param {String} dataHost The full path for the base Lightblue data service.
 * @param {String} metadataHost The full path for the base Lightblue metadata
 *     service.
 * @param {HttpClient} http An http client.
 */
function getClient(httpClient, dataHost, metadataHost) {
  if (typeof metadataHost === "undefined") {
    dataHost = resolve(dataHost, "data");
    metadataHost = resolve(dataHost, "metadata");
  }

  var dataClient = getDataClient(httpClient, dataHost);
  var metadataClient = getMetadataClient(httpClient, metadataHost);

  return new LightblueClient(dataClient, metadataClient);
}