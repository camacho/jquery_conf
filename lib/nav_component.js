(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Components.Nav = (function(_super) {
    __extends(Nav, _super);

    function Nav() {
      _ref = Nav.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Nav.prototype.type = 'component';

    Nav.prototype.name = 'nav';

    Nav.prototype.onStart = function(e, origin) {
      this.render(origin);
      this.vent.on('location:change.nav', this.updateTitle.bind(this));
      return this.vent.on('state:onStart.nav', this.updateNav.bind(this));
    };

    Nav.prototype.render = function(state) {
      this.$el = $('<nav></nav>');
      this.$title = $("<a href=\"#location\" class=\"title\">" + (this.vent.get('location')) + "</a>").appendTo(this.$el);
      this.$links = $('<a href="#bars">Bars</a><a href="#cafes">Cafes</a><a href="#location">Location</a>').appendTo(this.$el);
      this.updateNav(null, state);
      return this.$el.prependTo('body');
    };

    Nav.prototype.updateNav = function(e, state) {
      return this.$links.removeClass('active').filter(function() {
        return $(this).attr('href') === '#' + state.name;
      }).addClass('active');
    };

    Nav.prototype.updateTitle = function(e, title) {
      return this.$title.text(title);
    };

    Nav.prototype.onBeforeStop = function() {
      return this.vent.off('title:change.nav state:onStart.nav');
    };

    Nav.prototype.onStop = function() {
      return this.$el.remove();
    };

    return Nav;

  })(App.Module);

}).call(this);
