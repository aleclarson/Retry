
{ assert } = require "type-utils"

isReactNative = require "isReactNative"
Factory = require "factory"
Network = require "network"

Retry = require "./Retry"

module.exports = Factory "RemoteRetry",

  kind: Retry

  init: ->
    assert isReactNative, "Remote retries are only supported in React Native!"

  initValues: ->

    _networkListener: null

  boundMethods: [
    "_onNetworkConnected"
  ]

  reset: ->
    if @_networkListener?
      @_networkListener.stop()
      @_networkListener = null
    Retry::reset.call this

  _onNetworkConnected: ->
    @_networkListener = null
    Retry::_retry.call this

  _shouldRetry: ->
    return yes if Network.isConnected
    @_networkListener = Network.didConnect.once @_onNetworkConnected
    return no

  _retry: ->
    return unless @_shouldRetry()
    Reset::_retry.call this
