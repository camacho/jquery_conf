class App.States.Cafes extends App.Module
  type : 'state'
  name : 'cafes'
  dependencies :
    [
      'nav'
      'map'
    ]

  onStart : ->
    # We only want one state at a time, so register to stop when another wants to starts
    @vent.one "state:onBeforeStart", @stop.bind @

    # Search for cafes :)
    @vent.trigger 'component:map:search', [App.location, 'cafe']