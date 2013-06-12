class App.Components.Map extends App.Module
  type : 'component'
  name : 'map'

  onStart : ->
    # Render the map
    @render()

    # Begin listening to map search events
    @vent.on 'component:map:search', @searchPlacesByLocation.bind @
    @vent.on 'component:map:clear', @clearMarkers.bind @

  render : ->
    # Place the map canvas onto the body
    @$el = $('<div class="map"></div>').appendTo 'body'

    mapOptions =
      mapTypeId : google.maps.MapTypeId.ROADMAP
      zoom : 14

    # Only one info window per map
    @infoWindow = new google.maps.InfoWindow()

    # Create the new map object
    @map = new google.maps.Map @$el[0], mapOptions

  getLocation : (location) ->
    # Abort anyone listening for the last location fetch (keeps down # of requests)
    @locationFetch?.reject()

    # Use a promise to have more flexibility with callbacks
    @locationFetch = $.Deferred()

    # Create a new geocoder if we haven't already
    @geocoder ?= new google.maps.Geocoder()

    # Make the request for geocode, updating the deferred with success or fail
    @geocoder.geocode 'address' : location, (results, status) =>
      if status is google.maps.GeocoderStatus.OK
        @locationFetch.resolve results[0].geometry.location
      else
        # alert "Geocode was not successful for the following reason: #{ status }"
        @locationFetch.reject status

    @locationFetch

  searchPlacesByLocation : (e, location, types) ->
    # Make sure that we have cleared all the markers
    @clearMarkers()
    @markers = []

    # Easter egg only
    adjustedLocation = if location.toLowerCase().indexOf('cupertino') isnt -1
      'Infinite Loop, Cupertino, CA'
    else
      location

    # Get the location's lat and lng, than search nearby
    @getLocation(adjustedLocation).done (latLng) =>
      @updateFilter location
      @nearbySearch types, latLng

  updateFilter : (location) ->
    if location.toLowerCase().indexOf('cupertino') isnt -1 then @startFilter() else @stopFilter()

  startFilter : ->
    stopFilter() if @_interval?
    $map = @$el
    deg = 5
    @_interval = setInterval ->
      deg = deg + 5
      $map.css '-webkit-filter', "contrast(3) hue-rotate(#{deg}deg)"
    , 50

  stopFilter : ->
    return unless @_interval?
    clearInterval @_interval
    delete @_interval
    @$el.css '-webkit-filter', "none"


  nearbySearch : (types, latLng) ->
    # Create a new places service if we don't have one already
    @service ?= new google.maps.places.PlacesService @map

    # Define the attributes of the search
    request =
      location : latLng
      radius : 1000
      types : if types instanceof Array then types else [types]

    # Execute the search
    @service.nearbySearch request, (results, status) =>
      if status is google.maps.places.PlacesServiceStatus.OK
        # Keep track of the lat / lng bounds of the search results
        bounds = new google.maps.LatLngBounds()

        # Place a marker for each result
        for place in results
          @renderMarker place
          bounds.extend place.geometry.location

        # Make sure the map is at the right zoom and location to show results
        @map.fitBounds bounds

  clearMarkers : ->
    # Loop through the markers recorded and clear them off the map
    marker.setMap null for marker in @markers if @markers

  renderMarker : (place) ->
    # Record the new marker
    @markers.push marker = new google.maps.Marker map : @map, position : place.geometry.location

    # Add click event to show the info window and change its content
    google.maps.event.addListener marker, 'click', =>
      @infoWindow.setContent "<strong>#{ place.name }</strong><br><em>#{ place.rating or '--' } / 5</em>"
      @infoWindow.open @map, marker

  onBeforeStop : ->
    # Stop listening for map search events
    @vent.off 'component:map:search component:map:clear'

    @tearDownMaps()

  onStop : ->
    # Remove the element
    @$el.remove()

  tearDownMaps : ->
    # Clean up any references to objects dependent on the map
    @map =  @service = @infoWindow = @markers = null

    # Abort any location fetches
    @locationFetch?.reject()