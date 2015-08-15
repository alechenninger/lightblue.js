/* globals describe it */
var expect = require("chai").expect;
var DataClient = require("../lib/data.js");

describe("LightblueDataClient", function() {

  // Captures request sent to execute(req)
  var mockHttpClient = {
    execute: function(request) {
      this.request = request;
      return "response";
    }
  };

  var dataClient = new DataClient(mockHttpClient, "myhost.com");

  describe("find", function() {
    it("should construct urls like ${host}/find/${entity}/${version}", function() {
      dataClient.find(validFindConfig({
        entity: "myEntity",
        version: "myVersion"
      }));

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/find/myEntity/myVersion/?$"));
    });

    it("should construct urls like ${host}/find/${entity} when version is undefined", function () {
      var config = validFindConfig({entity: "myEntity"});
      delete config.version;

      dataClient.find(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/find/myEntity/?$"));
    });

    it("should construct urls like ${host}/find/${entity} when version is empty string", function () {
      var config = validFindConfig({
        entity: "myEntity",
        version: ""
      });

      dataClient.find(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/find/myEntity/?$"));
    });

    it("should use POST", function() {
      dataClient.find(validFindConfig());

      expect(mockHttpClient.request.method).to.equal("post");
    });

    it("should construct request body with objectType, version, query and projection", function() {
      var expectedBody = {
        objectType: "User",
        version: "1.0.0",
        query: { field: "name", "op": "=", rvalue: "bob" },
        projection: { field: "*", include: true }
      };

      var config = {
        entity: expectedBody.objectType,
        version: expectedBody.version,
        query: expectedBody.query,
        projection: expectedBody.projection
      };

      dataClient.find(config);

      expect(mockHttpClient.request.body).to.deep.equal(expectedBody);
    });

    it("should construct request body with objectType, version, query, projection, sort, and range", function() {
      var expectedBody = {
        objectType: "User",
        version: "1.0.0",
        query: {field: "name", "op": "=", rvalue: "bob"},
        projection: {field: "*", include: true},
        sort: {"name": "asc"},
        range: [0, 10]
      };

      var config = {
        entity: expectedBody.objectType,
        version: expectedBody.version,
        query: expectedBody.query,
        projection: expectedBody.projection,
        sort: expectedBody.sort,
        range: expectedBody.range
      };

      dataClient.find(config);

      expect(mockHttpClient.request.body).to.deep.equal(expectedBody);
    });

    it("should allow expressing range as an object with from and to properties", function() {
      dataClient.find(validFindConfig({
        range: {from: 1, to: 10}
      }));

      expect(mockHttpClient.request.body.range[0]).to.equal(1);
      expect(mockHttpClient.request.body.range[1]).to.equal(10);
    });

    it("should return result of http client execute", function() {
      var response = dataClient.find(validFindConfig());

      expect(response).to.equal("response");
    });
  });

  describe("insert", function() {
    it("should construct urls like ${host}/insert/${entity}/${version}", function() {
      dataClient.insert(validInsertConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/insert/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/insert/${entity} when version is undefined", function () {
      var config = validInsertConfig({entity: "myEntity"});
      delete config.version;

      dataClient.insert(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/insert/myEntity/?$"));
    });

    it("should construct urls like ${host}/insert/${entity} when version is empty string", function () {
      var config = validInsertConfig({
        entity: "myEntity",
        version: ""
      });

      dataClient.insert(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/insert/myEntity/?$"));
    });

    it("should use PUT", function() {
      dataClient.insert(validInsertConfig());

      expect(mockHttpClient.request.method).to.equal("put");
    });

    it("should include request data", function() {
      var expectedBody = {
        objectType: "user",
        version: "1.1.1",
        data: [{name: "Bob"}],
        projection: {field: "*", include: true}
      };

      var config = {
        entity: expectedBody.objectType,
        version: expectedBody.version,
        data: expectedBody.data,
        projection: expectedBody.projection
      };

      dataClient.insert(config);

      expect(mockHttpClient.request.body).to.deep.equal(expectedBody);
    });

    it("should return result of http client execute", function() {
      var response = dataClient.insert(validInsertConfig());

      expect(response).to.equal("response");
    });
  });

  describe("update", function() {
    it("should construct urls like ${host}/update/${entity}/${version}", function() {
      dataClient.update(validUpdateConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/update/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/update/${entity} when version is undefined", function () {
      var config = validUpdateConfig({entity: "myEntity"});
      delete config.version;

      dataClient.update(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/update/myEntity/?$"));
    });

    it("should construct urls like ${host}/update/${entity} when version is empty string", function () {
      var config = validUpdateConfig({
        entity: "myEntity",
        version: ""
      });

      dataClient.update(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/update/myEntity/?$"));
    });

    it("should use POST", function() {
      dataClient.update(validUpdateConfig());

      expect(mockHttpClient.request.method).to.equal("post");
    });

    it("should include request data", function() {
      var expectedBody = {
        objectType: "user",
        version: "3.0.0",
        query: {field: "name", op: "=", rvalue: "Joe"},
        update: {$set: {name: "Jim"}},
        projection: {field: "*", include: true}
      };

      var config = {
        entity: expectedBody.objectType,
        version: expectedBody.version,
        query: expectedBody.query,
        update: expectedBody.update,
        projection: expectedBody.projection
      };

      dataClient.update(config);

      expect(mockHttpClient.request.body).to.deep.equal(expectedBody);
    });

    it("should return result of http client execute", function() {
      var response = dataClient.update(validUpdateConfig());

      expect(response).to.equal("response");
    });
  });

  describe("save", function() {
    it("should construct urls like ${host}/save/${entity}/${version}", function() {
      dataClient.save(validSaveConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/save/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/save/${entity} when version is undefined", function () {
      var config = validSaveConfig({entity: "myEntity"});
      delete config.version;

      dataClient.save(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/save/myEntity/?$"));
    });

    it("should construct urls like ${host}/save/${entity} when version is empty string", function () {
      var config = validSaveConfig({
        entity: "myEntity",
        version: ""
      });

      dataClient.save(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/save/myEntity/?$"));
    });

    it("should use POST", function() {
      dataClient.save(validSaveConfig());

      expect(mockHttpClient.request.method).to.equal("post");
    });

    it("should include request data", function() {
      var expectedBody = {
        objectType: "employee",
        version: "2.0.0",
        data: [{name: "Sally", job: "Programmer"}],
        projection: {field: "job", include: true},
        upsert: true
      };

      var config = {
        entity: expectedBody.objectType,
        version: expectedBody.version,
        data: expectedBody.data,
        projection: expectedBody.projection,
        upsert: expectedBody.upsert
      };

      dataClient.save(config);

      expect(mockHttpClient.request.body).to.deep.equal(expectedBody);
    });

    it("should return result of http client execute", function() {
      var response = dataClient.save(validSaveConfig());

      expect(response).to.equal("response");
    });
  });

  describe("delete", function() {
    it("should construct urls like ${host}/data/delete/${entity}/${version}", function() {
      dataClient.delete(validDeleteConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/delete/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/delete/${entity} when version is undefined", function () {
      var config = validDeleteConfig({entity: "myEntity"});
      delete config.version;

      dataClient.delete(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/delete/myEntity/?$"));
    });

    it("should construct urls like ${host}/delete/${entity} when version is empty string", function () {
      var config = validDeleteConfig({
        entity: "myEntity",
        version: ""
      });

      dataClient.delete(config);

      expect(mockHttpClient.request.url).to.match(new RegExp("^myhost.com/delete/myEntity/?$"));
    });

    it("should use POST", function() {
      dataClient.delete(validDeleteConfig());

      expect(mockHttpClient.request.method).to.equal("post");
    });

    it("should include request data", function() {
      var expectedBody = {
        objectType: "wizard",
        version: "1.0.0",
        query: {field: "name", op: "=", rvalue: "Voldemort"}
      };

      var config = {
        entity: expectedBody.objectType,
        version: expectedBody.version,
        query: expectedBody.query
      };

      dataClient.delete(config);

      expect(mockHttpClient.request.body).to.deep.equal(expectedBody);
    });

    it("should return result of http client execute", function() {
      var response = dataClient.delete(validDeleteConfig());

      expect(response).to.equal("response");
    });
  });
});

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

function validInsertConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    data: ifDefined(edit.data, [{
      name: "bob"
    }]),
    projection: ifDefined(edit.projection, { include: "*" })
  };
}

function validUpdateConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    query: ifDefined(edit.query, { field: "name", op: "$eq", rvalue: "Bob" }),
    update: ifDefined(edit.update, {
      $set: {
        name: "Jim"
      }
    }),
    projection: ifDefined(edit.projection, { include: "*" })
  };
}

function validSaveConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    data: ifDefined(edit.data, [{
      name: "bob"
    }]),
    upsert: ifDefined(edit.upsert, true),
    projection: ifDefined(edit.projection, { include: "*" })
  };
}

function validDeleteConfig(edit) {
  edit = edit || {};

  return {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    query: ifDefined(edit.query, { field: "name", op: "$eq", rvalue: "Bob" })
  };
}

function ifDefined(it, otherwise) {
  return (typeof it !== "undefined") ? it : otherwise;
}
