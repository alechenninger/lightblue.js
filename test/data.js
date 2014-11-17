var expect = require("chai").expect,
    client = require("../lib/lightblue").getDataClient;

describe("LightblueDataClient", function() {
  describe("find", function() {
    it("should construct urls like ${host}/find/${entity}/${version}", function() {
      var findRequest = client("myhost.com").find(validFindConfig({
        entity: "myEntity",
        version: "myVersion"
      }));

      expect(findRequest.url).to.match(new RegExp("^myhost.com/find/myEntity/myVersion/?$"));
    });

    it("should construct urls like ${host}/find/${entity} when version is undefined", function () {
      var config = validFindConfig({
        entity: "myEntity"});
      delete config.version;

      var findRequest = client("myhost.com").find(config);

      expect(findRequest.url).to.match(new RegExp("^myhost.com/find/myEntity/?$"));
    });

    it("should construct urls like ${host}/find/${entity} when version is empty string", function () {
      var config = validFindConfig({
        entity: "myEntity",
        version: ""
      });

      var findRequest = client("myhost.com").find(config);

      expect(findRequest.url).to.match(new RegExp("^myhost.com/find/myEntity/?$"));
    });

    it("should use POST", function() {
      var findRequest = client("myhost.com").find(validFindConfig());

      expect(findRequest.method).to.equal("post");
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

      var findRequest = client("myhost.com").find(config);
      expect(findRequest.body).to.deep.equal(expectedBody);
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

      var findRequest = client("myhost.com").find(config);
      expect(findRequest.body).to.deep.equal(expectedBody);
    });

    it("should allow expressing range as an object with from and to properties", function() {
      var findRequest = client("myhost.com").find(validFindConfig({
        range: {from: 1, to: 10}
      }));

      expect(findRequest.body.range[0]).to.equal(1);
      expect(findRequest.body.range[1]).to.equal(10);
    });
  });

  describe("insert", function() {
    it("should construct urls like ${host}/insert/${entity}/${version}", function() {
      var insertRequest = client("myhost.com").insert(validInsertConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(insertRequest.url).to.match(new RegExp("^myhost.com/insert/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/insert/${entity} when version is undefined", function () {
      var config = validInsertConfig({entity: "myEntity"});
      delete config.version;

      var insertRequest = client("myhost.com").insert(config);

      expect(insertRequest.url).to.match(new RegExp("^myhost.com/insert/myEntity/?$"));
    });

    it("should construct urls like ${host}/insert/${entity} when version is empty string", function () {
      var config = validInsertConfig({
        entity: "myEntity",
        version: ""
      });

      var insertRequest = client("myhost.com").insert(config);

      expect(insertRequest.url).to.match(new RegExp("^myhost.com/insert/myEntity/?$"));
    });

    it("should use PUT", function() {
      var insertRequest = client("myhost.com").insert(validInsertConfig());

      expect(insertRequest.method).to.equal("put");
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

      var insertRequest = client("myhost.com").insert(config);

      expect(insertRequest.body).to.deep.equal(expectedBody);
    });
  });

  describe("update", function() {
    it("should construct urls like ${host}/update/${entity}/${version}", function() {
      var updateRequest = client("myhost.com").update(validUpdateConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(updateRequest.url).to.match(new RegExp("^myhost.com/update/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/update/${entity} when version is undefined", function () {
      var config = validUpdateConfig({entity: "myEntity"});
      delete config.version;

      var updateRequest = client("myhost.com").update(config);

      expect(updateRequest.url).to.match(new RegExp("^myhost.com/update/myEntity/?$"));
    });

    it("should construct urls like ${host}/update/${entity} when version is empty string", function () {
      var config = validUpdateConfig({
        entity: "myEntity",
        version: ""
      });

      var updateRequest = client("myhost.com").update(config);

      expect(updateRequest.url).to.match(new RegExp("^myhost.com/update/myEntity/?$"));
    });

    it("should use POST", function() {
      var updateRequest = client("myhost.com").update(validUpdateConfig());

      expect(updateRequest.method).to.equal("post");
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

      var updateRequest = client("myhost.com").update(config);

      expect(updateRequest.body).to.deep.equal(expectedBody);
    });
  });

  describe("save", function() {
    it("should construct urls like ${host}/save/${entity}/${version}", function() {
      var saveRequest = client("myhost.com").save(validSaveConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(saveRequest.url).to.match(new RegExp("^myhost.com/save/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/save/${entity} when version is undefined", function () {
      var config = validSaveConfig({entity: "myEntity"});
      delete config.version;

      var saveRequest = client("myhost.com").save(config);

      expect(saveRequest.url).to.match(new RegExp("^myhost.com/save/myEntity/?$"));
    });

    it("should construct urls like ${host}/save/${entity} when version is empty string", function () {
      var config = validSaveConfig({
        entity: "myEntity",
        version: ""
      });

      var saveRequest = client("myhost.com").save(config);

      expect(saveRequest.url).to.match(new RegExp("^myhost.com/save/myEntity/?$"));
    });

    it("should use POST", function() {
      var saveRequest = client("myhost.com").save(validSaveConfig());

      expect(saveRequest.method).to.equal("post");
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

      var saveRequest = client("myhost.com").save(config);

      expect(saveRequest.body).to.deep.equal(expectedBody);
    });
  });

  describe("delete", function() {
    it("should construct urls like ${host/data/delete/${entity}/${version}", function() {
      var deleteRequest = client("myhost.com").delete(validDeleteConfig({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(deleteRequest.url).to.match(new RegExp("^myhost.com/delete/myEntity/1.2.0/?$"));
    });

    it("should construct urls like ${host}/delete/${entity} when version is undefined", function () {
      var config = validDeleteConfig({entity: "myEntity"});
      delete config.version;

      var deleteRequest = client("myhost.com").delete(config);

      expect(deleteRequest.url).to.match(new RegExp("^myhost.com/delete/myEntity/?$"));
    });

    it("should construct urls like ${host}/delete/${entity} when version is empty string", function () {
      var config = validDeleteConfig({
        entity: "myEntity",
        version: ""
      });

      var deleteRequest = client("myhost.com").delete(config);

      expect(deleteRequest.url).to.match(new RegExp("^myhost.com/delete/myEntity/?$"));
    });

    it("should use POST", function() {
      var deleteRequest = client("myhost.com").delete(validDeleteConfig());

      expect(deleteRequest.method).to.equal("post");
    });

    it("should include request data", function() {
      var expectedBody = {
        objectType: "wizard",
        version: "1.0.0",
        query: {field: "name", op: "=", rvalue: "Voldemort"}
      }

      var config = {
        entity: expectedBody.objectType,
        version: expectedBody.version,
        query: expectedBody.query
      };

      var deleteRequest = client("myhost.com").delete(config);

      expect(deleteRequest.body).to.deep.equal(expectedBody);
    });
  });

});

function validFindConfig(edit) {
  edit = edit || {};

  var config = {
    entity: ifDefined(edit.entity, "user"),
    version: ifDefined(edit.version, "1.0"),
    query: ifDefined(edit.query, { field: "name", op: "$eq", "rvalue": "Bob" }),
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
    query: ifDefined(edit.query, { field: "name", op: "$eq", "rvalue": "Bob" }),
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
    query: ifDefined(edit.query, { field: "name", op: "$eq", "rvalue": "Bob" })
  };
}

function ifDefined(it, otherwise) {
  return (typeof it !== "undefined") ? it : otherwise;
}