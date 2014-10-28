# lightblue.js

A [lightblue](https://github.com/lightblue-platform) client written in Javascript.

Conceivably one day useful for:
- Node.JS apps with a Lightblue REST service
- Client side apps communicating with a server that forwards requests to a Lightblue REST service

At the moment this is really just a rough sketch of an idea and will change drastically.

# Usage

It does still sort of work! It won't actually make any requests, but gives you an API for building the key components of the request: the HTTP method, the URL, and the request body. The idea is this information could then be used easily with either XMLHttpRequest, jQuery.ajax, Angular's $http service, or a Node.JS HTTP client. All it takes is a little glue code to tie the necessary components with one of the aforementioned common AJAX mechanisms.

```javascript
var client = new LightblueClient("http://my.lightblue.host.com/rest");

var find = client.find({
  entity: "User",
  version: "1.0.0",

  // Query builder
  query: field("username").equalTo("bob")
    .or(field("firstName").equalTo(field("username"))
      .and(field("age").greaterThan(4))),

  // No projection builder yet but it would be something like this:
  projection: include("*").recursively()
});

console.log(find.url);    // "http://my.lightblue.host.com/rest/data/find/User/1.0.0"
console.log(find.method); // "post"

JSON.stringify(find.data, null, "  ");

// "{
//   "$or": [
//     {
//       "field": "username",
//       "op": "$eq",
//       "rvalue": "bob"
//     },
//     {
//       "$and": [
//         {
//           "field": "firstName",
//           "op": "$eq",
//           "rfield": "username"
//         },
//         {
//           "field": "age",
//           "op": "$gt",
//           "rvalue": 4
//         }
//       ]
//     }
//   ]
// }"
```
