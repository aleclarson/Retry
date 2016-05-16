
define = require "define"

define exports,

  Retry: lazy: ->
    require "./Retry"

  RemoteRetry: lazy: ->
    require "./RemoteRetry"
