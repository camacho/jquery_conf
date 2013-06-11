class App.Components.Nav extends App.Module
  type : 'component'
  name : 'nav'

  onStart : (e, origin) ->
    # Render the navigation
    @render()
    @$el.on 'click', 'a.seven', @iveify

    # Call update on the nav to make sure it is in the right state
    @updateNav.apply @, arguments

    # Subscribe to any location changes to update the title and state changes to update the nav
    @vent.on 'location:change.nav', @updateTitle.bind @
    @vent.on 'state:onStart.nav', @updateNav.bind @

  render : ->
    # Some simple rendering - can be replaced with a templating system for cleaner code
    @$el = $ '<nav></nav>'

    @$title = $("<a href=\"#location\" class=\"title\">#{ App.location }</a>").appendTo @$el
    @$links = $('<a href="#bars">Bars</a><a href="#cafes">Cafes</a><a href="#location">Location</a><a href="#" class="seven">7</a>').appendTo @$el

    @$el.prependTo 'body'

  updateNav : (e, state) ->
    # Update the nav to highlight the right links
    @$links.removeClass('active').filter( -> $(this).attr('href') is '#' + state.name).addClass 'active'

  updateTitle : ->
    # Change the title to reflect location
    @$title.text App.location

  iveify : (e) ->
    $('body').find('a.seven').toggleClass 'active'
    $map = $('body').find '.map'
    if @_interval?
      clearInterval @_interval
      delete @_interval
      $map.css '-webkit-filter', "none"
    else
      deg = 5
      @_interval = setInterval ->
        deg = deg + 5
        $map.css '-webkit-filter', "contrast(3) hue-rotate(#{deg}deg)"
      , 50
    e.preventDefault()


  onBeforeStop : ->
    # Unsubscribe to change events for title and start events for states
    # KR: I think this guy should be 'location:change.nav state:onStart.nav'
    @vent.off 'title:change.nav state:onStart.nav'

  onStop : ->
    @$el.off()

    # Remove the element when stopping
    @$el.remove()