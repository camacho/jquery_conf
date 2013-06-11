class App.States.Ive extends App.Module
  type : 'state'
  name : 'ive'
  dependencies :
    [
      'nav'
      'iveify'
    ]

  onStart : ->
    # We only want one state at a time, so register to stop when another wants to starts
    @vent.one "state:onBeforeStart", @stop.bind @

    # Search for simplicity :)
    @vent.trigger 'component:map:search', [App.location, 'apple']