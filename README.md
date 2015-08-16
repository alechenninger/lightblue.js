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
myModule.factory("otherLightblueInstance", ["$http", function() {
  // `lightblue` is globally defined on `window` if needed.
  // Don't use it directly: wrap it in a service.
  // Pass $http in via config object unless you want the client to use XHR
  // directly.
  var client = lightblue.getClient("my.other.lightblue.com" {$http: $http});
  return {
    data: client.data,
    metadata: client.metadata
  };
}]);
```

### Auth

#### Basic using `lightblue` object (client or server)
```js
lightblue.getClient("foo.com", {auth: {username: "foo", password: "bar"}});
```

#### Basic w/ Angular service (client)
Since lightblue.js uses `$http`, you can add interceptors / common headers to all `$http` requests if that works for you. You can also configure the lightblue clients directly:

```js
// Inject lightblue.http...
module.controller("login", ["lightblue.http", function(lightblueHttp) {
  $scope.login = function() {
    lightblueHttp.setAuth({
      username: $scope.username,
      password: $scope.password
    });
  };
}]);
```

And of course if needed you can still use the global `lightblue` object as above
to get a new client with basic auth credentials, just remember to pass `$http` 
as per [above example](#multiple-lightblue-service-instances-with-angular).

#### SSL certs (client)
This is handled by the user's browser, each in their own way. You will generally
have to import your cert into the browser and select it once you visit the web
application. The Javascript has no idea certs are involved. See each browser's
documentation for more details.

#### SSL certs (server)
In the `options` object for the clients, you may define an "httpsAgent" key
which has the same semantics as making an https request with node and defining
an agent to use. If you pass `undefined`, it uses the global agent. Or, you may
pass your own (via `new https.Agent(options)`). In either case, you will need to
configure your certificates on the agent. See [nodejs's https documentation][1]
for more information.

[1]: https://nodejs.org/api/https.html#https_https_request_options_callback

```js
// Configure the global agent
var fs = require("fs");
var https = require("https");

https.globalAgent.key = fs.readFileSync('my-key.pem');
https.globalAgent.cert = fs.readFileSync('my-cert.pem');

// Defaults to global agent
var clientUsingGlobalAgent = lightblue.getClient("https://my.lightblue.com");

// Use a lightblue-specific agent
var clientUsingOwnAgent = lightblue.getClient("https://my.lightblue.com", {
  httpsAgent: new https.Agent({
    key: fs.readFileSync('my-key.pem'),
    cert: fs.readFileSync('my-cert.pem')
  })
});
```
