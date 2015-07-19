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

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/1.2.3/?$"));
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

  describe("getDependencies", function() {
    it("returns result of GET ${host}/${entityName}/dependencies if entity name but no version is provided", function() {
      var result = metadataClient.getDependencies("foo");
      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/dependencies/?$"));
      expect(mockHttpClient.request.method).to.equal("get");
      expect(result).to.equal("response");
    });

    it("returns result of GET ${host}/${entityName}/${version}/dependencies if both entity name and version are provided", function() {
      var result = metadataClient.getDependencies("foo", "1.2.3");
      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/1.2.3/dependencies/?$"));
      expect(mockHttpClient.request.method).to.equal("get");
      expect(result).to.equal("response");
    });

    it("returns result of GET ${host}/dependencies if neither entity name or version is provided", function() {
      var result = metadataClient.getDependencies();
      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/dependencies/?$"));
      expect(mockHttpClient.request.method).to.equal("get");expect(result).to.equal("response");
    });

    it("does not allow only passing a version", function() {
      expect(function () {
        metadataClient.getDependencies(undefined, "1.2.3");
      }).to.throw(Error);
    });
  });

  describe("putMetadata", function() {
    it("constructs urls like ${host}/${entityName}/${version} using name and version from schema", function() {
      metadataClient.putMetadata(fooV1);
      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/foo/1/?$"));
    });

    it("requires entity name and version in metadata", function() {
      expect(function() {
        metadataClient.putMetadata(metadataMissingNameAndVersion);
      }).to.throw(Error);
    });

    it("requires entity name to match in entity info and schema", function() {
      expect(function() {
        metadataClient.putMetadata(mismatchedNameMetadata);
      }).to.throw(Error);
    });

    it("uses PUT", function() {
      metadataClient.putMetadata(fooV1);
      expect(mockHttpClient.request.method).to.equal("put");
    });

    it("returns result of httpclient execute", function() {
      var result = metadataClient.putMetadata(fooV1);
      expect(result).to.equal("response");
    });
  });

  describe("addSchema", function() {
    it("should construct urls like ${host}/${entityName}/schema=${version} using name and version from entity info");

    it("requires entity name and version in schema");

    it("uses PUT");

    it("returns result of httpclient execute");
  });

  describe("updateEntityInfo", function() {
    it("constructs urls like ${host}/${entityName} using name from entity info");

    it("requires entity name in schema");

    it("uses PUT");

    it("returns result of httpclient execute");
  });

  describe("updateSchemaStatus", function() {
    it("constructs urls like ${host}/${entityName}/${version}/${status} when no comment is provided");

    it("constructs urls like ${host}/${entityName}/${version}/${status}?comment=${url encoded comment} when comment is provided");

    it("requires name version and status");

    it("requires status to be one of: [active, deprecated, disabled]");

    it("uses PUT");

    it("returns result of httpclient execute");
  });

  describe("activateSchema", function() {
    it("uses PUT");

    it("returns result of httpclient execute");
  });

  describe("deprecateSchema", function() {
    it("uses PUT");

    it("returns result of httpclient execute");
  });

  describe("disableSchema", function() {
    it("uses PUT");

    it("returns result of httpclient execute");
  });

  describe("removeDefaultVersion", function() {
    it("constructs urls like ${host}/{entityName}/default");

    it("requires entity name");

    it("uses DELETE");

    it("returns result of httpclient execute");
  });

  describe("setDefaultVersion", function() {
    it("constructs urls like ${host}/${entityName}/${version}/default");

    it("requires entity name and version");

    it("uses POST");

    it("returns result of httpclient execute");
  });

  describe("removeEntity", function() {
    it("constructs urls like ${host}/${entityName}");

    it("requires entity name");

    it("uses DELETE");

    it("returns result of httpclient execute");
  });
});

var fooV1 = {
  "entityInfo": {
    "name": "foo",
    "indexes": [
      {
        "name": null,
        "unique": true,
        "fields": [
          {
            "field": "_id",
            "dir": "$asc"
          }
        ]
      }
    ],
    "datastore": {
      "database": "mongo",
      "datasource": "mongo",
      "collection": "foo",
      "backend": "mongo"
    }
  },
  "schema": {
    "name": "foo",
    "version": {
      "value": "1",
      "changelog": "Initial"
    },
    "status": {
      "value": "active"
    },
    "access": {
      "insert": [
        "anyone"
      ],
      "update": [
        "anyone"
      ],
      "find": [
        "anyone"
      ],
      "delete": [
        "anyone"
      ]
    },
    "fields": {
      "_id": {
        "type": "string",
        "constraints": {
          "identity": true
        }
      },
      "bar": {
        "type": "string"
      },
      "objectType": {
        "type": "string",
        "access": {
          "find": [
            "anyone"
          ],
          "update": [
            "anyone"
          ]
        },
        "constraints": {
          "minLength": 1,
          "required": true
        }
      }
    }
  }
};

var metadataMissingNameAndVersion = (function() {
  var m = JSON.parse(JSON.stringify(fooV1));
  m.entityInfo.name = "";
  m.schema.name = "";
  m.schema.version.value = "";
  return m;
})();

var mismatchedNameMetadata = (function() {
  var m = JSON.parse(JSON.stringify(fooV1));
  m.entityInfo.name = "foo";
  m.schema.name = "bar";
  return m;
})();
