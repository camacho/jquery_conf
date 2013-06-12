class App.Components.Nav extends App.Module
  type : 'component'
  name : 'nav'

  onStart : (e, origin) ->
    # Render the navigation
    @render(origin)

    # Subscribe to any location changes to update the title and state changes to update the nav
    @vent.on 'location:change.nav', @updateTitle.bind @
    @vent.on 'state:onStart.nav', @updateNav.bind @

  render : (state) ->
    # Some simple rendering - can be replaced with a templating system for cleaner code
    @$el = $ '<nav></nav>'

    @$title = $("<a href=\"#location\" class=\"title\">#{ @vent.get 'location' }</a>").appendTo @$el
    @$links = $('<a href="#bars">Bars</a><a href="#cafes">Cafes</a><a href="#location">Location</a>').appendTo @$el

    @updateNav null, state

    @$el.prependTo 'body'

  updateNav : (e, state) ->
    # Update the nav to highlight the right links
    @$links.removeClass('active').filter( -> $(this).attr('href') is '#' + state.name).addClass 'active'

  updateTitle : (e, title) ->
    # Change the title to reflect location
    @$title.text title

  onBeforeStop : ->
    # Unsubscribe to change events for title and start events for states
    # KR: I think this guy should be 'location:change.nav state:onStart.nav'
    @vent.off 'title:change.nav state:onStart.nav'

  onStop : ->
    @$el.off()

    # Remove the element when stopping
    @$el.remove()