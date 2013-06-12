(function() {
  App.Router = (function() {
    Router.prototype.initialState = 'bars';

    function Router(vent) {
      this.vent = vent;
      this.$window = $(window);
    }

    Router.prototype.start = function() {
      var _this = this;
      this.vent.on('location:change', function() {
        return window.location.hash = _this.initialState;
      });
      this.$window.on('hashchange', this._trigger.bind(this));
      if (window.location.hash) {
        return this.$window.trigger('hashchange');
      } else {
        return window.location.hash = this.initialState;
      }
    };

    Router.prototype._trigger = function() {
      return this.vent.trigger("state:" + (window.location.hash.slice(1)) + ":start");
    };

    return Router;

  })();

}).call(this);
