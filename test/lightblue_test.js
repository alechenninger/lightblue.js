/* globals describe it */
var expect = require("chai").expect;
var lightblue = require("../lib/lightblue.js");

var NgHttpClient = require("../lib/nghttp.js");
var NodeHttpClient = require("../lib/nodehttp.js");

describe("lightblue module", function() {
  describe("._getHttpClient", function() {
    it("should use NgHttpClient if angular is present and $http is provided", 
        function() {
      simulateAngularIsLoaded();
      
      var httpClient = lightblue._getHttpClient({
        $http: function() {}
      });
      
      expect(httpClient).to.be.instanceof(NgHttpClient);
    });
    
    it("should use NodeHttpClient if angular is not present", function() {
      expect(lightblue._getHttpClient()).to.be.instanceof(NodeHttpClient);
    });
    
    it("should use NodeHttpClient if anuglar is present but $http is not provided", 
        function() {
      simulateAngularIsLoaded();
      
      expect(lightblue._getHttpClient()).to.be.instanceof(NodeHttpClient);
    });
  });
  
  describe(".getClient", function() {
    // Captures request sent to execute(req)
    var mockHttpClient = {
      execute: function(request) {
        this.request = request;
        return "response";
      }
    };
  
    it("should use ${host}/data for data client if only one host is provided", 
        function() {
      var client = lightblue.getClient("foo.com", mockHttpClient);
      client.data.find(validFindConfig());
      expect(mockHttpClient.request.url).to.match(/^foo.com\/data.*/);
    });
    
    it("should use ${host}/metadata for metadata client if only one host is \
        provided", function() {
      var client = lightblue.getClient("foo.com", mockHttpClient);
      client.metadata.getNames();
      expect(mockHttpClient.request.url).to.match(/^foo.com\/metadata.*/);
    });
  });
});

function simulateAngularIsLoaded() {
  global.angular = {module: function() {}};
}

function validFindConfig(edit) {
  edit = edit || {};

  var config = {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    query: ifDefined(edit.query, { field: "name", op: "$eq", rvalue: "Bob" }),
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

function ifDefined(it, otherwise) {
  return (typeof it !== "undefined") ? it : otherwise;
}
