(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
      return this.vent.trigger('component:map:search', [this.vent.get('location'), 'bar']);
    };

    Bars.prototype.onBeforeStop = function() {
      return this.vent.trigger('component:map:clear', this);
    };

    return Bars;

  })(App.Module);

}).call(this);
