(function() {
  window.App = {
    States: {},
    Components: {},
    initialize: function() {
      var component, state;
      this.Vent = new this.Vent();
      this.Router = new this.Router(this.Vent);
      for (component in this.Components) {
        this.Components[component] = new this.Components[component](this.Vent);
      }
      for (state in this.States) {
        this.States[state] = new this.States[state](this.Vent);
      }
      this.Vent.set('location', 'Portland');
      return this.Router.start();
    }
  };

  $(App.initialize.bind(App));

}).call(this);
