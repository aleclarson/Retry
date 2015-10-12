
# retry v1.0.4 [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

This package is stripped from [meteor/retry](https://atmospherejs.com/meteor/retry) and made compatible with [React Native](https://github.com/facebook/react-native).

**Note:** This package is only for client-side usage.

&nbsp;

## usage

```js
var Retry = require('retry');

var retry = new Retry({
  fuzz: 0.5,             // Factor to randomize retry count by (to avoid retry storms)
  exponent: 2.2,         // Exponential factor to increase timeout each attempt
  minCount: 10,          // How many time to reconnect "instantly"
  minTimeout: 2,         // Time to wait for the first `minCount` retries (in milliseconds)
  maxTimeout: 5 * 60000, // Maximum time between retries (in milliseconds)
  baseTimeout: 1000,     // Time for initial reconnect attempt (in milliseconds)
});
```
