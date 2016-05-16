var define;

define = require("define");

define(exports, {
  Retry: {
    lazy: function() {
      return require("./Retry");
    }
  },
  RemoteRetry: {
    lazy: function() {
      return require("./RemoteRetry");
    }
  }
});

//# sourceMappingURL=../../map/src/index.map
