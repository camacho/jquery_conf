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
    # Build the form elements and keep references for events (replace with templates in the long run)
    @$el = $ '<div class="location"><h1> Set your location</h1></div>'

    @$input = $ '<input type="text" placeholder="Change location..." />'
    @$input.val @vent.get 'location'

    @$submit = $ '<button>Submit</button>'

    # Bind for keypress, input, and click events on the form
    @$input.on 'keypress input', @updateValue.bind @
    @$submit.click @submitValue.bind @

    # Add the form to the body and focus on the input
    @$el.append(@$input.add @$submit).appendTo 'body'
    @$input.focus()

  updateValue : (e) -> if e.keyCode is 13 then @submitValue()

  submitValue : ->
    # Make sure the value is valid
    location = $.trim @$input.val()
    return if location is '' or @vent.get('location') is location

    # Update the value and send out a trigger
    @vent.set 'location', location

  # KR: Might be simpler for the talk to just override #stop, do these both in the same method and call super.
  # Although I suppose events and wrappers around them is a big point. :)
  onBeforeStop : ->
    # Stop listening to input and submit events
    @$input.off()
    @$submit.off()

  onStop : ->
    # Remove the element
    @$el.remove()