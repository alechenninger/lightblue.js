# lightblue.js

A [lightblue](https://github.com/lightblue-platform) client written in
Javascript for frontend or Node.JS applications.

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

Once you have a `lightblue` object, you can get a client:

```js
// Assumes /data and /metadata for data and metadata services respectively, 
// but you can override.
var client = lightblue.getClient("http://my.lightblue.host.com/rest"); 
```

### AngularJS
If angular is detected, a "lightblue" module will be registered with a
"lightblue" service as the client.

```js
var app = angular.module("app", ["lightblue"]);

app.config(["lightblueProvider", function(lightblueProvider) {
  lightblueProvider.setHost("http://my.lightblue.com");
}]);

app.controller("ctrl", ["lightblue", function(lightblueClient) {
  lightblueClient.data.find(...)
      .then(...);
}]);
```

**At the moment you will also need to use the global "lightblue" namespace if 
you want query builder API. So don't name your client variable `lightblue` 
just yet. See 
[issue #9](https://github.com/alechenninger/lightblue.js/issues/9).**

## Construct a find request

```javascript
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
