/* globals describe it before */
var NodeHttpClient = require("../lib/nodehttp.js");
var HttpRequest = require("../lib/http.js").HttpRequest;
var nock = require("nock");
var expect = require("chai").expect;

describe("NodeHttpClient", function() {
  var client;

  before(function() {
    client = new NodeHttpClient();
  });

  it("makes a get request against url with path", function(done) {
    nock("http://foo.com")
      .get("/api")
      .reply(200);

    client.execute(new HttpRequest("get", "http://foo.com/api"))
      .then(function(response) {
        done();
      });
  });

  it("makes a get requst against url without path", function(done) {
    nock("http://foo.com")
      .get("/")
      .reply(200);

    client.execute(new HttpRequest("get", "http://foo.com"))
      .then(function(response) {
        done();
      });
  });

  it("makes a post request with json body", function(done) {
    nock("http://foo.com")
      .post("/", {
        foo: "bar"
      })
      .reply(200);

    client.execute(new HttpRequest("post", "http://foo.com", {
        foo: "bar"
      }))
      .then(function(response) {
        done();
      });
  });

  it("makes request and completes promise with success response body", function(done) {
    nock("http://foo.com")
      .get("/")
      .reply(200, "it works");

    client.execute(new HttpRequest("get", "http://foo.com"))
      .then(function(response) {
        expect(response).to.equal("it works");
        done();
      });
  });
});
