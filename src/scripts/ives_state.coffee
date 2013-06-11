class App.States.Ives extends App.Module
  type : 'state'
  name : 'ives'
  dependencies :
    [
      'nav'
      'ivesify'
    ]

  onStart : ->
    # We only want one state at a time, so register to stop when another wants to starts
    @vent.one "state:onBeforeStart", @stop.bind @

    # Search for simplicity :)
    @vent.trigger 'component:map:search', [App.location, 'apple']