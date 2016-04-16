
{ Null, assertType } = require "type-utils"

emptyFunction = require "emptyFunction"
Factory = require "factory"
Random = require "random"
Timer = require "timer"

module.exports = Factory "Retry",

  kind: Function

  optionTypes:
    baseTimeout: Number
    exponent: Number
    maxTimeout: Number
    minTimeout: Number
    minCount: Number
    fuzz: [ Number, Null ]

  optionDefaults:
    baseTimeout: 1e3 # => 1 second
    exponent: 2.2
    maxTimeout: 5 * 6e4 # => 5 minutes
    minTimeout: 10
    minCount: 2
    fuzz: 0.5

  customValues:

    retries: get: ->
      @_retries

    isRetrying: get: ->
      @_retryTimer isnt null

  initValues: (options) -> [
    options
    _retries: 0
    _retryTimer: null
    _callback: null
  ]

  boundMethods: [
    "_retry"
  ]

  func: (callback) ->
    return if @_retryTimer?
    assertType callback, Function.Kind
    @_callback = callback
    timeout = @_computeTimeout @_retries
    @_retryTimer = Timer timeout, @_retry
    return

  reset: ->
    if @_retryTimer?
      @_retryTimer.stop()
      @_retryTimer = null
    @_retries = 0
    @_callback = null
    return

  _computeTimeout: (count) ->
    return @minTimeout if count < @minCount
    timeout = @baseTimeout * Math.pow @exponent, count - @minCount
    @_applyFuzz Math.min timeout, @maxTimeout

  _applyFuzz: (timeout) ->
    return timeout if @fuzz is null
    fuzz = @fuzz * Random.fraction()
    fuzz += 1 - @fuzz / 2
    timeout * fuzz

  _retry: ->
    callback = @_callback
    @_callback = null
    @_retryTimer = null
    @_retries += 1
    callback()
    return