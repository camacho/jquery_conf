class App.States.Location extends App.Module
  type : 'state'
  name : 'location'
  dependencies :
    [
      'nav'
    ]

  onStart : ->
    # We only want one state at a time, so register to stop when another wants to starts
    @vent.one "state:onBeforeStart", @stop.bind @

    # Render the form
    @render()

  render : ->
    @$el = $ '<div class="location"><h1> Set your location</h1></div>'
    @$input = $ '<input type="text" placeholder="Change location..." value="' + App.location + '" />'
    @$submit = $ '<button>Submit</button>'

    @$input.on 'keypress input', @updateValue.bind @
    @$submit.click @submitValue.bind @

    @$el.append(@$input.add @$submit).appendTo 'body'
    @$input.focus()

  updateValue : (e) -> if e.keyCode is 13 then @submitValue()

  submitValue : ->
    location = $.trim @$input.val()
    return if location is '' or App.location is location
    App.location = location
    @vent.trigger 'location:change'

  onBeforeStop : ->
    @$input.off()
    @$submit.off()

  onStop : -> @$el.remove()