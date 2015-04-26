/* globals describe it */
var expect       = require("chai").expect;
var NgHttpClient = require("../lib/nghttp.js");
var HttpRequest  = require("../lib/http.js").HttpRequest;

describe("NgHttpClient", function() {
  it("performs request with correct method, url, and body", function() {
    var mock$Http = {
      post: function(url, body) {
        this.url = url;
        this.body = body;
      }
    };
    
    var ngHttp = new NgHttpClient(mock$Http);
    
    ngHttp.execute(new HttpRequest("post", "http://foo", {foo: "bar"}));
    
    expect(mock$Http.url).to.equal("http://foo");
    expect(mock$Http.body).to.deep.equal({foo: "bar"});
  });
});