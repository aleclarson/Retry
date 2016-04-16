var Factory, Null, Random, Timer, assertType, emptyFunction, ref;

ref = require("type-utils"), Null = ref.Null, assertType = ref.assertType;

emptyFunction = require("emptyFunction");

Factory = require("factory");

Random = require("random");

Timer = require("timer");

module.exports = Factory("Retry", {
  kind: Function,
  optionTypes: {
    baseTimeout: Number,
    exponent: Number,
    maxTimeout: Number,
    minTimeout: Number,
    minCount: Number,
    fuzz: [Number, Null]
  },
  optionDefaults: {
    baseTimeout: 1e3,
    exponent: 2.2,
    maxTimeout: 5 * 6e4,
    minTimeout: 10,
    minCount: 2,
    fuzz: 0.5
  },
  customValues: {
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
  },
  initValues: function(options) {
    return [
      options, {
        _retries: 0,
        _retryTimer: null,
        _callback: null
      }
    ];
  },
  boundMethods: ["_retry"],
  func: function(callback) {
    var timeout;
    if (this._retryTimer != null) {
      return;
    }
    assertType(callback, Function.Kind);
    this._callback = callback;
    timeout = this._computeTimeout(this._retries);
    this._retryTimer = Timer(timeout, this._retry);
  },
  reset: function() {
    if (this._retryTimer != null) {
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
    callback = this._callback;
    this._callback = null;
    this._retryTimer = null;
    this._retries += 1;
    callback();
  }
});

//# sourceMappingURL=../../map/src/Retry.map
