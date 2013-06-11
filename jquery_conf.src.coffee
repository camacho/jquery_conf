(->
  $document = $ document
  $window = $ window

  window.app =
    $body : $ 'body'

    vent :
      on : $document.on.bind $document
      one : $document.one.bind $document
      off : $document.off.bind $document
      trigger : $document.trigger.bind $document

    router :
      navigate : (hash) -> window.location.hash = hash

      start : ->
        $window.on 'hashchange', @_trigger.bind @
        $window.trigger 'hashchange'

      stop : -> $window.off 'hashchange'

      _trigger : ->
        hash = window.location.hash.slice 1
        app.vent.trigger 'before:route', hash
        app.vent.trigger "route:#{ hash }", hash
        app.vent.trigger 'route', hash

    initialize : ->
      # Start our router
      @vent.on 'route', -> console.log arguments
      @router.start()
)()

$ app.initialize.bind app
