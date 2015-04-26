/* globals angular */

/**
 * @file Entry-point for browserified module which sets up an angular module if
 * angular global is present.
 * 
 * <p>Usage:
 * <pre><code>
 * myModule.config("lightblueProvider", function(lightblueProvider) {
 *   lightblueProvider.setDataHost("http://my.lightblue.com/data");
 *   lightblueProvider.setMetadataHost("http://my.lightblue.com/metadata");
 * 
 *   // Above is equivalent to:
 *   // lightblueProvider.setHost("http://my.lightblue.com");
 * }
 * 
 * myModule.controller("foo", ["lightblue", "$scope", function(lightblue, $scope) {
 *   lightblue.data.find(...)
 *       .then(function(response) {
 *         $scope.myEntity = response.processed[0];
 *       });
 * }
 * </pre></code>
 */

var LightblueClient = require("./client.js");
var DataClient      = require("./data.js");
var MetadataClient  = require("./metadata.js");
var NgHttpClient    = require("./nghttp.js");
var url             = require("url");

if (typeof angular == "object" && angular != null && "module" in angular) {
  angular.module("lightblue", [])
      .provider("lightblue", LightblueProvider);
} else {
  console.warn("nglightblue loaded but angular is not. Make sure angular is " +
      "loaded first.");
}

function LightblueProvider() {
  this._dataHost = "";
  this._metadataHost = "";
}

LightblueProvider.prototype.setHost = function(host) {
  this.setDataHost(url.resolve(host, "/data"));
  this.setMetadataHost(url.resolve(host, "/metadata"));
};

LightblueProvider.prototype.setDataHost = function(host) {
  this._dataHost = host;
};

LightblueProvider.prototype.setMetadataHost = function(host) {
  this._metadataHost = host;
};

LightblueProvider.prototype.$get = ["$http", function($http) {
  var httpClient = new NgHttpClient($http);
  var dataClient = new DataClient(httpClient, this._dataHost);
  var metadataClient = new MetadataClient(httpClient, this._metadataHost);
  
  return new LightblueClient(dataClient, metadataClient);
}];