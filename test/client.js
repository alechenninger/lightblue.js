var expect = require("chai").expect,
    client = require("../lib/lightblue").client;

describe("lightblue REST client", function() {
  describe("find", function() {
    it("should construct urls like ${host}/data/find/${entity}/${version}", function() {
      var findRequest = client("myhost.com/rest").find(validFindBody({
        entity: "myEntity",
        version: "myVersion"
      }));

      expect(findRequest.url).to.match(new RegExp("^myhost.com/rest/data/find/myEntity/myVersion/?$"));
    });

    it("should use POST", function() {
      var findRequest = client("myhost.com/rest").find(validFindBody());

      expect(findRequest.method).to.equal("post");
    });

    it("should should include request data", function() {
      var body = validFindBody();
      var bodyCopy = JSON.parse(JSON.stringify(body));

      var findRequest = client("myhost.com/rest").find(body);

      expect(findRequest.data).to.deep.equal(bodyCopy);
    });
  });

  describe("insert", function() {
    it("should construct urls like ${host/data/${entity}/${version}", function() {
      var insertRequest = client("myhost.com/rest").insert(validInsertBody({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(insertRequest.url).to.match(new RegExp("^myhost.com/rest/data/myEntity/1.2.0/?$"));
    });

    it("should use PUT", function() {
      var insertRequest = client("myhost.com").insert(validInsertBody());

      expect(insertRequest.method).to.equal("put");
    });

    it("should include request data", function() {
      var body = validInsertBody();
      var bodyCopy = JSON.parse(JSON.stringify(body));

      var insertRequest = client("myhost.com").insert(body);

      expect(insertRequest.data).to.deep.equal(bodyCopy);
    });
  });

  describe("update", function() {
    it("should construct urls like ${host/data/update/${entity}/${version}", function() {
      var updateRequest = client("myhost.com/rest").update(validUpdateBody({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(updateRequest.url).to.match(new RegExp("^myhost.com/rest/data/update/myEntity/1.2.0/?$"));
    });

    it("should use POST", function() {
      var updateRequest = client("myhost.com").update(validUpdateBody());

      expect(updateRequest.method).to.equal("post");
    });

    it("should include request data", function() {
      var body = validUpdateBody();
      var bodyCopy = JSON.parse(JSON.stringify(body));

      var updateRequest = client("myhost.com").update(body);

      expect(updateRequest.data).to.deep.equal(bodyCopy);
    });
  });

  describe("delete", function() {
    it("should construct urls like ${host/data/save/${entity}/${version}", function() {
      var saveRequest = client("myhost.com/rest").save(validSaveBody({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(saveRequest.url).to.match(new RegExp("^myhost.com/rest/data/save/myEntity/1.2.0/?$"));
    });

    it("should use POST", function() {
      var saveRequest = client("myhost.com").save(validSaveBody());

      expect(saveRequest.method).to.equal("post");
    });

    it("should include request data", function() {
      var body = validSaveBody();
      var bodyCopy = JSON.parse(JSON.stringify(body));

      var saveRequest = client("myhost.com").save(body);

      expect(saveRequest.data).to.deep.equal(bodyCopy);
    });
  });

  describe("delete", function() {
    it("should construct urls like ${host/data/delete/${entity}/${version}", function() {
      var deleteRequest = client("myhost.com/rest").delete(validDeleteBody({
        entity: "myEntity",
        version: "1.2.0"
      }));

      expect(deleteRequest.url).to.match(new RegExp("^myhost.com/rest/data/delete/myEntity/1.2.0/?$"));
    });

    it("should use POST", function() {
      var deleteRequest = client("myhost.com").delete(validDeleteBody());

      expect(deleteRequest.method).to.equal("post");
    });

    it("should include request data", function() {
      var body = validDeleteBody();
      var bodyCopy = JSON.parse(JSON.stringify(body));

      var deleteRequest = client("myhost.com").delete(body);

      expect(deleteRequest.data).to.deep.equal(bodyCopy);
    });
  });

});

function validFindBody(edit) {
  edit = edit || {};

  return {
    entity: edit.entity || "bob",
    version: edit.version || "1.0",
    query: edit.query || { field: "name", op: "$eq", "rvalue": "Bob" },
    projection: edit.projection || { include: "*" }
  };
}

function validInsertBody(edit) {
  edit = edit || {};

  return {
    entity: edit.entity || "user",
    version: edit.version || "1.0",
    data: edit.data || [{
      name: "bob"
    }],
    projection: edit.projection || { include: "*" }
  };
}

function validUpdateBody(edit) {
  edit = edit || {};

  return {
    entity: edit.entity || "user",
    version: edit.version || "1.0",
    query: edit.query || { field: "name", op: "$eq", "rvalue": "Bob" },
    update: edit.update || {
      $set: {
        name: "Jim"
      }
    },
    projection: edit.projection || { include: "*" }
  };
}

function validSaveBody(edit) {
  edit = edit || {};

  return {
    entity: edit.entity || "user",
    version: edit.version || "1.0",
    data: edit.data || [{
      name: "bob"
    }],
    upsert: edit.upsert || true,
    projection: edit.projection || { include: "*" }
  };
}

function validDeleteBody(edit) {
  edit = edit || {};

  return {
    entity: edit.entity || "user",
    version: edit.version || "1.0",
    query: edit.query || { field: "name", op: "$eq", "rvalue": "Bob" }
  };
}