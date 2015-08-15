# lightblue.js
[![Build Status](https://travis-ci.org/alechenninger/lightblue.js.svg?branch=master)](https://travis-ci.org/alechenninger/lightblue.js)
[![Coverage Status](https://coveralls.io/repos/alechenninger/lightblue.js/badge.svg)](https://coveralls.io/r/alechenninger/lightblue.js)

A [lightblue](http://lightblue.io) client written in Javascript for frontend or
Node.JS applications.

The same library may be used for servers or clients, with [special support for
AngularJS applications](#angularjs).

## Install

`bower install lightblue.js --save`

`npm install lightblue.js --save`

`git clone https://github.com/alechenninger/lightblue.js.git`

## Import

### Browserify/NodeJS (CommonJS) or RequireJS (AMD)

```js
// commonjs or NodeJS
var lightblue = require("lightblue");

// asynchronous module definition (amd)
require(["lightblue"], function(lightblue) {
  ...
});
```

### Vanilla.js

```javascript
// No module framework (use window.lightblue)
<script src="lightblue.min.js" type="text/javascript"></script>
```

## Usage
Once you have a `lightblue` object, you can get a client:

```js
// Assumes /data and /metadata for data and metadata services respectively,
// but you can override.
var client = lightblue.getClient("http://my.lightblue.host.com/rest");
```

And you can use builder API's for more readable queries and autocomplete if your
IDE supports it:

```js
var field = lightblue.query.field;

// Use in queries...
field("firstName").equalTo("Bob").and(field("age").greaterThan(21));
field("lastName").equalTo(field("firstName"));
```

The query builder API is not yet fully flushed out, but adding functionality is
trivial. See [issue #11](https://github.com/alechenninger/lightblue.js/issues/11).

### Example find request

```javascript
// Query
var bobsOlderThan20 = field("firstName").equalTo("bob")
    .and(field("age").greaterThan(20));

// Projection
// No projection builder yet but it would be something like this:
var everything = include("*").recursively();

var find = client.data.find({
  entity: "User",
  version: "1.0.0",
  query: bobsOlderThan20,
  projection: everything
})
.then(console.log.bind(console));
```

### AngularJS
If angular is detected, a "lightblue" module will be registered with a
"lightblue" service as a namespace for lightblue facilities. In this
environment, Angular's `$http` service will be used instead of making XHR
requests directly. You can configure the host(s) to use using providers.

```js
var app = angular.module("app", ["lightblue"]);

app.config(["lightblueProvider", function(lightblueProvider) {
  lightblueProvider.setHost("http://my.lightblue.com");
}]);

app.controller("ctrl", ["lightblue", function(lightblue) {
  var field = lightblue.query.field;

  lightblue.data.find(field("foo").equalTo("bar"))
      .then(function(response) {
        var entity = response.processed[0];
      });
}]);
```

#### Multiple lightblue service instances with Angular

Angular services are singletons, and therefore you only get to configure one
lightblue backend to talk to. If for some reason your application needs to talk
to more than one lightblue host, you can create separate lightblue services
using the global `lightblue` namespace, and wrap them in specific Angular
services for your needs. **Don't use the global namespace directly: wrap it in a
service.**

```js
myModule.factory("otherLightblueInstance", function() {
  // `lightblue` is globally defined on `window` if needed.
  // Don't use it directly: wrap it in a service.
  var client = lightblue.getClient("my.other.lightblue.com");
  return {
    data: client.data,
    metadata: client.data
  };
});
```
