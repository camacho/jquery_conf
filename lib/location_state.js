(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.States.Location = (function(_super) {
    __extends(Location, _super);

    function Location() {
      _ref = Location.__super__.constructor.apply(this, arguments);
      return _ref;
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
      this.$input = $('<input type="text" placeholder="Change location..." />');
      this.$input.val(this.vent.get('location'));
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
      if (location === '' || this.vent.get('location') === location) {
        return;
      }
      return this.vent.set('location', location);
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

}).call(this);
