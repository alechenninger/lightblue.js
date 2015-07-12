/* globals describe it */
var expect = require("chai").expect;
var MetadataClient = require("../lib/metadata.js");

describe("LightblueMetadataClient", function() {

  // Captures request sent to execute(req)
  var mockHttpClient = {
    execute: function(request) {
      this.request = request;
      return "response";
    }
  };

  var metadataClient = new MetadataClient(mockHttpClient, "myhost.com");

  describe("getNames", function() {
    it("should construct urls like ${host}/ when no status is provided", function() {
      metadataClient.getNames();

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/?$"));
    });

    it("should construct urls like ${host}/s=${status} when one status is provided", function () {
      metadataClient.getNames(["active"]);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/s=active$"));
    });

    it("should construct urls like ${host}/s=${status1},${status2} when multiple statuses are provided", function () {
      metadataClient.getNames(["active", "deprecated"]);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/s=active,deprecated?$"));
    });

    it("should use GET", function() {
      metadataClient.getNames();

      expect(mockHttpClient.request.method).to.equal("get");
    });

    it("should return result of httpclient execute", function() {
      var result = metadataClient.getNames();

      expect(result).to.equal("response");
    });
  });

  describe("getVersions", function() {
    it("should construct urls like ${host}/${entityName}", function() {
      metadataClient.getVersions("foo");

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/?$"));
    });

    it("should use GET", function() {
      metadataClient.getVersions("foo");

      expect(mockHttpClient.request.method).to.equal("get");
    });

    it("should return response from httpclient execute", function() {
      var result = metadataClient.getVersions("foo");

      expect(result).to.equal("response");
    });
  });

  describe("getRoles", function() {
    it("should construct urls like ${host}/roles when no entity or version is provided", function() {
      metadataClient.getRoles();

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/roles/?$"));
    });

    it("should construct urls like ${host}/${entityName}/roles when an entity name but no version is provided", function() {
      metadataClient.getRoles("foo");

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/roles/?$"));
    });

    it("should construct urls like ${host}/${entityName}/{$version}/roles when entity name and version are provided", function() {
      metadataClient.getRoles("foo", "1.0.0");

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/1.0.0/roles/?$"));
    });

    it("should use GET", function() {
      metadataClient.getRoles();

      expect(mockHttpClient.request.method).to.equal("get");
    });

    it("should return result of httpclient execute", function() {
      var result = metadataClient.getRoles();

      expect(result).to.equal("response");
    });
  });

  describe("getMetadata", function() {
    it("should construct urls like ${host}/${entityName}/${version}", function() {
      metadataClient.getMetadata("foo", "1.2.3");

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/1.2.3"));
    });

    it("should require name and version to be specified", function() {
      expect(metadataClient.getMetadata).to.throw(Error);
      expect(function() { metadataClient.getMetadata("foo"); }).to.throw(Error);
      expect(function() { metadataClient.getMetadata("foo", ""); }).to.throw(Error);
      expect(function() { metadataClient.getMetadata("", "1"); }).to.throw(Error);
    });

    it("should use GET", function() {
      metadataClient.getMetadata("foo", "1");
      expect(mockHttpClient.request.method).to.equal("get");
    });

    it("should return result of httpclient execute", function() {
      var result = metadataClient.getMetadata("foo", "1");
      expect(result).to.equal("response");
    });
  });
});

function ifDefined(it, otherwise) {
  return (typeof it !== "undefined") ? it : otherwise;
}
