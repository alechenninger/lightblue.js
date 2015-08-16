/* globals describe it beforeEach afterEach angular */
var benv   = require("benv");
var expect = require("chai").expect;

describe("nglightblue", function() {
  it("doesn't get mad if angular is not loaded", function() {
    require("../lib/nglightblue.js");
    // If require does not fail, we're good
  });

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

    var testModule;

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

    it("uses NgHttpClient", function(done) {
      var mockNgHttpClient = {
        execute: function() {
          done();
        }
      };

      testModule.value("lightblue.http", mockNgHttpClient);

      testModule.run(["lightblue", function(lightblue) {
        lightblue.data.find({
          entity: "foo",
          version: "1.0.0",
          query: {field: "bar", op: "=", rvalue: "baz"},
          projection: {field: "*", include: true}
        });
      }]);

      angular.bootstrap(document, ["test"]);
    });

    // TODO: Add tests for configuring each provider
  });
});
