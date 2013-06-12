# Create our vent to manage subscriptions and publications
# For this example, we are just wrapping around the $.fn events on the document node
$document = $ document

class App.Vent
  on : $document.on.bind $document
  one : $document.one.bind $document
  off : $document.off.bind $document
  trigger : $document.trigger.bind $document

  requestResponse : (name) -> @_responses[name]

  registerResponse : (name, value) ->
    oldValue = @_responses[name]
    @_responses[name] = value

    if oldValue isnt value then @trigger "#{ name }:change", [value, oldValue]

  _responses : {}