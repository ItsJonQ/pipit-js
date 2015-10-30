(function ($, undefined) { 'use strict';

  // Return false if jQuery is not defined or valid
  if(!$ || typeof jQuery !== 'function') {
      return false;
  }

  // Constants
  var PLUGIN_NAME = 'pipit';
  var $WINDOW = $(window);

  // Defining the plugin
  var Pipit = function(el, options) {
    this.options = {
      width: 300
    };

    this.initialize(el, options);
  };

  Pipit.prototype.initialize = function(el, options) {
    var _this = this;
    this.options = $.extend(this.options, options);
    this.$el = $(el);

    this.setPlayer();
    this.renderWrapper();

    this.pipOn();

    window.a = this;

    return this;
  };

  Pipit.prototype.resizeWrapper = function() {
    var $el = this.$el;
    var $wrapper = this.$wrapper;
    var height = $wrapper.height();
    var width = $wrapper.width();

    $wrapper.height(height);
    $wrapper.width(width);

    return this;
  };

  Pipit.prototype.setPlayer = function() {
    this.$el.addClass('pipit-player');
    this.$media = this.$el.find('[data-pipit-media]');
    this.$media.addClass('pipit-player__media');
    return this;
  };

  Pipit.prototype.renderWrapper = function() {
    this.$wrapper = $('<div class="pipit-wrapper">');
    this.$wrapper.insertBefore(this.$el);
    return this;
  };

  Pipit.prototype.pipOn = function() {
    var $el = this.$el;
    var $media = this.$media;
    var $wrapper = this.$wrapper;
    var width = this.options.width;
    var elHeight = $media.height();
    var elWidth = $media.width();

    var ratio = (elHeight / elWidth);

    $wrapper.width(elWidth);
    $wrapper.height(elHeight);

    $el.width(width);
    $el.height(Math.ceil(width * ratio));

    $el.addClass('pipit-player--on');

    return this;
  };

  Pipit.prototype.pipOff = function() {
    var $el = this.$el;
    var $wrapper = this.$wrapper;

    $el.css('width', '').css('height', '');
    $wrapper.css('width', '').css('height', '');

    $el.removeClass('pipit-player--on');

    return this;
  };

  var Plugin = function(options) {
    return this.each(function() {
      var $this = $(this);
      // If this jQuery object has already rendered pipit, return
      if($this.data(PLUGIN_NAME)) return;

      $this.data(PLUGIN_NAME, new Pipit(this, options));
    });
  };

  $.fn.pipit = Plugin;
  $.fn.pipit.Constructor = Pipit;

}(jQuery));