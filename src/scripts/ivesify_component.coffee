class App.Components.Ivesify extends App.Module
  type : 'component'
  name : 'ivesify'

  onStart : -> @render()

  render : -> @$el = $('<img src="ivesify.png" />').appendTo 'body'

  onStop : -> @$el.remove()