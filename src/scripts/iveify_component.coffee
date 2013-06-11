class App.Components.Iveify extends App.Module
  type : 'component'
  name : 'iveify'

  onStart : -> @render()

  render : -> @$el = $('<img src="iveify.png" />').appendTo 'body'

  onStop : -> @$el.remove()