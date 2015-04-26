# lightblue.js

A [lightblue](https://github.com/lightblue-platform) client written in Javascript.

Write...
- Node.JS apps talking to a Lightblue REST service
- Client side apps communicating with a server that forwards requests to a Lightblue REST service

## Install

`bower install lightblue.js --save`

`npm install lightblue.js --save`

`git clone https://github.com/alechenninger/lightblue.js.git`


## Imports

### Vanilla.js

```javascript
// No module framework (use window.lightblue)
<script src="lightblue.min.js" type="text/javascript"></script>
```

### Browserify (CommonJS) or RequireJS (AMD)
```js
// commonjs
var lightblue = require("lightblue");

// asynchronous module definition (amd)
require(["lightblue"], function(lightblue) {
  ...
});
```

### AngularJS
Include `dist/ng.lightblue.min.js` for a "lightblue" angular module which 
defines a `lightblueProvider` (and therefore a `lightblue` service).

```js
var app = angular.module("app", ["lightblue"]);

app.config(["lightblueProvider", function(lightblueProvider) {
  lightblueProvider.setHost("http://my.lightblue.com");
}]);

app.controller("ctrl", ["lightblue", function(lightblue) {
  lightblue.data.find(...)
      .then(...);
}]);
```

**At the moment you will also need to include the global lightblue namespace 
via standard "lightblue.min.js" to get query builder API and such. See 
[issue #9](/issues/9).**

## Construct a find request

```javascript
// Assumes /data and /metadata for data and metadata services respectively, 
// but you can override.
// If you're using the angular module, the client is the `lightblue` service.
var client = lightblue.getClient("http://my.lightblue.host.com/rest"); 
var field = lightblue.field;

var find = client.data.find({
  entity: "User",
  version: "1.0.0",
  // Query builder, or just pass a query string
  query: field("username").equalTo("bob")
    .or(field("firstName").equalTo(field("username"))
      .and(field("age").greaterThan(4))),
  // No projection builder yet but it would be something like this:
  projection: include("*").recursively()
})
.then(console.log);
```
