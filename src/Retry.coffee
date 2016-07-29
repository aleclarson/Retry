
emptyFunction = require "emptyFunction"
assertType = require "assertType"
Random = require "random"
Timer = require "timer"
Null = require "Null"
Type = require "Type"

type = Type "Retry", (callback) ->
  return if @_retryTimer
  assertType callback, Function.Kind
  @_callback = callback
  timeout = @_computeTimeout @_retries
  @_retryTimer = Timer timeout, @_retry
  return

type.defineOptions
  baseTimeout: Number.withDefault 1e3 # => 1 second
  exponent: Number.withDefault 2.2
  maxTimeout: Number.withDefault 5 * 6e4 # => 5 minutes
  minTimeout: Number.withDefault 10
  minCount: Number.withDefault 2
  fuzz: { type: [ Number, Null ], default: 0.5 }
  canRetry: Function.withDefault emptyFunction.thatReturnsTrue

type.defineValues

  baseTimeout: (options) -> options.baseTimeout

  exponent: (options) -> options.exponent

  maxTimeout: (options) -> options.maxTimeout

  minTimeout: (options) -> options.minTimeout

  minCount: (options) -> options.minCount

  fuzz: (options) -> options.fuzz

  canRetry: (options) -> options.canRetry

  _retries: 0

  _retryTimer: null

  _callback: null

type.defineGetters

  retries: -> @_retries

  isRetrying: -> @_retryTimer isnt null

type.defineBoundMethods

  _retry: ->
    return unless @canRetry()
    callback = @_callback
    @_callback = null
    @_retryTimer = null
    @_retries += 1
    callback()
    return

type.defineMethods

  reset: ->
    if @_retryTimer
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

module.exports = type.build()
