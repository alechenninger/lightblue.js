module.exports = LightblueClient;

function LightblueClient(host) {
  this.host = host;
}

LightblueClient.prototype.find = function(data) {
  return new FindRequest(this.host, data);
};

LightblueClient.prototype.insert = function(data) {
  return new InsertRequest(this.host, data);
};

LightblueClient.prototype.update = function(data) {
  return new UpdateRequest(this.host, data);
};

LightblueClient.prototype.save = function(data) {
  return new SaveRequest(this.host, data);
};

LightblueClient.prototype.delete = function(data) {
  return new DeleteRequest(this.host, data);
};

function LightblueRequest(method, data, url) {
  this.method = (typeof method === "string") ? method.toLowerCase() : "";
  this.METHOD = this.method.toUpperCase();
  this.data = data;
  this.url = url;
}

/**
 * @param data The JSON data of request
 */
function FindRequest(host, data) {
  var url = "";

  if (data instanceof Object) {
    url = resolve(host, "data/find", data.entity, data.version);
  }

  LightblueRequest.call(this, "post", data, url);
}

FindRequest.prototype = new LightblueRequest();
FindRequest.prototype.constructor = FindRequest;

/**
 * @param data The JSON data of request
 */
function InsertRequest(host, data) {
  var url = "";

  if (data instanceof Object) {
    url = resolve(host, "data", data.entity, data.version);
  }

  LightblueRequest.call(this, "put", data, url);
}

InsertRequest.prototype = new LightblueRequest();
InsertRequest.prototype.constructor = InsertRequest;

/**
 * @param data The JSON data of request
 */
function SaveRequest(host, data) {
  var url = "";

  if (data instanceof Object) {
    url = resolve(host, "data/save", data.entity, data.version);
  }

  LightblueRequest.call(this, "post", data, url);
}

SaveRequest.prototype = new LightblueRequest();
SaveRequest.prototype.constructor = SaveRequest;

/**
 * @param data The JSON data of request
 */
function UpdateRequest(host, data) {
  var url = "";

  if (data instanceof Object) {
    url = resolve(host, "data/update", data.entity, data.version);
  }

  LightblueRequest.call(this, "post", data, url);
}

UpdateRequest.prototype = new LightblueRequest();
UpdateRequest.prototype.constructor = UpdateRequest;

/**
 * @param data The JSON data of request
 */
function DeleteRequest(host, data) {
  var url = "";

  if (data instanceof Object) {
    url = resolve(host, "data/delete", data.entity, data.version);
  }

  LightblueRequest.call(this, "post", data, url);
}

DeleteRequest.prototype = new LightblueRequest();
DeleteRequest.prototype.constructor = DeleteRequest;

function resolve() {
  if (arguments.length === 0) {
    return "";
  }

  function trimSlashes(s) {
    if (typeof s !== "string") {
      return "";
    }

    s = s.replace(new RegExp("^/*"), "");
    s = s.replace(new RegExp("/*$"), "");

    return s;
  }

  function isNotUndefined(arg) {
    return typeof arg !== "undefined";
  }

  return Array.prototype.slice.call(arguments, 0)
      .filter(isNotUndefined)
      .map(trimSlashes)
      .join("/");
}