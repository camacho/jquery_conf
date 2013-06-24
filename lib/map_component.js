(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Components.Map = (function(_super) {
    __extends(Map, _super);

    function Map() {
      _ref = Map.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Map.prototype.type = 'component';

    Map.prototype.name = 'map';

    Map.prototype.onStart = function() {
      this.render();
      this.vent.on('component:map:search', this.searchPlacesByLocation.bind(this));
      return this.vent.on('component:map:clear', this.clearMarkers.bind(this));
    };

    Map.prototype.render = function() {
      var mapOptions;
      this.$el = $('<div class="map"></div>').appendTo('body');
      mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 14
      };
      this.infoWindow = new google.maps.InfoWindow();
      return this.map = new google.maps.Map(this.$el[0], mapOptions);
    };

    Map.prototype.getLocation = function(location) {
      var _ref1,
        _this = this;
      if ((_ref1 = this.locationFetch) != null) {
        _ref1.reject();
      }
      this.locationFetch = $.Deferred();
      if (this.geocoder == null) {
        this.geocoder = new google.maps.Geocoder();
      }
      this.geocoder.geocode({
        'address': location
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          return _this.locationFetch.resolve(results[0].geometry.location);
        } else {
          return _this.locationFetch.reject(status);
        }
      });
      return this.locationFetch;
    };

    Map.prototype.searchPlacesByLocation = function(e, location, types) {
      var adjustedLocation,
        _this = this;
      this.clearMarkers();
      this.markers = [];
      adjustedLocation = location.toLowerCase().indexOf('cupertino') !== -1 ? 'Infinite Loop, Cupertino, CA' : location;
      return this.getLocation(adjustedLocation).done(function(latLng) {
        _this.updateFilter(location);
        return _this.nearbySearch(types, latLng);
      });
    };

    Map.prototype.updateFilter = function(location) {
      if (location.toLowerCase().indexOf('cupertino') !== -1) {
        return this.startFilter();
      } else {
        return this.stopFilter();
      }
    };

    Map.prototype.startFilter = function() {
      var $map, deg;
      if (this._interval != null) {
        stopFilter();
      }
      $map = this.$el;
      deg = 5;
      return this._interval = setInterval(function() {
        deg = deg + 5;
        return $map.css('-webkit-filter', "contrast(3) hue-rotate(" + deg + "deg)");
      }, 50);
    };

    Map.prototype.stopFilter = function() {
      if (this._interval == null) {
        return;
      }
      clearInterval(this._interval);
      delete this._interval;
      return this.$el.css('-webkit-filter', "none");
    };

    Map.prototype.nearbySearch = function(types, latLng) {
      var request,
        _this = this;
      if (this.service == null) {
        this.service = new google.maps.places.PlacesService(this.map);
      }
      request = {
        location: latLng,
        radius: 1000,
        types: types instanceof Array ? types : [types]
      };
      return this.service.nearbySearch(request, function(results, status) {
        var bounds, place, _i, _len;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          bounds = new google.maps.LatLngBounds();
          for (_i = 0, _len = results.length; _i < _len; _i++) {
            place = results[_i];
            _this.renderMarker(place);
            bounds.extend(place.geometry.location);
          }
          return _this.map.fitBounds(bounds);
        }
      });
    };

    Map.prototype.clearMarkers = function() {
      var marker, _i, _len, _ref1, _results;
      if (this.markers) {
        _ref1 = this.markers;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          marker = _ref1[_i];
          _results.push(marker.setMap(null));
        }
        return _results;
      }
    };

    Map.prototype.renderMarker = function(place) {
      var marker,
        _this = this;
      this.markers.push(marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location
      }));
      return google.maps.event.addListener(marker, 'click', function() {
        _this.infoWindow.setContent("<strong>" + place.name + "</strong><br><em>" + (place.rating || '--') + " / 5</em>");
        return _this.infoWindow.open(_this.map, marker);
      });
    };

    Map.prototype.onBeforeStop = function() {
      this.vent.off('component:map:search component:map:clear');
      return this.tearDownMaps();
    };

    Map.prototype.onStop = function() {
      return this.$el.remove();
    };

    Map.prototype.tearDownMaps = function() {
      var _ref1;
      this.map = this.service = this.infoWindow = this.markers = null;
      return (_ref1 = this.locationFetch) != null ? _ref1.reject() : void 0;
    };

    return Map;

  })(App.Module);

}).call(this);
