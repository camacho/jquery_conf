window.App =
  States : {}
  Components : {}

  initialize : ->
    @Vent = new @Vent()
    @Router = new @Router @Vent

    # Create the single instances of our @Components and @States and register them with the vent
    @Components[component] = new @Components[component] @Vent for component of @Components
    @States[state] = new @States[state] @Vent for state of @States

    # Register the default location as Portland
    @Vent.registerResponse 'location', 'Portland'

    # Start our router
    @Router.start()

# When everything is ready, initialize the app
$ App.initialize.bind App