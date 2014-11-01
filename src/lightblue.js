var Client = require("./client.js");
var query = require("./query.js");

exports.client = function(host) {
  return new Client(host);
}

exports.field = query.field;