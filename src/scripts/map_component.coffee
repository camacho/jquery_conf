class App.Components.Map extends App.Module
  type : 'component'
  name : 'map'

  onStart : ->
    @render()
    @vent.on 'component:map:search', @searchPlacesByLocation.bind @

  render : ->
    @$el = $('<div class="map"></div>').appendTo 'body'

    # Share our geocoder
    @geocoder = new google.maps.Geocoder()

    mapOptions =
      mapTypeId : google.maps.MapTypeId.ROADMAP
      zoom : 14

    # Only one info window per map
    @infoWindow = new google.maps.InfoWindow()

    # Create the new map object
    @map = new google.maps.Map @$el[0], mapOptions

  getLocation : (location) ->
    lookup = $.Deferred()

    @geocoder.geocode 'address' : location, (results, status) ->
      if status is google.maps.GeocoderStatus.OK
        lookup.resolve results[0].geometry.location
      else
        # alert "Geocode was not successful for the following reason: #{ status }"
        lookup.reject status

    lookup

  searchPlacesByLocation : (e, location, types) ->
    @clearMarkers()
    @markers = []
    @getLocation(location).done (latLng) => @nearbySearch types, latLng


  nearbySearch : (types, latLng) ->
    request =
      location : latLng
      radius : 1000
      types : if types instanceof Array then types else [types]

    service = new google.maps.places.PlacesService @map

    service.nearbySearch request, (results, status) =>
      if status is google.maps.places.PlacesServiceStatus.OK
        bounds = new google.maps.LatLngBounds()

        for place in results
          @renderMarker place
          bounds.extend place.geometry.location

        @map.fitBounds bounds

  clearMarkers : -> marker.setMap null for marker in @markers if @markers

  renderMarker : (place) ->
    @markers.push marker = new google.maps.Marker map : @map, position : place.geometry.location
    google.maps.event.addListener marker, 'click', =>
      @infoWindow.setContent "<strong>#{ place.name }</strong><br><em>#{ place.rating or '--' } / 5</em>"
      @infoWindow.open @map, marker

  onStop : ->
    @$el.remove()
    @vent.off 'component:map:search'
    @$el = null
    @map = null
    @geocoder = null