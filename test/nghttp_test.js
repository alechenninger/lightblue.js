/* globals describe it */
var expect       = require("chai").expect;
var NgHttpClient = require("../lib/nghttp.js");
var HttpRequest  = require("../lib/http.js").HttpRequest;
var Buffer = require("buffer").Buffer;

describe("NgHttpClient", function() {
  it("performs request with correct method, url, and body", function() {
    var method, url, body;

    var mock$Http = function(config) {
      method = config.method;
      url = config.url;
      body = config.data;
    };

    var ngHttp = new NgHttpClient(mock$Http);

    ngHttp.execute(new HttpRequest("post", "http://foo", {foo: "bar"}));

    expect(method).to.equal("post");
    expect(url).to.equal("http://foo");
    expect(body).to.deep.equal({foo: "bar"});
  });

  it("sets basic auth header if defined", function() {
    var authorizationHeader;

    mock$Http = function(config) {
      authorizationHeader = config.headers.Authorization;
    };

    var ngHttp = new NgHttpClient(mock$Http, {
      username: "Aladdin",
      password: "open sesame"
    });

    ngHttp.execute(new HttpRequest("get", "http://foo"));

    expect(authorizationHeader).to.equal("Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==");
  });
});
