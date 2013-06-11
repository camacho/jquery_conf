class App.States.Bars extends App.Module
  type : 'state'
  name : 'bars'
  dependencies :
    [
      'nav'
      'map'
    ]

  onStart : ->
    # We only want one state at a time, so register to stop when another wants to starts
    @vent.one "state:onBeforeStart", @stop.bind @

    # Search for nearby bars
    @vent.trigger 'component:map:search', [App.location, 'bar']