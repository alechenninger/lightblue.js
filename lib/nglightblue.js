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
 *   var data = lightblue.data;
 *   var field = lightblue.query.field;
 *
 *   $scope.findPerson = function() {
 *     data.find(field("name").equalTo($scope.name))
 *       .then(function(response) {
 *         $scope.person = response.processed[0];
 *       });
 *   };
 * }
 * </pre></code>
 *
 * <p>Actually, the "lightblue" module installs several services:
 * <dl>
 * <dt>"lightblue"</dt>
 * <dd>Namespace object with data, metadata, and query keys.</dd>
 * <dt>"lightblue.data"</dt>
 * <dd>Just the data client.</dd>
 * <dt>"lightblue.metadata"</dt>
 * <dd>Just the metadata client.</dd>
 * <dt>"lightblue.query"</dt>
 * <dd>The query namespace (has `field` (and eventually `array`) functions)</dd>
 */

var LightblueClient = require("./client.js");
var DataClient = require("./data.js");
var MetadataClient = require("./metadata.js");
var NgHttpClient = require("./nghttp.js");
var url = require("url");
var query = require("./query.js");

var isNgPresent = exports.isNgPresent = function() {
  return typeof angular == "object" &&
    angular !== null &&
    "module" in angular;
};

if (isNgPresent()) {
  angular.module("lightblue", [])
    .provider("lightblue.data", LightblueDataClientProvider)
    .provider("lightblue.metadata", LightblueMetadataClientProvider)
    .provider("lightblue.client", ["lightblue.dataProvider", "lightblue.metadataProvider", LightblueClientProvider])
    .provider("lightblue", ["lightblue.clientProvider", LightblueProvider])
    .service("lightblue.http", ["$http", NgHttpClient])
    .value("lightblue.query", query);
}

function LightblueProvider(clientProvider) {
  this._clientProvider = clientProvider;
}

LightblueProvider.prototype.setHost = function(host) {
  this._clientProvider.setHost(host);
};

LightblueProvider.prototype.setDataHost = function(host) {
  this._clientProvider.setDataHost(host);
};

LightblueProvider.prototype.setMetadataHost = function(host) {
  this._clientProvider.setMetadataHost(host);
};

LightblueProvider.prototype.$get = ["lightblue.client", "lightblue.query",
  function(client, query) {
    return {
      data: client.data,
      metadata: client.metadata,
      query: query
    };
  }
];

function LightblueClientProvider(dataProvider, metadataProvider) {
  this._dataProvider = dataProvider;
  this._metadataProvider = metadataProvider;
}

LightblueClientProvider.prototype.setHost = function(host) {
  this.setDataHost(resolve(host, "/data"));
  this.setMetadataHost(resolve(host, "/metadata"));
};

LightblueClientProvider.prototype.setDataHost = function(host) {
  this._dataProvider.setHost(host);
};

LightblueClientProvider.prototype.setMetadataHost = function(host) {
  this._metadataProvider.setHost(host);
};

LightblueClientProvider.prototype.$get = [
  "lightblue.data", "lightblue.metadata",
  function(data, metadata) {
    return {
      data: data,
      metadata: metadata
    };
  }
];

function LightblueDataClientProvider() {
  this._host = "";
}

LightblueDataClientProvider.prototype.setHost = function(host) {
  this._host = host;
};

LightblueDataClientProvider.prototype.$get = ["lightblue.http",
  function(httpClient) {
    return new DataClient(httpClient, this._host);
  }
];

function LightblueMetadataClientProvider() {
  this._host = "";
}

LightblueMetadataClientProvider.prototype.setHost = function(host) {
  this._host = host;
};

LightblueMetadataClientProvider.prototype.$get = ["lightblue.http",
  function(httpClient) {
    return new MetadataClient(httpClient, this._host);
  }
];
