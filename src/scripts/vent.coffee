# Create our vent to manage subscriptions and publications
# For this example, we are just wrapping around the $.fn events on the document node
$document = $ document

class App.Vent
  on : $document.on.bind $document
  one : $document.one.bind $document
  off : $document.off.bind $document
  trigger : $document.trigger.bind $document

  get : (name) -> @_responses[name]

  set : (name, value) ->
    oldValue = @_responses[name]
    @_responses[name] = value

    if oldValue isnt value then @trigger "#{ name }:change", [value, oldValue]

  _responses : {}