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
exports._getHttpClient = _getHttpClient;
exports.query = query;

/**
 * Returns a LightblueDataClient.
 * @param {String} dataHost The full path for the base Lightblue data REST
 *     context.
 * @param {Object=|HttpClient=} optionsOrClient Configuration object or 
 *     HttpClient itself.
 * @return {LightblueDataClient}
 */
function getDataClient(dataHost, optionsOrClient) {
  var client = ("execute" in optionsOrClient 
      ? optionsOrClient 
      : _getHttpClient(optionsOrClient));
      
  return new DataClient(client, dataHost);
}

/**
 * Returns a LightblueMetadataClient.
 * @param {String} metadataHost The full path for the base Lightblue metadata
 *     REST context.
 * @param {Object=|HttpClient=} optionsOrClient Configuration object or 
 *     HttpClient itself.
 * @return {LightblueMetadataClient}
 */
function getMetadataClient(metadataHost, optionsOrClient) {
  var client = ("execute" in optionsOrClient 
      ? optionsOrClient 
      : _getHttpClient(optionsOrClient));
      
  return new MetadataClient(client, metadataHost);
}

/**
 * Returns a LightblueClient.
 * @param {String} dataHost The full path for the base Lightblue data service.
 * @param {String=} metadataHost The full path for the base Lightblue metadata
 *     service.
 * @param {Object=|HttpClient=} optionsOrClient Configuration object or 
 *     HttpClient itself.
 */
function getClient(dataHost, metadataHost, optionsOrClient) {
  // metadataHost and options are optional
  if (typeof metadataHost != "string") {
    if (typeof metadataHost == "object" && metadataHost !== null) {
      optionsOrClient = metadataHost;
    }
    
    var host = dataHost;

    dataHost = resolve(host, "data");
    metadataHost = resolve(host, "metadata");
  }

  var dataClient = getDataClient(dataHost, optionsOrClient);
  var metadataClient = getMetadataClient(metadataHost, optionsOrClient);

  return new LightblueClient(dataClient, metadataClient);
}

function _getHttpClient(options) {
  if (isNgPresent() && typeof options == "object" && "$http" in options) {
    return new NgHttpClient(options.$http, options.auth);
  }

  return new NodeHttpClient(options);
}
