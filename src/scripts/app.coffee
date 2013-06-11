$document = $ document
$window = $ window

window.App =
  States : {}
  Components : {}

  location : 'Portland'

  Vent :
    on : $document.on.bind $document
    one : $document.one.bind $document
    off : $document.off.bind $document
    trigger : $document.trigger.bind $document

  Router :
    initialState : 'bars'

    start : ->
      App.Vent.on 'location:change', => window.location.hash = @initialState
      $window.on 'hashchange', @_trigger.bind @

      if window.location.hash
        $window.trigger 'hashchange'
      else
        window.location.hash = @initialState

    _trigger : ->
      App.Vent.trigger "state:#{ window.location.hash.slice 1 }:start"

  initialize : ->
    @Components[component] = new @Components[component] @Vent for component of @Components
    @States[state] = new @States[state] @Vent for state of @States

    # Start our router
    @Router.start()

$ App.initialize.bind App