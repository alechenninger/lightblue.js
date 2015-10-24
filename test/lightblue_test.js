/* globals describe it */
var expect = require("chai").expect;
var lightblue = require("../lib/lightblue.js");

var NgHttpClient = require("../lib/nghttp.js");
var NodeHttpClient = require("../lib/nodehttp.js");

describe("lightblue module", function() {
  describe(".getHttpClient", function() {
    it("should use NgHttpClient if angular is present and $http is provided", 
        function() {
      simulateAngularIsLoaded();
      
      var httpClient = lightblue.getHttpClient({
        $http: function() {}
      });
      
      expect(httpClient).to.be.instanceof(NgHttpClient);
    });
    
    it("should use NodeHttpClient if angular is not present", function() {
      expect(lightblue.getHttpClient()).to.be.instanceof(NodeHttpClient);
    });
    
    it("should use NodeHttpClient if anuglar is present but $http is not provided", 
        function() {
      simulateAngularIsLoaded();
      
      expect(lightblue.getHttpClient()).to.be.instanceof(NodeHttpClient);
    })
  });
});

function simulateAngularIsLoaded() {
  global.angular = {module: function() {}};
}