function LightblueClient(host) {
  this.host = host;
}

LightblueClient.prototype.find = function(data) {
  return new FindRequest(this, data);
};

LightblueClient.prototype.insert = function(data) {
  return new InsertRequest(this, data);
};

function LightblueRequest(client, method, data, url) {
  this.client = client;
  this.method = (typeof method === "string") ? method.toLowerCase() : "";
  this.METHOD = this.method.toUpperCase();
  this.data = data;
  this.url = url;
}

/**
 * @param data The JSON data of request
 */
function FindRequest(client, data) {
  var url = "";

  if (client instanceof Object && data instanceof Object) {
    url = resolve(client.host, "data/insert", data.entity, data.version);
  }

  LightblueRequest.call(this, client, "post", data, url);
}

FindRequest.prototype = new LightblueRequest();
FindRequest.prototype.constructor = FindRequest;

/**
 * @param data The JSON data of request
 */
function InsertRequest(client, data) {
  var url = "";

  if (client instanceof Object && data instanceof Object) {
    url = resolve(client.host, "data/insert", data.entity, data.version);
  }

  LightblueRequest.call(this, client, "put", data, url);
}

InsertRequest.prototype = new LightblueRequest();
InsertRequest.prototype.constructor = InsertRequest;

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
  
  return Array.prototype.slice.call(arguments, 0).map(trimSlashes).join("/");
}