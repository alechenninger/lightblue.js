(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function LightblueClient(host) {
  this.host = host;
}

LightblueClient.prototype.find = function(data) {
  return new FindRequest(this, data);
};

LightblueClient.prototype.insert = function(data) {
  return new InsertRequest(this, data);
};

LightblueClient.prototype.update = function(data) {
  return new UpdateRequest(this, data);
};

LightblueClient.prototype.save = function(data) {
  return new SaveRequest(this, data);
};

LightblueClient.prototype.delete = function(data) {
  return new DeleteRequest(this, data);
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
    url = resolve(client.host, "data/find", data.entity, data.version);
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
    url = resolve(client.host, "data", data.entity, data.version);
  }

  LightblueRequest.call(this, client, "put", data, url);
}

InsertRequest.prototype = new LightblueRequest();
InsertRequest.prototype.constructor = InsertRequest;

/**
 * @param data The JSON data of request
 */
function SaveRequest(client, data) {
  var url = "";

  if (client instanceof Object && data instanceof Object) {
    url = resolve(client.host, "data/save", data.entity, data.version);
  }

  LightblueRequest.call(this, client, "post", data, url);
}

SaveRequest.prototype = new LightblueRequest();
SaveRequest.prototype.constructor = SaveRequest;

/**
 * @param data The JSON data of request
 */
function UpdateRequest(client, data) {
  var url = "";

  if (client instanceof Object && data instanceof Object) {
    url = resolve(client.host, "data/update", data.entity, data.version);
  }

  LightblueRequest.call(this, client, "post", data, url);
}

UpdateRequest.prototype = new LightblueRequest();
UpdateRequest.prototype.constructor = UpdateRequest;

/**
 * @param data The JSON data of request
 */
function DeleteRequest(client, data) {
  var url = "";

  if (client instanceof Object && data instanceof Object) {
    url = resolve(client.host, "data/delete", data.entity, data.version);
  }

  LightblueRequest.call(this, client, "post", data, url);
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

  return Array.prototype.slice.call(arguments, 0).map(trimSlashes).join("/");
}
},{}],2:[function(require,module,exports){
var client = require("./client.js");
var query = require("./query.js");

exports.client = client;
exports.query = query;
},{"./client.js":1,"./query.js":3}],3:[function(require,module,exports){
/**
 * QueryExpression
 */
function QueryExpression(json) {
  if (json instanceof Object) {
    this.json = json;
  }
}

QueryExpression.prototype.and = function(expression) {
	return new AndExpression(this, expression);
};

QueryExpression.prototype.or = function(expression) {
  return new OrExpression(this, expression);
};

QueryExpression.prototype.toJSON = function() {
  return this.json;
};

/**
 * NaryLogicalExpression
 */
function NaryLogicalExpression(op, expressions) {
  this.op = op;
  this.expressions = expressions || [];

  if (expressions instanceof Array) {
    var json = {};
    
    json[op] = expressions.map(function (e) { 
      return e.toJSON(); 
    });
  }

  QueryExpression.call(this, json);
}

NaryLogicalExpression.prototype = new QueryExpression();
NaryLogicalExpression.prototype.constructor = NaryLogicalExpression;

/**
 * AndExpression
 */
function AndExpression(expressions) {
  if (!(expressions instanceof Array)) {
    expressions = Array.prototype.slice.call(arguments, 0);
  }

  NaryLogicalExpression.call(this, "$and", expressions);
}

AndExpression.prototype = new NaryLogicalExpression();
AndExpression.prototype.constructor = AndExpression;

AndExpression.prototype.and = function(expression) {
  return new AndExpression(this.expressions.concat(expression));
};

/**
 * OrExpression
 */
function OrExpression(expressions) {
  if (!(expressions instanceof Array)) {
    expressions = Array.prototype.slice.call(arguments, 0);
  }

  NaryLogicalExpression.call(this, "$or", expressions);
}

OrExpression.prototype = new NaryLogicalExpression();
OrExpression.prototype.constructor = OrExpression;

OrExpression.prototype.or = function(expression) {
  return new OrExpression(this.expressions.concat(expression));
};

/**
 * Field
 */
function Field(field) {
	this.field = field;
}

Field.prototype.__comparison = function(op, value) {
  if (value instanceof Field) {
    return new FieldComparison(this.field, op, value.field);
  }

  return new ValueComparison(this.field, op, value);
};

Field.prototype.equalTo = Field.prototype.eq = function(value) {
	return this.__comparison("$eq", value);
};

Field.prototype.greaterThan = Field.prototype.gt = function(value) {
  return this.__comparison("$gt", value);
};

/**
 * FieldComparison
 */
function FieldComparison(field, op, rfield) {
	QueryExpression.call(this, {
    "field": field,
    "op": op,
    "rfield": rfield
  });
}

FieldComparison.prototype = new QueryExpression();
FieldComparison.prototype.constructor = FieldComparison;

/**
 * ValueComparison
 */
function ValueComparison(field, op, rvalue) {
  QueryExpression.call(this, {
    "field": field,
    "op": op,
    "rvalue": rvalue
  });
}

ValueComparison.prototype = new QueryExpression();
ValueComparison.prototype.constructor = ValueComparison;

function field(name) {
  return new Field(name);
}
},{}]},{},[2]);
