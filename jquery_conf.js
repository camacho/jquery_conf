(function() {
  var $document, $window, _ref, _ref1, _ref2, _ref3, _ref4,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $document = $(document);

  $window = $(window);

  window.App = {
    States: {},
    Components: {},
    location: 'Portland',
    Vent: {
      on: $document.on.bind($document),
      one: $document.one.bind($document),
      off: $document.off.bind($document),
      trigger: $document.trigger.bind($document)
    },
    Router: {
      initialState: 'bars',
      start: function() {
        var _this = this;
        App.Vent.on('location:change', function() {
          return window.location.hash = _this.initialState;
        });
        $window.on('hashchange', this._trigger.bind(this));
        if (window.location.hash) {
          return $window.trigger('hashchange');
        } else {
          return window.location.hash = this.initialState;
        }
      },
      _trigger: function() {
        return App.Vent.trigger("state:" + (window.location.hash.slice(1)) + ":start");
      }
    },
    initialize: function() {
      var component, state;
      for (component in this.Components) {
        this.Components[component] = new this.Components[component](this.Vent);
      }
      for (state in this.States) {
        this.States[state] = new this.States[state](this.Vent);
      }
      return this.Router.start();
    }
  };

  $(App.initialize.bind(App));

  App.Module = (function() {
    Module.prototype.dependencies = [];

    function Module(vent) {
      this.vent = vent;
      this.register();
    }

    Module.prototype.register = function() {
      return this.vent.on("" + this.type + ":" + this.name + ":start", this.start.bind(this));
    };

    Module.prototype.start = function() {
      var _ref, _ref1;
      if (this._isActive) {
        return;
      }
      this.vent.trigger("" + this.type + ":onBeforeStart", this);
      if ((_ref = this.onBeforeStart) != null) {
        _ref.apply(this, arguments);
      }
      this.startDependencies.apply(this, arguments);
      this._isActive = true;
      this.vent.one("" + this.type + ":" + this.name + ":stop", this.stop.bind(this));
      if ((_ref1 = this.onStart) != null) {
        _ref1.apply(this, arguments);
      }
      return this.vent.trigger("" + this.type + ":onStart", this);
    };

    Module.prototype.stop = function(event, nextState) {
      var _ref, _ref1;
      if (!this._isActive) {
        return;
      }
      this.vent.trigger("" + this.type + ":onBeforeStop", this);
      if ((_ref = this.onBeforeStop) != null) {
        _ref.apply(this, arguments);
      }
      this.stopDependencies(nextState);
      this._isActive = false;
      if ((_ref1 = this.onStop) != null) {
        _ref1.apply(this, arguments);
      }
      return this.vent.trigger("" + this.type + ":onStop", this);
    };

    Module.prototype.startDependencies = function() {
      var dependency, _i, _len, _ref, _results;
      _ref = this.dependencies;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dependency = _ref[_i];
        _results.push(this.vent.trigger("component:" + dependency + ":start", this));
      }
      return _results;
    };

    Module.prototype.stopDependencies = function(next) {
      var dependency, _i, _len, _ref, _results;
      _ref = this.dependencies;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dependency = _ref[_i];
        if (__indexOf.call(next.dependencies, dependency) < 0) {
          _results.push(this.vent.trigger("component:" + dependency + ":stop", next));
        }
      }
      return _results;
    };

    return Module;

  })();

  App.States.Bars = (function(_super) {
    __extends(Bars, _super);

    function Bars() {
      _ref = Bars.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Bars.prototype.type = 'state';

    Bars.prototype.name = 'bars';

    Bars.prototype.dependencies = ['nav', 'map'];

    Bars.prototype.onStart = function() {
      this.vent.one("state:onBeforeStart", this.stop.bind(this));
      return this.vent.trigger('component:map:search', [App.location, 'bar']);
    };

    return Bars;

  })(App.Module);

  App.States.Cafes = (function(_super) {
    __extends(Cafes, _super);

    function Cafes() {
      _ref1 = Cafes.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Cafes.prototype.type = 'state';

    Cafes.prototype.name = 'cafes';

    Cafes.prototype.dependencies = ['nav', 'map'];

    Cafes.prototype.onStart = function() {
      this.vent.one("state:onBeforeStart", this.stop.bind(this));
      return this.vent.trigger('component:map:search', [App.location, 'cafe']);
    };

    return Cafes;

  })(App.Module);

  App.States.Location = (function(_super) {
    __extends(Location, _super);

    function Location() {
      _ref2 = Location.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    Location.prototype.type = 'state';

    Location.prototype.name = 'location';

    Location.prototype.dependencies = ['nav'];

    Location.prototype.onStart = function() {
      this.vent.one("state:onBeforeStart", this.stop.bind(this));
      return this.render();
    };

    Location.prototype.render = function() {
      this.$el = $('<div class="location"><h1> Set your location</h1></div>');
      this.$input = $('<input type="text" placeholder="Change location..." value="' + App.location + '" />');
      this.$submit = $('<button>Submit</button>');
      this.$input.on('keypress input', this.updateValue.bind(this));
      this.$submit.click(this.submitValue.bind(this));
      this.$el.append(this.$input.add(this.$submit)).appendTo('body');
      return this.$input.focus();
    };

    Location.prototype.updateValue = function(e) {
      if (e.keyCode === 13) {
        return this.submitValue();
      }
    };

    Location.prototype.submitValue = function() {
      var location;
      location = $.trim(this.$input.val());
      if (location === '' || App.location === location) {
        return;
      }
      App.location = location;
      return this.vent.trigger('location:change');
    };

    Location.prototype.onBeforeStop = function() {
      this.$input.off();
      return this.$submit.off();
    };

    Location.prototype.onStop = function() {
      return this.$el.remove();
    };

    return Location;

  })(App.Module);

  App.Components.Map = (function(_super) {
    __extends(Map, _super);

    function Map() {
      _ref3 = Map.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Map.prototype.type = 'component';

    Map.prototype.name = 'map';

    Map.prototype.onStart = function() {
      this.render();
      return this.vent.on('component:map:search', this.searchPlacesByLocation.bind(this));
    };

    Map.prototype.render = function() {
      var mapOptions;
      this.$el = $('<div class="map"></div>').appendTo('body');
      this.geocoder = new google.maps.Geocoder();
      mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 14
      };
      this.infoWindow = new google.maps.InfoWindow();
      return this.map = new google.maps.Map(this.$el[0], mapOptions);
    };

    Map.prototype.getLocation = function(location) {
      var lookup;
      lookup = $.Deferred();
      this.geocoder.geocode({
        'address': location
      }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          return lookup.resolve(results[0].geometry.location);
        } else {
          return lookup.reject(status);
        }
      });
      return lookup;
    };

    Map.prototype.searchPlacesByLocation = function(e, location, types) {
      var _this = this;
      this.clearMarkers();
      this.markers = [];
      return this.getLocation(location).done(function(latLng) {
        return _this.nearbySearch(types, latLng);
      });
    };

    Map.prototype.nearbySearch = function(types, latLng) {
      var request, service,
        _this = this;
      request = {
        location: latLng,
        radius: 1000,
        types: types instanceof Array ? types : [types]
      };
      service = new google.maps.places.PlacesService(this.map);
      return service.nearbySearch(request, function(results, status) {
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
      var marker, _i, _len, _ref4, _results;
      if (this.markers) {
        _ref4 = this.markers;
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          marker = _ref4[_i];
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

    Map.prototype.onStop = function() {
      this.$el.remove();
      this.vent.off('component:map:search');
      this.$el = null;
      this.map = null;
      return this.geocoder = null;
    };

    return Map;

  })(App.Module);

  App.Components.Nav = (function(_super) {
    __extends(Nav, _super);

    function Nav() {
      _ref4 = Nav.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    Nav.prototype.type = 'component';

    Nav.prototype.name = 'nav';

    Nav.prototype.onStart = function(e, origin) {
      this.render();
      this.updateNav.apply(this, arguments);
      this.vent.on('location:change.nav', this.updateTitle.bind(this));
      return this.vent.on('state:onStart.nav', this.updateNav.bind(this));
    };

    Nav.prototype.render = function() {
      this.$el = $('<nav></nav>');
      this.$title = $("<span>" + App.location + "</span>").appendTo(this.$el);
      this.$links = $('<a href="#bars">Bars</a> <a href="#cafes">Cafes</a><a href="#location">Location</a>').appendTo(this.$el);
      return this.$el.prependTo('body');
    };

    Nav.prototype.updateNav = function(e, state) {
      console.log(arguments);
      return this.$links.removeClass('active').filter(function() {
        return $(this).attr('href') === '#' + state.name;
      }).addClass('active');
    };

    Nav.prototype.updateTitle = function() {
      return this.$title.text(App.location);
    };

    Nav.prototype.onBeforeStop = function() {
      return this.vent.off('title:change.nav hashchange.nav');
    };

    Nav.prototype.onStop = function() {
      return this.$el.remove();
    };

    return Nav;

  })(App.Module);

}).call(this);
