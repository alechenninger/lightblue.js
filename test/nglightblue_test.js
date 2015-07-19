/* globals describe it beforeEach afterEach angular */
var benv   = require("benv");
var expect = require("chai").expect;

describe("nglightblue", function() {
  var testModule;

  describe("with angular frontend", function() {
    beforeEach("setup browser environment", function(done) {
      benv.setup(function() {
        benv.expose({
          angular: benv.require("../node_modules/angular/angular.js", "angular")
        });
        benv.require("../lib/nglightblue.js");
        done();
      });
    });

    beforeEach("create angular module", function() {
      testModule = angular.module("test", ["lightblue"]);
    });

    afterEach("remove browser environment", function() {
      benv.teardown();
    });

    it("registers a lightblueProvider", function(done) {
      testModule.config(["lightblueProvider", function(lightblueProvider) {
        expect(lightblueProvider).not.to.be.null;
        done();
      }]);
      
      angular.bootstrap(document, ["test"]);
    });

    it("uses $http", function(done) {
      var mock$Http = "I'm not really $http ssshhhh";

      testModule.factory("$http", function() {
        return mock$Http;
      });

      testModule.config(["lightblueProvider", function(lightblueProvider) {
        lightblueProvider.$get = ["$http", function($http) {
          expect($http).to.equal(mock$Http);
          done();
        }];
      }]);

      testModule.run(["lightblue", function(lightblue) {}]);

      angular.bootstrap(document, ["test"]);
    });
  });

  it("doesn't get mad if angular is not loaded", function() {
    require("../lib/nglightblue.js");
    // If require does not fail, we're good
  });
});
