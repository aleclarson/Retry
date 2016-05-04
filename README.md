
# Retry 3.0.0 ![stable](https://img.shields.io/badge/stability-stable-4EBA0F.svg?style=flat)

`Retry` is a class that retries one `Function` at a time.

For every successive retry, exponential backoff is applied using the given options.

### Retry.optionTypes

```coffee
# Milliseconds to wait for the first "non-instant" reconnect attempt.
# Defaults to 1000
baseTimeout: Number

# Exponential factor to increate timeout each attempt.
# Defaults to 2.2
exponent: Number

# Maximum milliseconds to wait before reconnecting.
# Defaults to 300,000 (5 minutes)
maxTimeout: Number

# Milliseconds to wait before reconnecting "instantly".
# Defaults to 10
minTimeout: Number

# Number of times to reconnect "instantly".
# Defaults to 2
minCount: Number

# Avoids "retry storms" when a server goes down.
# Defaults to 0.5
fuzz: [ Number, Null ]

# Return false if the function should not be retried.
# Defaults to a function that always returns true.
canRetry: Function
```

#### Retry.properties

```coffee
# Defaults to 'options.baseTimeout'
retry.baseTimeout

# Defaults to 'options.exponent'
retry.exponent

# Defaults to 'options.maxTimeout'
retry.maxTimeout

# Defaults to 'options.minTimeout'
retry.minTimeout

# Defaults to 'options.minCount'
retry.minCount

# Defaults to 'options.fuzz'
retry.fuzz

# Defaults to 'options.canRetry'
retry.canRetry

# The number of retries. (read-only)
retry.retries

# Equals true when retrying. (read-only)
retry.isRetrying
```

#### Retry.prototype

```coffee
# Retries the given function.
# Increments 'retry.retries'.
retry ->

# Resets 'retry.retries' and stops the retry timer if active.
retry.reset()
```

-

**TODO:** Write tests?!
