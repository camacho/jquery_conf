class App.Module
  dependencies : []

  constructor : (@vent) -> @register()

  register : ->
    # Subscribe to the start event for this module's @type and @name
    @vent.on "#{ @type }:#{ @name }:start", @start.bind @

  start : ->
    # If the module is already active, we can just return
    if @_isActive then return

    # Publish that a new module of @type is about to start, and run any custom setup code
    @vent.trigger "#{ @type }:onBeforeStart", @
    @onBeforeStart?.apply @, arguments

    # Make sure all the dependencies have been started
    @startDependencies.apply @, arguments
    @_isActive = true

    # Register to stop on call
    @vent.one "#{ @type }:#{ @name }:stop", @stop.bind @

    # Run any after start code and publish that a new @type has started
    @onStart?.apply @, arguments
    @vent.trigger "#{ @type }:onStart", @

  stop : (event, caller) ->
    # We don't need to stop if it isn't active
    return unless @_isActive

    # Publish that @type is stopping and call any custom tear down code
    @vent.trigger "#{ @type }:onBeforeStop", @
    @onBeforeStop?.apply @, arguments

    # Make sure to stop any dependencies not shared
    @stopDependencies.apply @, arguments
    @_isActive = false

    # Run any after stop clean up code and publish that @type was stopped
    @onStop?.apply @, arguments
    @vent.trigger "#{ @type }:onStop", @

  startDependencies : ->
    # Trigger start on any dependency components (this can be built out for other namespaces, too)
    @vent.trigger "component:#{ dependency }:start", @ for dependency in @dependencies

  stopDependencies : (event, caller) ->
    # Stop any dependencies unless the caller module needs them
    for dependency in @dependencies when dependency not in caller.dependencies
      @vent.trigger "component:#{ dependency }:stop", caller