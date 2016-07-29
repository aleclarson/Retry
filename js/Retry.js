var Null, Random, Timer, Type, assertType, emptyFunction, type;

emptyFunction = require("emptyFunction");

assertType = require("assertType");

Random = require("random");

Timer = require("timer");

Null = require("Null");

Type = require("Type");

type = Type("Retry", function(callback) {
  var timeout;
  if (this._retryTimer) {
    return;
  }
  assertType(callback, Function.Kind);
  this._callback = callback;
  timeout = this._computeTimeout(this._retries);
  this._retryTimer = Timer(timeout, this._retry);
});

type.optionTypes = {
  baseTimeout: Number,
  exponent: Number,
  maxTimeout: Number,
  minTimeout: Number,
  minCount: Number,
  fuzz: [Number, Null],
  canRetry: Function
};

type.optionDefaults = {
  baseTimeout: 1e3,
  exponent: 2.2,
  maxTimeout: 5 * 6e4,
  minTimeout: 10,
  minCount: 2,
  fuzz: 0.5,
  canRetry: emptyFunction.thatReturnsTrue
};

type.defineProperties({
  retries: {
    get: function() {
      return this._retries;
    }
  },
  isRetrying: {
    get: function() {
      return this._retryTimer !== null;
    }
  }
});

type.defineValues({
  baseTimeout: function(options) {
    return options.baseTimeout;
  },
  exponent: function(options) {
    return options.exponent;
  },
  maxTimeout: function(options) {
    return options.maxTimeout;
  },
  minTimeout: function(options) {
    return options.minTimeout;
  },
  minCount: function(options) {
    return options.minCount;
  },
  fuzz: function(options) {
    return options.fuzz;
  },
  canRetry: function(options) {
    return options.canRetry;
  },
  _retries: 0,
  _retryTimer: null,
  _callback: null
});

type.bindMethods(["_retry"]);

type.defineMethods({
  reset: function() {
    if (this._retryTimer) {
      this._retryTimer.stop();
      this._retryTimer = null;
    }
    this._retries = 0;
    this._callback = null;
  },
  _computeTimeout: function(count) {
    var timeout;
    if (count < this.minCount) {
      return this.minTimeout;
    }
    timeout = this.baseTimeout * Math.pow(this.exponent, count - this.minCount);
    return this._applyFuzz(Math.min(timeout, this.maxTimeout));
  },
  _applyFuzz: function(timeout) {
    var fuzz;
    if (this.fuzz === null) {
      return timeout;
    }
    fuzz = this.fuzz * Random.fraction();
    fuzz += 1 - this.fuzz / 2;
    return timeout * fuzz;
  },
  _retry: function() {
    var callback;
    if (!this.canRetry()) {
      return;
    }
    callback = this._callback;
    this._callback = null;
    this._retryTimer = null;
    this._retries += 1;
    callback();
  }
});

module.exports = type.build();

//# sourceMappingURL=map/Retry.map
