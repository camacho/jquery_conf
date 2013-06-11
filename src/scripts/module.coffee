class App.Module
  dependencies : []

  constructor : (@vent) -> @register()

  register : -> @vent.on "#{ @type }:#{ @name }:start", @start.bind @

  start : ->
    if @_isActive then return

    @vent.trigger "#{ @type }:onBeforeStart", @
    @onBeforeStart?.apply @, arguments

    @startDependencies.apply @, arguments
    @_isActive = true

    # Register to stop on call
    @vent.one "#{ @type }:#{ @name }:stop", @stop.bind @

    @onStart?.apply @, arguments
    @vent.trigger "#{ @type }:onStart", @

  stop : (event, nextState) ->
    return unless @_isActive

    @vent.trigger "#{ @type }:onBeforeStop", @
    @onBeforeStop?.apply @, arguments

    @stopDependencies nextState
    @_isActive = false

    @onStop?.apply @, arguments
    @vent.trigger "#{ @type }:onStop", @

  startDependencies : ->
    @vent.trigger "component:#{ dependency }:start", @ for dependency in @dependencies

  stopDependencies : (next) ->
    for dependency in @dependencies when dependency not in next.dependencies
      @vent.trigger "component:#{ dependency }:stop", next