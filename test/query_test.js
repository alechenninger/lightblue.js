var expect = require("chai").expect;
var query = require("../lib/query");
var field = query.field;

describe("Value comparison expressions", function() {
  describe("field('foo').equalTo('bar')", function() {
    var fooIsBar = field("foo").equalTo("bar");

    it("should construct a ValueComparison object", function() {
      expect(fooIsBar).instanceof(query.ValueComparison);
    });

    it("should have correct properties for field, op, and rvalue", function() {
      expect(Object.keys(fooIsBar)).to.have.members(["field", "op", "rvalue"]);

      expect(fooIsBar.field).to.equal("foo");
      expect(fooIsBar.op).to.satisfy(function isEqualsOperator(op) { 
        return op === "=" || op === "$eq"; 
      });
      expect(fooIsBar.rvalue).to.equal("bar");
    });
  });
});
