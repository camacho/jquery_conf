$document = $ document
$window = $ window

window.App =
  States : {}
  Components : {}

  # Default location
  location : 'Portland'

  # Create our vent to manage subscriptions and publications
  # For this example, we are just wrapping around the $.fn events on the document node
  Vent :
    on : $document.on.bind $document
    one : $document.one.bind $document
    off : $document.off.bind $document
    trigger : $document.trigger.bind $document

  # Create our simple router
  Router :
    # If we don't have a hashstate, default to 'bars'
    initialState : 'bars'

    start : ->
      # Listen to any changes to the location value and navigate to the initial state
      App.Vent.on 'location:change', => window.location.hash = @initialState

      # Listen to when the hash tag changes and trigger the event on the App.Vent
      $window.on 'hashchange', @_trigger.bind @

      # If we have a hash, trigger the event
      if window.location.hash
        $window.trigger 'hashchange'
      # Otherwise, navigate to our initial state
      else
        window.location.hash = @initialState

    _trigger : ->
      # Fire off an event on the App.Vent that a new state is being requested to start
      App.Vent.trigger "state:#{ window.location.hash.slice 1 }:start"

  initialize : ->
    # Create the single instances of our @Components and @States which will register them with the vent
    @Components[component] = new @Components[component] @Vent for component of @Components
    @States[state] = new @States[state] @Vent for state of @States

    # Start our router
    @Router.start()

# When everything is ready, initialize the app
$ App.initialize.bind App