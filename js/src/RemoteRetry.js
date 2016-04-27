var Factory, Network, Retry, assert;

require("isReactNative");

assert = require("type-utils").assert;

Factory = require("factory");

Network = require("network");

Retry = require("./Retry");

module.exports = Factory("RemoteRetry", {
  kind: Retry,
  init: function() {
    return assert(isReactNative, "Remote retries are only supported in React Native!");
  },
  initValues: function() {
    return {
      _networkListener: null
    };
  },
  boundMethods: ["_onNetworkConnected"],
  reset: function() {
    if (this._networkListener != null) {
      this._networkListener.stop();
      this._networkListener = null;
    }
    return Retry.prototype.reset.call(this);
  },
  _onNetworkConnected: function() {
    this._networkListener = null;
    return Retry.prototype._retry.call(this);
  },
  _shouldRetry: function() {
    if (Network.isConnected) {
      return true;
    }
    this._networkListener = Network.didConnect.once(this._onNetworkConnected);
    return false;
  },
  _retry: function() {
    if (!this._shouldRetry()) {
      return;
    }
    return Reset.prototype._retry.call(this);
  }
});

//# sourceMappingURL=../../map/src/RemoteRetry.map
