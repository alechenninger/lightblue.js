/* globals describe it before */
var NodeHttpClient = require("../lib/nodehttp.js");
var HttpRequest = require("../lib/http.js").HttpRequest;
var nock = require("nock");
var expect = require("chai").expect;
var http = require("http");
var https = require("https");

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

  describe("with agent configured", function () {
    var realHttpRequest = http.request;
    var realHttpsRequest = https.request;

    var fakeHttpAgent = "fakeHttpAgent";
    var fakeHttpsAgent = "fakeHttpsAgent";

    var client = new NodeHttpClient({
      httpAgent: fakeHttpAgent,
      httpsAgent: fakeHttpsAgent
    });

    afterEach(function resetModsToNodeModules() {
      http.request = realHttpRequest;
      https.request = realHttpsRequest;
    });

    it("uses http agent configuration for http calls", function() {
      var agentUsed;

      http.request = function(opts) {
        agentUsed = opts.agent;
        return {
          on: function() {},
          write: function() {},
          end: function() {}
        };
      };

      client.execute(new HttpRequest("get", "http://foo.com"));

      expect(agentUsed).to.equal(fakeHttpAgent);
    });

    it("uses https agent configuration for https calls", function() {
      var agentUsed;

      https.request = function(opts) {
        agentUsed = opts.agent;
        return {
          on: function() {},
          write: function() {},
          end: function() {}
        };
      };

      client.execute(new HttpRequest("get", "https://foo.com"));

      expect(agentUsed).to.equal(fakeHttpsAgent);
    });
  });
});
