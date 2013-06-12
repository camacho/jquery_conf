# Create our simple router
class App.Router

  # If we don't have a hashstate, default to 'bars'
  initialState : 'bars'

  constructor : (@vent) -> @$window = $ window

  start : ->
    # Listen to any changes to the location value and navigate to the initial state
    @vent.on 'location:change', => window.location.hash = @initialState

    # Listen to when the hash tag changes and trigger the event on the App.Vent
    @$window.on 'hashchange', @_trigger.bind @

    # If we have a hash, trigger the event
    if window.location.hash
      @$window.trigger 'hashchange'
    # Otherwise, navigate to our initial state
    else
      window.location.hash = @initialState

  _trigger : ->
    # Fire off an event on the App.Vent that a new state is being requested to start
    @vent.trigger "state:#{ window.location.hash.slice 1 }:start"