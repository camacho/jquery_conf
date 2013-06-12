(function() {
  var $document;

  $document = $(document);

  App.Vent = (function() {
    function Vent() {}

    Vent.prototype.on = $document.on.bind($document);

    Vent.prototype.one = $document.one.bind($document);

    Vent.prototype.off = $document.off.bind($document);

    Vent.prototype.trigger = $document.trigger.bind($document);

    Vent.prototype.get = function(name) {
      return this._responses[name];
    };

    Vent.prototype.set = function(name, value) {
      var oldValue;
      oldValue = this._responses[name];
      this._responses[name] = value;
      if (oldValue !== value) {
        return this.trigger("" + name + ":change", [value, oldValue]);
      }
    };

    Vent.prototype._responses = {};

    return Vent;

  })();

}).call(this);
