
# retry v2.0.0 [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Retries a `Function` using exponential backoff.

```coffee
{ Retry } = require "retry"

retry = Retry()

loadEventually = ->
  loadSomething().fail ->
    retry loadEventually
```

#### Options

- `baseTimeout: Number` - Milliseconds to wait for the first "non-instant" reconnect attempt. Defaults to `1000`.
- `exponent: Number` - Exponential factor to increate timeout each attempt. Defaults to `2.2`.
- `maxTimeout: Number` - Maximum milliseconds to wait before reconnecting. Defaults to `300000` (5 minutes).
- `minTimeout: Number` - Milliseconds to wait before reconnecting "instantly". Defaults to `10`.
- `minCount: Number` - Number of times to reconnect "instantly". Defaults to `2`.
- `fuzz: [ Number, Void ]` - Avoids "retry storms" when a server goes down. Defaults to `0.5`.

#### Properties

- `retries: Number { get }`
- `isRetrying: Boolean { get }`

All options are made properties.

#### Methods

- `reset()` - Stops the retry timer and resets the retry count.
