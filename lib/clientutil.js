exports.resolve = function() {
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

  function notEmpty(arg) {
    return typeof arg !== "undefined" && arg !== "";
  }

  return Array.prototype.slice.call(arguments, 0)
      .filter(notEmpty)
      .map(trimSlashes)
      .join("/");
};

exports.isEmpty = function(s) {
  return typeof s === "undefined" || s === "";
};

function ifDefined(it, otherwise) {
  return isDefined(it) ? it : otherwise;
}

function isDefined(it) {
  return typeof it !== "undefined";
}

function isObject(it) {
  return typeof it === "object";
}

var assertArg = {
  isInstance: function(arg, ctor, name) {
    if (!(arg instanceof ctor)) {
      throw new Error("Expected instanceof " + ctor + " but " + name + " was "
          + isObject(arg) ? arg.constructor : "undefined");
    }
    
    return arg;
  },
  isNotBlankString: function(arg, name) {
    if (typeof arg !== "string") {
      throw new Error("Expected a string but " + name + " was " + typeof arg);
    }
    
    if (arg.trim().length === 0) {
      throw new Error("Expected non-blank string but " + name + " was empty.");
    }
    
    return arg;
  },
  isTypeOf: function(arg, type, name) {
    if (typeof arg !== type) {
      throw new Error("Expected a typeof " + type + " but " + name + " was " +
          typeof arg);
    }
    
    return arg;
  }
};

exports.assertArg = assertArg;
exports.ifDefined = ifDefined;
exports.isDefined = isDefined;
exports.isObject = isObject;