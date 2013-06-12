(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.States.Cafes = (function(_super) {
    __extends(Cafes, _super);

    function Cafes() {
      _ref = Cafes.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Cafes.prototype.type = 'state';

    Cafes.prototype.name = 'cafes';

    Cafes.prototype.dependencies = ['nav', 'map'];

    Cafes.prototype.onStart = function() {
      this.vent.one("state:onBeforeStart", this.stop.bind(this));
      return this.vent.trigger('component:map:search', [this.vent.get('location'), 'cafe']);
    };

    Cafes.prototype.onBeforeStop = function() {
      return this.vent.trigger('component:map:clear', this);
    };

    return Cafes;

  })(App.Module);

}).call(this);
