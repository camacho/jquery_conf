(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

    Module.prototype.stop = function(event, caller) {
      var _ref, _ref1;
      if (!this._isActive) {
        return;
      }
      this.vent.trigger("" + this.type + ":onBeforeStop", this);
      if ((_ref = this.onBeforeStop) != null) {
        _ref.apply(this, arguments);
      }
      this.stopDependencies.apply(this, arguments);
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

    Module.prototype.stopDependencies = function(event, caller) {
      var dependency, _i, _len, _ref, _results;
      _ref = this.dependencies;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dependency = _ref[_i];
        if (__indexOf.call(caller.dependencies, dependency) < 0) {
          _results.push(this.vent.trigger("component:" + dependency + ":stop", caller));
        }
      }
      return _results;
    };

    return Module;

  })();

}).call(this);
