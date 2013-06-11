class App.Components.Nav extends App.Module
  type : 'component'
  name : 'nav'

  onStart : (e, origin) ->
    @render()
    @updateNav.apply @, arguments
    @vent.on 'location:change.nav', @updateTitle.bind @
    @vent.on 'state:onStart.nav', @updateNav.bind @

  render : ->
    @$el = $ '<nav></nav>'

    @$title = $("<span>#{ App.location }</span>").appendTo @$el
    @$links = $('<a href="#bars">Bars</a> <a href="#cafes">Cafes</a><a href="#location">Location</a>').appendTo @$el

    @$el.prependTo 'body'

  updateNav : (e, state) ->
    console.log arguments
    @$links.removeClass('active').filter( -> $(this).attr('href') is '#' + state.name).addClass 'active'

  updateTitle : -> @$title.text App.location

  onBeforeStop : -> @vent.off 'title:change.nav hashchange.nav'

  onStop : -> @$el.remove()