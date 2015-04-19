# lightblue.js

A [lightblue](https://github.com/lightblue-platform) client written in Javascript.

Write...
- Node.JS apps talking to a Lightblue REST service
- Client side apps communicating with a server that forwards requests to a Lightblue REST service

# Install

`bower install lightblue.js --save`

`npm install lightblue.js --save`

`git clone https://github.com/alechenninger/lightblue.js.git`

# Usage

Use browserify `require` or requirejs `define`, or just include dist/lightblue.min.js and use the namespace `lightblue`.

For frontend angular applications, use the `lightblue` module (TODO: document).

## Imports: 

```javascript
// No module framework (use window.lightblue)
<script src="lightblue.min.js"></script>

// NodeJS or Browserify or CommonJS
var lightblue = require("./lightblue.min.js");

// RequireJS works too but I don't have an example
```

## Construct a find request:

```javascript
// Assumes /data and /metadata for data and metadata services respectively, 
// but you can override.
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
