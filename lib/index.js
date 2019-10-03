(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SCHEMA = factory());
}(this, function () { 'use strict';

  /* globals window, HTMLElement */

  /**!
   * is
   * the definitive JavaScript type testing library
   *
   * @copyright 2013-2014 Enrico Marino / Jordan Harband
   * @license MIT
   */

  var objProto = Object.prototype;
  var owns = objProto.hasOwnProperty;
  var toStr = objProto.toString;
  var symbolValueOf;
  if (typeof Symbol === 'function') {
    symbolValueOf = Symbol.prototype.valueOf;
  }
  var bigIntValueOf;
  if (typeof BigInt === 'function') {
    bigIntValueOf = BigInt.prototype.valueOf;
  }
  var isActualNaN = function (value) {
    return value !== value;
  };
  var NON_HOST_TYPES = {
    'boolean': 1,
    number: 1,
    string: 1,
    undefined: 1
  };

  var base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/;
  var hexRegex = /^[A-Fa-f0-9]+$/;

  /**
   * Expose `is`
   */

  var is = {};

  /**
   * Test general.
   */

  /**
   * is.type
   * Test if `value` is a type of `type`.
   *
   * @param {*} value value to test
   * @param {String} type type
   * @return {Boolean} true if `value` is a type of `type`, false otherwise
   * @api public
   */

  is.a = is.type = function (value, type) {
    return typeof value === type;
  };

  /**
   * is.defined
   * Test if `value` is defined.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is defined, false otherwise
   * @api public
   */

  is.defined = function (value) {
    return typeof value !== 'undefined';
  };

  /**
   * is.empty
   * Test if `value` is empty.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is empty, false otherwise
   * @api public
   */

  is.empty = function (value) {
    var type = toStr.call(value);
    var key;

    if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
      return value.length === 0;
    }

    if (type === '[object Object]') {
      for (key in value) {
        if (owns.call(value, key)) {
          return false;
        }
      }
      return true;
    }

    return !value;
  };

  /**
   * is.equal
   * Test if `value` is equal to `other`.
   *
   * @param {*} value value to test
   * @param {*} other value to compare with
   * @return {Boolean} true if `value` is equal to `other`, false otherwise
   */

  is.equal = function equal(value, other) {
    if (value === other) {
      return true;
    }

    var type = toStr.call(value);
    var key;

    if (type !== toStr.call(other)) {
      return false;
    }

    if (type === '[object Object]') {
      for (key in value) {
        if (!is.equal(value[key], other[key]) || !(key in other)) {
          return false;
        }
      }
      for (key in other) {
        if (!is.equal(value[key], other[key]) || !(key in value)) {
          return false;
        }
      }
      return true;
    }

    if (type === '[object Array]') {
      key = value.length;
      if (key !== other.length) {
        return false;
      }
      while (key--) {
        if (!is.equal(value[key], other[key])) {
          return false;
        }
      }
      return true;
    }

    if (type === '[object Function]') {
      return value.prototype === other.prototype;
    }

    if (type === '[object Date]') {
      return value.getTime() === other.getTime();
    }

    return false;
  };

  /**
   * is.hosted
   * Test if `value` is hosted by `host`.
   *
   * @param {*} value to test
   * @param {*} host host to test with
   * @return {Boolean} true if `value` is hosted by `host`, false otherwise
   * @api public
   */

  is.hosted = function (value, host) {
    var type = typeof host[value];
    return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
  };

  /**
   * is.instance
   * Test if `value` is an instance of `constructor`.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an instance of `constructor`
   * @api public
   */

  is.instance = is['instanceof'] = function (value, constructor) {
    return value instanceof constructor;
  };

  /**
   * is.nil / is.null
   * Test if `value` is null.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is null, false otherwise
   * @api public
   */

  is.nil = is['null'] = function (value) {
    return value === null;
  };

  /**
   * is.undef / is.undefined
   * Test if `value` is undefined.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is undefined, false otherwise
   * @api public
   */

  is.undef = is.undefined = function (value) {
    return typeof value === 'undefined';
  };

  /**
   * Test arguments.
   */

  /**
   * is.args
   * Test if `value` is an arguments object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an arguments object, false otherwise
   * @api public
   */

  is.args = is.arguments = function (value) {
    var isStandardArguments = toStr.call(value) === '[object Arguments]';
    var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
    return isStandardArguments || isOldArguments;
  };

  /**
   * Test array.
   */

  /**
   * is.array
   * Test if 'value' is an array.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an array, false otherwise
   * @api public
   */

  is.array = Array.isArray || function (value) {
    return toStr.call(value) === '[object Array]';
  };

  /**
   * is.arguments.empty
   * Test if `value` is an empty arguments object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an empty arguments object, false otherwise
   * @api public
   */
  is.args.empty = function (value) {
    return is.args(value) && value.length === 0;
  };

  /**
   * is.array.empty
   * Test if `value` is an empty array.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an empty array, false otherwise
   * @api public
   */
  is.array.empty = function (value) {
    return is.array(value) && value.length === 0;
  };

  /**
   * is.arraylike
   * Test if `value` is an arraylike object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an arguments object, false otherwise
   * @api public
   */

  is.arraylike = function (value) {
    return !!value && !is.bool(value)
      && owns.call(value, 'length')
      && isFinite(value.length)
      && is.number(value.length)
      && value.length >= 0;
  };

  /**
   * Test boolean.
   */

  /**
   * is.bool
   * Test if `value` is a boolean.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a boolean, false otherwise
   * @api public
   */

  is.bool = is['boolean'] = function (value) {
    return toStr.call(value) === '[object Boolean]';
  };

  /**
   * is.false
   * Test if `value` is false.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is false, false otherwise
   * @api public
   */

  is['false'] = function (value) {
    return is.bool(value) && Boolean(Number(value)) === false;
  };

  /**
   * is.true
   * Test if `value` is true.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is true, false otherwise
   * @api public
   */

  is['true'] = function (value) {
    return is.bool(value) && Boolean(Number(value)) === true;
  };

  /**
   * Test date.
   */

  /**
   * is.date
   * Test if `value` is a date.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a date, false otherwise
   * @api public
   */

  is.date = function (value) {
    return toStr.call(value) === '[object Date]';
  };

  /**
   * is.date.valid
   * Test if `value` is a valid date.
   *
   * @param {*} value value to test
   * @returns {Boolean} true if `value` is a valid date, false otherwise
   */
  is.date.valid = function (value) {
    return is.date(value) && !isNaN(Number(value));
  };

  /**
   * Test element.
   */

  /**
   * is.element
   * Test if `value` is an html element.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an HTML Element, false otherwise
   * @api public
   */

  is.element = function (value) {
    return value !== undefined
      && typeof HTMLElement !== 'undefined'
      && value instanceof HTMLElement
      && value.nodeType === 1;
  };

  /**
   * Test error.
   */

  /**
   * is.error
   * Test if `value` is an error object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an error object, false otherwise
   * @api public
   */

  is.error = function (value) {
    return toStr.call(value) === '[object Error]';
  };

  /**
   * Test function.
   */

  /**
   * is.fn / is.function (deprecated)
   * Test if `value` is a function.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a function, false otherwise
   * @api public
   */

  is.fn = is['function'] = function (value) {
    var isAlert = typeof window !== 'undefined' && value === window.alert;
    if (isAlert) {
      return true;
    }
    var str = toStr.call(value);
    return str === '[object Function]' || str === '[object GeneratorFunction]' || str === '[object AsyncFunction]';
  };

  /**
   * Test number.
   */

  /**
   * is.number
   * Test if `value` is a number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a number, false otherwise
   * @api public
   */

  is.number = function (value) {
    return toStr.call(value) === '[object Number]';
  };

  /**
   * is.infinite
   * Test if `value` is positive or negative infinity.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
   * @api public
   */
  is.infinite = function (value) {
    return value === Infinity || value === -Infinity;
  };

  /**
   * is.decimal
   * Test if `value` is a decimal number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a decimal number, false otherwise
   * @api public
   */

  is.decimal = function (value) {
    return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
  };

  /**
   * is.divisibleBy
   * Test if `value` is divisible by `n`.
   *
   * @param {Number} value value to test
   * @param {Number} n dividend
   * @return {Boolean} true if `value` is divisible by `n`, false otherwise
   * @api public
   */

  is.divisibleBy = function (value, n) {
    var isDividendInfinite = is.infinite(value);
    var isDivisorInfinite = is.infinite(n);
    var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
    return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
  };

  /**
   * is.integer
   * Test if `value` is an integer.
   *
   * @param value to test
   * @return {Boolean} true if `value` is an integer, false otherwise
   * @api public
   */

  is.integer = is['int'] = function (value) {
    return is.number(value) && !isActualNaN(value) && value % 1 === 0;
  };

  /**
   * is.maximum
   * Test if `value` is greater than 'others' values.
   *
   * @param {Number} value value to test
   * @param {Array} others values to compare with
   * @return {Boolean} true if `value` is greater than `others` values
   * @api public
   */

  is.maximum = function (value, others) {
    if (isActualNaN(value)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.arraylike(others)) {
      throw new TypeError('second argument must be array-like');
    }
    var len = others.length;

    while (--len >= 0) {
      if (value < others[len]) {
        return false;
      }
    }

    return true;
  };

  /**
   * is.minimum
   * Test if `value` is less than `others` values.
   *
   * @param {Number} value value to test
   * @param {Array} others values to compare with
   * @return {Boolean} true if `value` is less than `others` values
   * @api public
   */

  is.minimum = function (value, others) {
    if (isActualNaN(value)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.arraylike(others)) {
      throw new TypeError('second argument must be array-like');
    }
    var len = others.length;

    while (--len >= 0) {
      if (value > others[len]) {
        return false;
      }
    }

    return true;
  };

  /**
   * is.nan
   * Test if `value` is not a number.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is not a number, false otherwise
   * @api public
   */

  is.nan = function (value) {
    return !is.number(value) || value !== value;
  };

  /**
   * is.even
   * Test if `value` is an even number.
   *
   * @param {Number} value value to test
   * @return {Boolean} true if `value` is an even number, false otherwise
   * @api public
   */

  is.even = function (value) {
    return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
  };

  /**
   * is.odd
   * Test if `value` is an odd number.
   *
   * @param {Number} value value to test
   * @return {Boolean} true if `value` is an odd number, false otherwise
   * @api public
   */

  is.odd = function (value) {
    return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
  };

  /**
   * is.ge
   * Test if `value` is greater than or equal to `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean}
   * @api public
   */

  is.ge = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value >= other;
  };

  /**
   * is.gt
   * Test if `value` is greater than `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean}
   * @api public
   */

  is.gt = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value > other;
  };

  /**
   * is.le
   * Test if `value` is less than or equal to `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean} if 'value' is less than or equal to 'other'
   * @api public
   */

  is.le = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value <= other;
  };

  /**
   * is.lt
   * Test if `value` is less than `other`.
   *
   * @param {Number} value value to test
   * @param {Number} other value to compare with
   * @return {Boolean} if `value` is less than `other`
   * @api public
   */

  is.lt = function (value, other) {
    if (isActualNaN(value) || isActualNaN(other)) {
      throw new TypeError('NaN is not a valid value');
    }
    return !is.infinite(value) && !is.infinite(other) && value < other;
  };

  /**
   * is.within
   * Test if `value` is within `start` and `finish`.
   *
   * @param {Number} value value to test
   * @param {Number} start lower bound
   * @param {Number} finish upper bound
   * @return {Boolean} true if 'value' is is within 'start' and 'finish'
   * @api public
   */
  is.within = function (value, start, finish) {
    if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
      throw new TypeError('NaN is not a valid value');
    } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
      throw new TypeError('all arguments must be numbers');
    }
    var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
    return isAnyInfinite || (value >= start && value <= finish);
  };

  /**
   * Test object.
   */

  /**
   * is.object
   * Test if `value` is an object.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is an object, false otherwise
   * @api public
   */
  is.object = function (value) {
    return toStr.call(value) === '[object Object]';
  };

  /**
   * is.primitive
   * Test if `value` is a primitive.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a primitive, false otherwise
   * @api public
   */
  is.primitive = function isPrimitive(value) {
    if (!value) {
      return true;
    }
    if (typeof value === 'object' || is.object(value) || is.fn(value) || is.array(value)) {
      return false;
    }
    return true;
  };

  /**
   * is.hash
   * Test if `value` is a hash - a plain object literal.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a hash, false otherwise
   * @api public
   */

  is.hash = function (value) {
    return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
  };

  /**
   * Test regexp.
   */

  /**
   * is.regexp
   * Test if `value` is a regular expression.
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a regexp, false otherwise
   * @api public
   */

  is.regexp = function (value) {
    return toStr.call(value) === '[object RegExp]';
  };

  /**
   * Test string.
   */

  /**
   * is.string
   * Test if `value` is a string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a string, false otherwise
   * @api public
   */

  is.string = function (value) {
    return toStr.call(value) === '[object String]';
  };

  /**
   * Test base64 string.
   */

  /**
   * is.base64
   * Test if `value` is a valid base64 encoded string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
   * @api public
   */

  is.base64 = function (value) {
    return is.string(value) && (!value.length || base64Regex.test(value));
  };

  /**
   * Test base64 string.
   */

  /**
   * is.hex
   * Test if `value` is a valid hex encoded string.
   *
   * @param {*} value value to test
   * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
   * @api public
   */

  is.hex = function (value) {
    return is.string(value) && (!value.length || hexRegex.test(value));
  };

  /**
   * is.symbol
   * Test if `value` is an ES6 Symbol
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a Symbol, false otherise
   * @api public
   */

  is.symbol = function (value) {
    return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol';
  };

  /**
   * is.bigint
   * Test if `value` is an ES-proposed BigInt
   *
   * @param {*} value value to test
   * @return {Boolean} true if `value` is a BigInt, false otherise
   * @api public
   */

  is.bigint = function (value) {
    // eslint-disable-next-line valid-typeof
    return typeof BigInt === 'function' && toStr.call(value) === '[object BigInt]' && typeof bigIntValueOf.call(value) === 'bigint';
  };

  var is_1 = is;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var bottle = createCommonjsModule(function (module, exports) {
  (function(undefined$1) {
      /**
       * BottleJS v1.7.2 - 2019-02-07
       * A powerful dependency injection micro container
       *
       * Copyright (c) 2019 Stephen Young
       * Licensed MIT
       */
      var Bottle;
      
      /**
       * String constants
       */
      var DELIMITER = '.';
      var FUNCTION_TYPE = 'function';
      var STRING_TYPE = 'string';
      var GLOBAL_NAME = '__global__';
      var PROVIDER_SUFFIX = 'Provider';
      
      /**
       * Unique id counter;
       *
       * @type Number
       */
      var id = 0;
      
      /**
       * Local slice alias
       *
       * @type Functions
       */
      var slice = Array.prototype.slice;
      
      /**
       * Iterator used to walk down a nested object.
       *
       * If Bottle.config.strict is true, this method will throw an exception if it encounters an
       * undefined path
       *
       * @param Object obj
       * @param String prop
       * @return mixed
       * @throws Error if Bottle is unable to resolve the requested service.
       */
      var getNested = function getNested(obj, prop) {
          var service = obj[prop];
          if (service === undefined$1 && Bottle.config.strict) {
              throw new Error('Bottle was unable to resolve a service.  `' + prop + '` is undefined.');
          }
          return service;
      };
      
      /**
       * Get a nested bottle. Will set and return if not set.
       *
       * @param String name
       * @return Bottle
       */
      var getNestedBottle = function getNestedBottle(name) {
          var bottle;
          if (!this.nested[name]) {
              bottle = Bottle.pop();
              this.nested[name] = bottle;
              this.factory(name, function SubProviderFactory() {
                  return bottle.container;
              });
          }
          return this.nested[name];
      };
      
      /**
       * Get a service stored under a nested key
       *
       * @param String fullname
       * @return Service
       */
      var getNestedService = function getNestedService(fullname) {
          return fullname.split(DELIMITER).reduce(getNested, this);
      };
      
      /**
       * Function used by provider to set up middleware for each request.
       *
       * @param Number id
       * @param String name
       * @param Object instance
       * @param Object container
       * @return void
       */
      var applyMiddleware = function applyMiddleware(middleware, name, instance, container) {
          var descriptor = {
              configurable : true,
              enumerable : true
          };
          if (middleware.length) {
              descriptor.get = function getWithMiddlewear() {
                  var index = 0;
                  var next = function nextMiddleware(err) {
                      if (err) {
                          throw err;
                      }
                      if (middleware[index]) {
                          middleware[index++](instance, next);
                      }
                  };
                  next();
                  return instance;
              };
          } else {
              descriptor.value = instance;
              descriptor.writable = true;
          }
      
          Object.defineProperty(container, name, descriptor);
      
          return container[name];
      };
      
      /**
       * Register middleware.
       *
       * @param String name
       * @param Function func
       * @return Bottle
       */
      var middleware = function middleware(fullname, func) {
          var parts, name;
          if (typeof fullname === FUNCTION_TYPE) {
              func = fullname;
              fullname = GLOBAL_NAME;
          }
      
          parts = fullname.split(DELIMITER);
          name = parts.shift();
          if (parts.length) {
              getNestedBottle.call(this, name).middleware(parts.join(DELIMITER), func);
          } else {
              if (!this.middlewares[name]) {
                  this.middlewares[name] = [];
              }
              this.middlewares[name].push(func);
          }
          return this;
      };
      
      /**
       * Used to process decorators in the provider
       *
       * @param Object instance
       * @param Function func
       * @return Mixed
       */
      var reducer = function reducer(instance, func) {
          return func(instance);
      };
      
      
      /**
       * Get decorators and middleware including globals
       *
       * @return array
       */
      var getWithGlobal = function getWithGlobal(collection, name) {
          return (collection[name] || []).concat(collection.__global__ || []);
      };
      
      
      /**
       * Create the provider properties on the container
       *
       * @param String name
       * @param Function Provider
       * @return Bottle
       */
      var createProvider = function createProvider(name, Provider) {
          var providerName, properties, container, id, decorators, middlewares;
      
          id = this.id;
          container = this.container;
          decorators = this.decorators;
          middlewares = this.middlewares;
          providerName = name + PROVIDER_SUFFIX;
      
          properties = Object.create(null);
          properties[providerName] = {
              configurable : true,
              enumerable : true,
              get : function getProvider() {
                  var instance = new Provider();
                  delete container[providerName];
                  container[providerName] = instance;
                  return instance;
              }
          };
      
          properties[name] = {
              configurable : true,
              enumerable : true,
              get : function getService() {
                  var provider = container[providerName];
                  var instance;
                  if (provider) {
                      // filter through decorators
                      instance = getWithGlobal(decorators, name).reduce(reducer, provider.$get(container));
      
                      delete container[providerName];
                      delete container[name];
                  }
                  return instance === undefined$1 ? instance : applyMiddleware(getWithGlobal(middlewares, name),
                      name, instance, container);
              }
          };
      
          Object.defineProperties(container, properties);
          return this;
      };
      
      
      /**
       * Register a provider.
       *
       * @param String fullname
       * @param Function Provider
       * @return Bottle
       */
      var provider = function provider(fullname, Provider) {
          var parts, name;
          parts = fullname.split(DELIMITER);
          if (this.providerMap[fullname] && parts.length === 1 && !this.container[fullname + PROVIDER_SUFFIX]) {
              return console.error(fullname + ' provider already instantiated.');
          }
          this.originalProviders[fullname] = Provider;
          this.providerMap[fullname] = true;
      
          name = parts.shift();
      
          if (parts.length) {
              getNestedBottle.call(this, name).provider(parts.join(DELIMITER), Provider);
              return this;
          }
          return createProvider.call(this, name, Provider);
      };
      
      /**
       * Register a factory inside a generic provider.
       *
       * @param String name
       * @param Function Factory
       * @return Bottle
       */
      var factory = function factory(name, Factory) {
          return provider.call(this, name, function GenericProvider() {
              this.$get = Factory;
          });
      };
      
      /**
       * Private helper for creating service and service factories.
       *
       * @param String name
       * @param Function Service
       * @return Bottle
       */
      var createService = function createService(name, Service, isClass) {
          var deps = arguments.length > 3 ? slice.call(arguments, 3) : [];
          var bottle = this;
          return factory.call(this, name, function GenericFactory() {
              var serviceFactory = Service; // alias for jshint
              var args = deps.map(getNestedService, bottle.container);
      
              if (!isClass) {
                  return serviceFactory.apply(null, args);
              }
              return new (Service.bind.apply(Service, [null].concat(args)))();
          });
      };
      
      /**
       * Register a class service
       *
       * @param String name
       * @param Function Service
       * @return Bottle
       */
      var service = function service(name, Service) {
          return createService.apply(this, [name, Service, true].concat(slice.call(arguments, 2)));
      };
      
      /**
       * Register a function service
       */
      var serviceFactory = function serviceFactory(name, factoryService) {
          return createService.apply(this, [name, factoryService, false].concat(slice.call(arguments, 2)));
      };
      
      /**
       * Define a mutable property on the container.
       *
       * @param String name
       * @param mixed val
       * @return void
       * @scope container
       */
      var defineValue = function defineValue(name, val) {
          Object.defineProperty(this, name, {
              configurable : true,
              enumerable : true,
              value : val,
              writable : true
          });
      };
      
      /**
       * Iterator for setting a plain object literal via defineValue
       *
       * @param Object container
       * @param string name
       */
      var setValueObject = function setValueObject(container, name) {
          var nestedContainer = container[name];
          if (!nestedContainer) {
              nestedContainer = {};
              defineValue.call(container, name, nestedContainer);
          }
          return nestedContainer;
      };
      
      
      /**
       * Register a value
       *
       * @param String name
       * @param mixed val
       * @return Bottle
       */
      var value = function value(name, val) {
          var parts;
          parts = name.split(DELIMITER);
          name = parts.pop();
          defineValue.call(parts.reduce(setValueObject, this.container), name, val);
          return this;
      };
      
      /**
       * Define an enumerable, non-configurable, non-writable value.
       *
       * @param String name
       * @param mixed value
       * @return undefined
       */
      var defineConstant = function defineConstant(name, value) {
          Object.defineProperty(this, name, {
              configurable : false,
              enumerable : true,
              value : value,
              writable : false
          });
      };
      
      /**
       * Register a constant
       *
       * @param String name
       * @param mixed value
       * @return Bottle
       */
      var constant = function constant(name, value) {
          var parts = name.split(DELIMITER);
          name = parts.pop();
          defineConstant.call(parts.reduce(setValueObject, this.container), name, value);
          return this;
      };
      
      /**
       * Register decorator.
       *
       * @param String fullname
       * @param Function func
       * @return Bottle
       */
      var decorator = function decorator(fullname, func) {
          var parts, name;
          if (typeof fullname === FUNCTION_TYPE) {
              func = fullname;
              fullname = GLOBAL_NAME;
          }
      
          parts = fullname.split(DELIMITER);
          name = parts.shift();
          if (parts.length) {
              getNestedBottle.call(this, name).decorator(parts.join(DELIMITER), func);
          } else {
              if (!this.decorators[name]) {
                  this.decorators[name] = [];
              }
              this.decorators[name].push(func);
          }
          return this;
      };
      
      /**
       * Register a function that will be executed when Bottle#resolve is called.
       *
       * @param Function func
       * @return Bottle
       */
      var defer = function defer(func) {
          this.deferred.push(func);
          return this;
      };
      
      
      /**
       * Immediately instantiates the provided list of services and returns them.
       *
       * @param Array services
       * @return Array Array of instances (in the order they were provided)
       */
      var digest = function digest(services) {
          return (services || []).map(getNestedService, this.container);
      };
      
      /**
       * Register an instance factory inside a generic factory.
       *
       * @param {String} name - The name of the service
       * @param {Function} Factory - The factory function, matches the signature required for the
       * `factory` method
       * @return Bottle
       */
      var instanceFactory = function instanceFactory(name, Factory) {
          return factory.call(this, name, function GenericInstanceFactory(container) {
              return {
                  instance : Factory.bind(Factory, container)
              };
          });
      };
      
      /**
       * A filter function for removing bottle container methods and providers from a list of keys
       */
      var byMethod = function byMethod(name) {
          return !/^\$(?:decorator|register|list)$|Provider$/.test(name);
      };
      
      /**
       * List the services registered on the container.
       *
       * @param Object container
       * @return Array
       */
      var list = function list(container) {
          return Object.keys(container || this.container || {}).filter(byMethod);
      };
      
      /**
       * Named bottle instances
       *
       * @type Object
       */
      var bottles = {};
      
      /**
       * Get an instance of bottle.
       *
       * If a name is provided the instance will be stored in a local hash.  Calling Bottle.pop multiple
       * times with the same name will return the same instance.
       *
       * @param String name
       * @return Bottle
       */
      var pop = function pop(name) {
          var instance;
          if (typeof name === STRING_TYPE) {
              instance = bottles[name];
              if (!instance) {
                  bottles[name] = instance = new Bottle();
                  instance.constant('BOTTLE_NAME', name);
              }
              return instance;
          }
          return new Bottle();
      };
      
      /**
       * Clear all named bottles.
       */
      var clear = function clear(name) {
          if (typeof name === STRING_TYPE) {
              delete bottles[name];
          } else {
              bottles = {};
          }
      };
      
      /**
       * Register a service, factory, provider, or value based on properties on the object.
       *
       * properties:
       *  * Obj.$name   String required ex: `'Thing'`
       *  * Obj.$type   String optional 'service', 'factory', 'provider', 'value'.  Default: 'service'
       *  * Obj.$inject Mixed  optional only useful with $type 'service' name or array of names
       *  * Obj.$value  Mixed  optional Normally Obj is registered on the container.  However, if this
       *                       property is included, it's value will be registered on the container
       *                       instead of the object itsself.  Useful for registering objects on the
       *                       bottle container without modifying those objects with bottle specific keys.
       *
       * @param Function Obj
       * @return Bottle
       */
      var register = function register(Obj) {
          var value = Obj.$value === undefined$1 ? Obj : Obj.$value;
          return this[Obj.$type || 'service'].apply(this, [Obj.$name, value].concat(Obj.$inject || []));
      };
      
      /**
       * Deletes providers from the map and container.
       *
       * @param String name
       * @return void
       */
      var removeProviderMap = function resetProvider(name) {
          delete this.providerMap[name];
          delete this.container[name];
          delete this.container[name + PROVIDER_SUFFIX];
      };
      
      /**
       * Resets providers on a bottle instance. If 'names' array is provided, only the named providers will be reset.
       *
       * @param Array names
       * @return void
       */
      var resetProviders = function resetProviders(names) {
          var tempProviders = this.originalProviders;
          var shouldFilter = Array.isArray(names);
      
          Object.keys(this.originalProviders).forEach(function resetProvider(originalProviderName) {
              if (shouldFilter && names.indexOf(originalProviderName) === -1) {
                  return;
              }
              var parts = originalProviderName.split(DELIMITER);
              if (parts.length > 1) {
                  parts.forEach(removeProviderMap, getNestedBottle.call(this, parts[0]));
              }
              removeProviderMap.call(this, originalProviderName);
              this.provider(originalProviderName, tempProviders[originalProviderName]);
          }, this);
      };
      
      
      /**
       * Execute any deferred functions
       *
       * @param Mixed data
       * @return Bottle
       */
      var resolve = function resolve(data) {
          this.deferred.forEach(function deferredIterator(func) {
              func(data);
          });
      
          return this;
      };
      
      
      /**
       * Bottle constructor
       *
       * @param String name Optional name for functional construction
       */
      Bottle = function Bottle(name) {
          if (!(this instanceof Bottle)) {
              return Bottle.pop(name);
          }
      
          this.id = id++;
      
          this.decorators = {};
          this.middlewares = {};
          this.nested = {};
          this.providerMap = {};
          this.originalProviders = {};
          this.deferred = [];
          this.container = {
              $decorator : decorator.bind(this),
              $register : register.bind(this),
              $list : list.bind(this)
          };
      };
      
      /**
       * Bottle prototype
       */
      Bottle.prototype = {
          constant : constant,
          decorator : decorator,
          defer : defer,
          digest : digest,
          factory : factory,
          instanceFactory: instanceFactory,
          list : list,
          middleware : middleware,
          provider : provider,
          resetProviders : resetProviders,
          register : register,
          resolve : resolve,
          service : service,
          serviceFactory : serviceFactory,
          value : value
      };
      
      /**
       * Bottle static
       */
      Bottle.pop = pop;
      Bottle.clear = clear;
      Bottle.list = list;
      
      /**
       * Global config
       */
      Bottle.config = {
          strict : false
      };
      
      /**
       * Exports script adapted from lodash v2.4.1 Modern Build
       *
       * @see http://lodash.com/
       */
      
      /**
       * Valid object type map
       *
       * @type Object
       */
      var objectTypes = {
          'function' : true,
          'object' : true
      };
      
      (function exportBottle(root) {
      
          /**
           * Free variable exports
           *
           * @type Function
           */
          var freeExports =  exports && !exports.nodeType && exports;
      
          /**
           * Free variable module
           *
           * @type Object
           */
          var freeModule =  module && !module.nodeType && module;
      
          /**
           * CommonJS module.exports
           *
           * @type Function
           */
          var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
      
          /**
           * Free variable `global`
           *
           * @type Object
           */
          var freeGlobal = objectTypes[typeof commonjsGlobal] && commonjsGlobal;
          if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
              root = freeGlobal;
          }
      
          /**
           * Export
           */
          if (typeof undefined$1 === FUNCTION_TYPE && typeof undefined$1.amd === 'object' && undefined$1.amd) {
              root.Bottle = Bottle;
              undefined$1(function() { return Bottle; });
          } else if (freeExports && freeModule) {
              if (moduleExports) {
                  (freeModule.exports = Bottle).Bottle = Bottle;
              } else {
                  freeExports.Bottle = Bottle;
              }
          } else {
              root.Bottle = Bottle;
          }
      }((objectTypes[typeof window] && window) || this));
      
  }.call(commonjsGlobal));
  });

  var build = createCommonjsModule(function (module, exports) {
  (function(a,b){module.exports=b();})('undefined'==typeof self?commonjsGlobal:self,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d});},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='',b(b.s=0)}([function(a,b,c){a.exports=c(1);},function(a,b,c){Object.defineProperty(b,'__esModule',{value:!0});var d=c(2),e=c.n(d),f=c(3),g=c.n(f),h=function(){function a(a,b){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a;}finally{try{!d&&h['return']&&h['return']();}finally{if(e)throw f}}return c}return function(b,c){if(Array.isArray(b))return b;if(Symbol.iterator in Object(b))return a(b,c);throw new TypeError('Invalid attempt to destructure non-iterable instance')}}(),i=(a)=>{a.factory('collector',({ifFn:a,strToFn:b,Is:c})=>(d,e=!1)=>{let f=d;if('function'==typeof d&&(f=[d]),!Array.isArray(f))throw new Error('collector must receive array');if(!f.length)return ()=>!1;f=f.map((d)=>Array.isArray(d)?a(...d):c.string(d)?b(d):d);const g=(a)=>f.map((b)=>{try{return b(a)}catch(a){throw console.log('error in test ',b,a),a}});if(!e)return g;if(Array.isArray(e))return (a)=>{const b=g(a);var d=h(e,2);const f=d[0],i=d[1];return b.reduce(f,c.function(i)?i():i)};if('function'==typeof e)return (a)=>{const b=g(a);return b.reduce(e)};const i=(a)=>g(a).filter((b)=>!1!==b);return 'and'===e?(a)=>f.reduce((b,c)=>{if(!b)return b;const d=c(a);return !1!==d&&[...b,d]},[]):'or'===e?(a)=>f.reduce((b,d)=>b?b:(c.function(d)||console.log('collector test is not a function: ',d),d(a)),!1):(a)=>{const b=i(a);return !!(0<b.length)&&b}});},j=(a)=>{a.factory('customFunctions',()=>new Map),a.factory('defineCustomFunction',({customFunctions:a,Is:b})=>(c,d)=>{if(!(c&&b.string(c)))throw new Error(`bad define name: ${c}`);if(!(d&&b.function(d)))throw new Error(`bad define function for ${c}`);a.set(c,d);}),a.factory('clearCustomFunctions',({customFunctions:a})=>()=>a.clear()),a.factory('strToFn',({customFunctions:a,Is:b})=>(c)=>{if(!(c&&b.string(c)))throw new Error(`bad strToFn name: ${c}`);if(a.has(c))return a.get(c);if(b[c])return b[c];throw new Error(`bad function string: ${c}`)});},k=(a)=>{a.factory('parseTests',({Is:a})=>(b,c)=>{let d;if(Array.isArray(b))d=c?b.map((b)=>a.function(b)||a.string(b)?[b,!1,c]:b):b;else if(a.object(b)){if(!c)throw new Error('cannot take an object as a validator without an onFail');d=Object.keys(b).map((a)=>[b[a],!1,c]);}else('function'==typeof b||a.string(b))&&(d=c?[[b,!1,c]]:[b]);return d});},l=(a)=>{a.factory('argsToArray',()=>(...a)=>Array.isArray(a[0])?a[0]:a),a.factory('andFn',({collector:a,argsToArray:b})=>(...c)=>a(b(c),'and')),a.factory('orFn',({collector:a,argsToArray:b})=>(...c)=>a(b(c),'or'));};const m=/^fn:/;var n=(a)=>{a.factory('ifFn',({strToFn:a,Is:b})=>(c,d=!1,e=!1)=>{let f=c;if(b.string(c)&&(!e&&!d&&(e=`not an ${f}`),f=a(c)),!d&&!e)return f;let g=b.function(d)?d:b.string(d)&&m.test(d)?a(d.replace(m,'')):()=>d;let h;if(h=b.function(e)?e:b.string(e)&&m.test(e)?a(e.replace(m,'')):()=>e,!b.function(f))throw console.log('bad rule ',f,c,d,e),new Error('bad rule');return (a)=>{const b=f(a);return b?g(a,b):h(a,b)}});};const o=Symbol('required is not set'),p=Symbol('variable is absent');var q=(a)=>{a.factory('validator',({ifFn:a,collector:b,Is:c,parseTests:d})=>(e,f={})=>{var g=f.required;const h=g===void 0?o:g;var i=f.onFail;const j=d(e,i!==void 0&&i);if(!Array.isArray(j))throw console.log('tests not turned into an array:',e,j),new Error('cannot array-ify ',e);const k=j.map((b)=>Array.isArray(b)?a(...b):a(b));let l;if(!h)l=(c)=>b([a((b)=>b,p),b(k,'or')],'and')(c)[1]||!1;else if(h===o)l=b(k,'or');else{const a=c.string(h)?h:'required';k.unshift([(b)=>b,!1,a]),l=b(k,'or');}return (a)=>{let b=l(a);return b&&!Array.isArray(b)&&(b=[b]),b}});},r=()=>{const a=new e.a;return a.constant('Is',g.a),i(a),j(a),l(a),k(a),n(a),q(a),a};c.d(b,'ifFn',function(){return t}),c.d(b,'collector',function(){return u}),c.d(b,'validator',function(){return v}),c.d(b,'andFn',function(){return w}),c.d(b,'orFn',function(){return x}),c.d(b,'defineCustomFunction',function(){return y}),c.d(b,'factory',function(){return z});var s=r().container;const t=s.ifFn,u=s.collector,v=s.validator,w=s.andFn,x=s.orFn,y=s.defineCustomFunction,z=()=>r().container;b['default']=v;},function(a){a.exports=bottle;},function(a){a.exports=is_1;}])});

  });

  unwrapExports(build);
  var build_1 = build.inspector;

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      symbolTag = '[object Symbol]';

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      reLeadingDot = /^\./,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Built-in value references. */
  var Symbol$1 = root.Symbol,
      splice = arrayProto.splice;

  /* Built-in method references that are verified to be native. */
  var Map$1 = getNative(root, 'Map'),
      nativeCreate = getNative(Object, 'create');

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
    return this;
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
  }

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map$1 || ListCache),
      'string': new Hash
    };
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoize(function(string) {
    string = toString(string);

    var result = [];
    if (reLeadingDot.test(string)) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }

  // Assign cache to `_.memoize`.
  memoize.Cache = MapCache;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var lodash_get = get;

  var build$1 = createCommonjsModule(function (module) {
  module.exports =
  /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId]) {
  /******/ 			return installedModules[moduleId].exports;
  /******/ 		}
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			i: moduleId,
  /******/ 			l: false,
  /******/ 			exports: {}
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.l = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// define getter function for harmony exports
  /******/ 	__webpack_require__.d = function(exports, name, getter) {
  /******/ 		if(!__webpack_require__.o(exports, name)) {
  /******/ 			Object.defineProperty(exports, name, {
  /******/ 				configurable: false,
  /******/ 				enumerable: true,
  /******/ 				get: getter
  /******/ 			});
  /******/ 		}
  /******/ 	};
  /******/
  /******/ 	// getDefaultExport function for compatibility with non-harmony modules
  /******/ 	__webpack_require__.n = function(module) {
  /******/ 		var getter = module && module.__esModule ?
  /******/ 			function getDefault() { return module['default']; } :
  /******/ 			function getModuleExports() { return module; };
  /******/ 		__webpack_require__.d(getter, 'a', getter);
  /******/ 		return getter;
  /******/ 	};
  /******/
  /******/ 	// Object.prototype.hasOwnProperty.call
  /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(__webpack_require__.s = 0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

  module.exports = __webpack_require__(1);


  /***/ }),
  /* 1 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {
  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  // EXTERNAL MODULE: external "is"
  var external__is_ = __webpack_require__(2);
  var external__is__default = /*#__PURE__*/__webpack_require__.n(external__is_);

  // EXTERNAL MODULE: external "@wonderlandlabs/inspector"
  var inspector_ = __webpack_require__(3);

  // EXTERNAL MODULE: external "lodash.get"
  var external__lodash_get_ = __webpack_require__(4);

  // CONCATENATED MODULE: ./src/utils.js


  const compact = a => a.filter(v => v);

  const popObject = (obj, field, def) => {
    if (field in obj) {
      const out = obj[field];
      delete obj[field];
      return out;
    }
    return def;
  };


  // CONCATENATED MODULE: ./src/Propper.js




  const DEFAULT_DEFAULTS = name => ({
    onInvalid(value, error) {
      console.log(`error: setting ${name}`, error, value);
    }
  });

  const throwOnInvalid = (value, error) => {
    const err = new Error(error);
    err.value = value;
    throw err;
  };

  class Propper_Propper {
    constructor(BaseClass, options = {}, defaults = DEFAULT_DEFAULTS) {
      Object.assign(this, options);
      this.defaults = defaults;
      this.BaseClass = BaseClass;
    }

    addProp(name, options = {}) {
      const defaults = external__is__default.a.function(this.defaults) ? this.defaults(name, options) : this.defaults;
      const def = Object.assign({}, defaults || {}, options);
      const tests = compact([popObject(def, 'type', null), ...popObject(def, 'tests', [])]);
      const required = popObject(def, 'required', null);
      const onChange = popObject(def, 'onChange');
      const enumerable = popObject(def, 'enumerable', false);
      let onInvalid = popObject(def, 'onInvalid', throwOnInvalid);

      if (onInvalid === 'throw') {
        onInvalid = throwOnInvalid;
      }

      const defaultValue = popObject(def, 'defaultValue', null);
      let defaultFn = defaultValue;
      if (!external__is__default.a.function(defaultValue)) {
        defaultFn = () => defaultValue;
      }
      const localName = popObject(def, 'localName', `_${name}`);
      let validation = false;
      if (tests.length || required) {
        switch (required) {
          case true:
            validation = Object(inspector_["validator"])(tests, { required });
            break;

          case false:
            validation = Object(inspector_["validator"])(tests, { required });
            break;

          default:
            validation = Object(inspector_["validator"])(tests, {});
        }
      }

      const propDef = {
        configurable: false,
        enumerable,
        get() {
          if (!(localName in this)) {
            this[localName] = defaultFn();
          }
          return this[localName];
        },
        set(value) {
          if (localName in this) {
            if (this[localName] === value) {
              return;
            }
          }
          if (localName in this) {
            const lastVal = this[localName];
            this[localName] = value;
            if (onChange) {
              onChange.bind(this)(value, lastVal);
            }
          } else {
            this[localName] = value;
            if (onChange) {
              onChange.bind(this)(value);
            }
          }
        }
      };

      if (validation) {
        Object.assign(propDef, {
          set(value) {
            if (localName in this) {
              if (this[localName] === value) {
                return;
              }
            }
            let error = validation(value);
            if (error) {
              if (external__is__default.a.string(error)) {
                error = `${name} error`;
              } else if (external__is__default.a.array(error)) {
                error = error.map(a => {
                  if (external__is__default.a.string(a)) return `${name} ${a}`;
                  return a;
                });
              }
              onInvalid(value, error);
              return;
            }
            const lastVal = this[localName];
            this[localName] = value;
            if (onChange) {
              onChange.bind(this)(value, lastVal);
            }
          }
        });
      }

      Object.defineProperty(this.BaseClass.prototype, name, propDef);

      return this;
    }

    set defaults(value) {
      this._defaults = Object.assign({}, value || {});
    }

    get defaults() {
      return this._defaults;
    }
  }

  /* harmony default export */ var src_Propper = (Propper_Propper);
  // CONCATENATED MODULE: ./src/index.js
  /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "propInjector", function() { return propInjector; });
  /* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Propper", function() { return src_Propper; });


  const propInjector = (classDef, options = {}) => new src_Propper(classDef, options);

  /* harmony default export */ var src = __webpack_exports__["default"] = (propInjector);



  /***/ }),
  /* 2 */
  /***/ (function(module, exports) {

  module.exports = is_1;

  /***/ }),
  /* 3 */
  /***/ (function(module, exports) {

  module.exports = build;

  /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

  module.exports = lodash_get;

  /***/ })
  /******/ ]);

  });

  var propper = unwrapExports(build$1);

  const ABSENT = Symbol('absent');

  const isAbsent = (item = ABSENT) => item === ABSENT;

  /* eslint-disable no-param-reassign */

  class FieldState {
    constructor(name, value, errors = [], checked = true) {
      if (is_1.object(name)) {
        value = name.value;
        errors = name.errors;
        name = name.name;
        checked = name.checked;
      }
      this.name = name;
      this.value = value;
      this.errors = errors;
      this.checked = checked;
    }

    get isValid() {
      return !this.errors.length;
    }

    toString() {
      if (!this.errors.length) return '';
      return `${this.name} errors: ${this.errors.join(',')}`;
    }
  }

  propper(FieldState)
    .addProp('errors', {
      required: true,
      type: 'array',
      defaultValue: () => ([]),
    })
    .addProp('checked', {
      type: 'boolean',
      defaultValue: ABSENT,
    })
    .addProp('name', {
      required: true,
      type: 'string',
    });

  function s(value) {
    if (is_1.string(value)) return value;
    if (typeof value === 'symbol') return value.toString();
    try {
      return `${value}`;
    } catch (err) {
      return '-unreadable-string-';
    }
  }

  /* eslint-disable no-param-reassign */

  function doValidator(value, test, def) {
    if (is_1.string(test)) {
      if (!is_1[test]) {
        throw new Error(`test string ${test} not in is.js`);
      }
      return !is_1[test](value);
    }
    if (is_1.function(test)) {
      return test(value);
    }
    throw new Error(`bad test ${test}`);
  }

  /**
   * a structure for validating fields.
   * note validator is either
   * 1. a function that returns false if there are NO ERRORS
   *    and true (or a stgring - error message) if there ARE ERRORS,
   * 2. a string (name of an is.js method)
   * 3. an array of (1) and/or (2)
   *
   *
   */
  class FieldDef {
    constructor(name, params = {}, schema) {
      if (is_1.string(params)) {
        params = { type: params };
      } else if (is_1.function(params) || is_1.array(params)) {
        params = { validator: params };
      }
      this.schema = schema;

      const defaults = lodash_get(schema, 'fieldDefaults', {});
      params = { ...defaults, ...params };
      const {
        type = ABSENT,
        validator = ABSENT,
        required = false,
        defaultValue = ABSENT,
        requiredMessage = ABSENT,
        invalidMessage = ABSENT,
        stopIfInvalid = true,
      } = params;
      this.name = name;
      this.type = type || '';
      this.validator = validator;
      this.required = !!required;
      this.stopIfInvalid = stopIfInvalid; //  you want to stop on the first error
      this.invalidMessage = isAbsent(invalidMessage) ? `${name} invalid` : invalidMessage;
      this.requiredMessage = isAbsent(requiredMessage) ? `${name} required` : requiredMessage;
      this.defaultValue = defaultValue;
    }

    /**
     *
     * @param value
     * @returns FieldState
     */
    validate(value) {
      const out = new FieldState(this.name, value);
      if ((isAbsent(value) || !value) && !this.required) {
        return out;
      }

      if (!isAbsent(this.type)) {
        const testError = doValidator(value, this.type);
        if (testError) {
          out.errors.push(`${this.name}: ${s(value)} is not a ${this.type}`);
        }
      }

      if (this.stopIfInvalid && out.errors.length) {
        return out;
      }

      if (Array.isArray(this.validator)) {
        this.validator.forEach((validator) => {
          if (out.errors.length && this.stopIfInvalid) {
            return;
          }
          const error = doValidator(value, validator);
          if (error) {
            out.errors.push(error === true ? this.invalidMessage : error);
          }
        });
      } else if (!isAbsent(this.validator)) {
        const error = doValidator(value, this.validator);
        if (error) {
          out.errors.push((error === true || (!is_1.string(error))) ? this.invalidMessage : error);
        }
      }
      return out;
    }
  }

  propper(FieldDef)
    .addProp('schema', {
      type: 'object',
      required: false,
    })
    .addProp('validator', {
      defaultValue: ABSENT,
    })
    .addProp('type', {
      defaultValue: ABSENT,
      required: false,
    })
    .addProp('defaultValue', {
      defaultValue: ABSENT,
    })
    .addProp('invalidMessage', {
      type: 'string',
      defaultValue: 'invalid',
      required: true,
    })
    .addProp('stopIfInvalid', {
      type: 'boolean',
      defaultValue: false,
    })
    .addProp('requiredMessage', {
      type: 'string',
      defaultValue: 'required',
      required: true, // ha!
    })
    .addProp('name', {
      type: 'string',
      required: true,
    });

  class RecordState {
    constructor(record, schema, filter) {
      this.record = record;
      this.schema = schema;
      this.filter = filter;
      this.validate(record, filter);
    }

    validate(record, filter = null) {
      this.schema.fields.forEach((fieldDef, name) => {
        const value = record[name];
        if (Array.isArray(filter) && !filter.includes(name)) {
          this.fields.set(name, new FieldState(name, value, [], false));
          return;
        }
        const validationResult = fieldDef.validate(value);
        this.fields.set(name, validationResult);
      });
    }

    get isValid() {
      return Array.from(this.fields.values())
        .reduce((v, state) => v && state.isValid, true);
    }
  }

  propper(RecordState)
    .addProp('fields', {
      defaultValue: () => new Map(),
    });

  class Schema {
    constructor(name, fields, fieldDefaults = {}) {
      this.name = name;
      if (fields) {
        if (Array.isArray(fields)) {
          fields.forEach((field) => {
            if (Array.isArray(field)) {
              this.addField(...field);
            } else this.addField(field);
          });
        } else if (is_1.object(fields)) {
          Object.keys(fields).forEach((fieldName) => {
            const def = fields[fieldName];
            this.addField(fieldName, def);
          });
        }
      }
      this.fieldDefaults = {};
    }

    addField(name, def) {
      if (is_1.object(name)) {
        if ('name' in name) {
          this.addField(name.name, name);
        } else {
          this.fields.set(name, new FieldDef(name, def));
        }
      } else {
        this.fields.set(name, new FieldDef(name, def));
      }
    }

    validate(record, fields) {
      return new RecordState(record, this, fields);
    }

    /**
     * create a properly typed instance, optionally with passed in values,
     * respecting the default values when none provided.
     * @param config
     */
    instance(record = {}, config = {}) {
      const fields = lodash_get(config, 'fields', Array.from(this.fields.keys()));
      const limitToSchema = lodash_get(config, 'limitToSchema', true);

      fields.forEach((fieldName) => {
        if (!(this.fields.has(fieldName))) {
          if (limitToSchema) {
            throw new Error(`schema ${this.name} has no field ${fieldName}`);
          }
        } else if (!(fieldName in record)) {
          const def = this.fields.get(fieldName);
          if (!isAbsent(def.defaultValue)) {
            if (is_1.function(def.defaultValue) && (def.type !== 'function')) {
              record[fieldName] = def.defaultValue();
            } else {
              record[fieldName] = def.defaultValue;
            }
          }
        }
      });

      return record;
    }
  }

  propper(Schema)
    .addProp('fieldDefaults', {}, 'object')
    .addProp('fields', {
      defaultValue: () => new Map(),
    });

  var index = {
    Schema,
    FieldDef,
    FieldState,
    ABSENT,
    isAbsent,
  };

  return index;

}));
