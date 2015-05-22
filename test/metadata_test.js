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
});

function validFindConfig(edit) {
  edit = edit || {};

  var config = {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    query: ifDefined(edit.query, { field: "name", op: "$eq", "rvalue": "Bob" }),
    projection: ifDefined(edit.projection, { include: "*" })
  };

  if (edit.sort) {
    config.sort = edit.sort;
  }

  if (edit.range) {
    config.range = edit.range;
  }

  return config;
}

function validInsertConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    data: ifDefined(edit.data, [{
      name: "bob"
    }]),
    projection: ifDefined(edit.projection, { include: "*" })
  };
}

function validUpdateConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    query: ifDefined(edit.query, { field: "name", op: "$eq", "rvalue": "Bob" }),
    update: ifDefined(edit.update, {
      $set: {
        name: "Jim"
      }
    }),
    projection: ifDefined(edit.projection, { include: "*" })
  };
}

function validSaveConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    data: ifDefined(edit.data, [{
      name: "bob"
    }]),
    upsert: ifDefined(edit.upsert, true),
    projection: ifDefined(edit.projection, { include: "*" })
  };
}

function validDeleteConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    query: ifDefined(edit.query, { field: "name", op: "$eq", "rvalue": "Bob" })
  };
}

function ifDefined(it, otherwise) {
  return (typeof it !== "undefined") ? it : otherwise;
}