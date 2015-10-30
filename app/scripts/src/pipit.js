'use strict';

(function ($, undefined) {
  'use strict';

  // Return false if jQuery is not defined or valid
  if (!$ || typeof jQuery !== 'function') {
    return false;
  }

  // Constants
  var PLUGIN_NAME = 'pipit';
  var DATA_ATTR = 'data-'+PLUGIN_NAME+'-';
  var $WINDOW = $(window);
  var WIDTH = 300;

  // Defining the plugin
  var Pipit = function Pipit(el, options) {
    this.options = {
      _status: false,
      width: WIDTH
    };

    this.event = $({});

    this.initialize(el, options);
  };

  Pipit.prototype.get = function(key) {
    if(!key || typeof key !== 'string') {
      return;
    }
    return this.options[key];
  };

  Pipit.prototype.set = function(key, value) {
    if(!key || typeof key !== 'string') {
      return;
    }
    if(!value === typeof undefined) {
      return;
    }

    this.options[key] = value;
    return this.options[key];
  };

  Pipit.prototype.getAttr = function(key) {
    var $media = this.$media;

    if(!key || typeof key !== 'string') {
      return;
    }

    var attr = $media.attr(DATA_ATTR+key);

    if(typeof attr !== typeof undefined) {
      return attr;
    }

    return this.options[key];
  };

  Pipit.prototype.initialize = function (el, options) {
    var _this = this;
    this.options = $.extend(this.options, options);
    this.$el = $(el);

    this.setEvents();

    this.setPlayer();
    this.renderWrapper();

    this.scrollSpy();

    window.a = this;

    return this;
  };

  Pipit.prototype.inViewport = function(x, y) {

    if(x == null || typeof x == 'undefined') x = 1;
    if(y == null || typeof y == 'undefined') y = 1;

    var win = $WINDOW;
    var $wrapper = this.$wrapper;
    var $el = this.$el;

    var viewport = {
      top : win.scrollTop(),
      left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var height = $wrapper.outerHeight();
    var width = $wrapper.outerWidth();

    if(!width || !height){
      height = $el.outerHeight();
      width = $el.outerWidth();
    }

    if(!width || !height) {
      return false;
    }

    var bounds = $wrapper.offset();
    bounds.right = bounds.left + width;
    bounds.bottom = bounds.top + height;

    var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

    if(!visible){
      return false;
    }

    var deltas = {
      top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),
      bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height),
      left : Math.min(1, ( bounds.right - viewport.left ) / width),
      right : Math.min(1, ( viewport.right - bounds.left ) / width)
    };

    return true;

    // console.log(deltas);
    // return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;
  };

  Pipit.prototype.setEvents = function() {
    var _this = this;
    var event = this.event;

    $WINDOW.on('scroll', function() {
      event.trigger('pipit:scroll');
    });

    event.on('pipit:scroll', this.scrollSpy.bind(this));
  };

  Pipit.prototype.resizeWrapper = function () {
    var $el = this.$el;
    var $wrapper = this.$wrapper;
    var height = $wrapper.height();
    var width = $wrapper.width();

    $wrapper.height(height);
    $wrapper.width(width);

    return this;
  };

  Pipit.prototype.setPlayer = function () {
    this.$el.addClass('pipit-player');
    this.$media = this.$el.find('['+DATA_ATTR+'media]');
    this.$media.addClass('pipit-player__media');
    return this;
  };

  Pipit.prototype.renderWrapper = function () {
    this.$wrapper = $('<div class="pipit-wrapper">');
    this.$wrapper.insertBefore(this.$el);
    return this;
  };

  Pipit.prototype.scrollSpy = function() {
    if(!this.inViewport()) {
      this.pipOn();
    } else {
      this.pipOff();
    }
    return this;
  };

  Pipit.prototype.pipOn = function () {
    var $el = this.$el;
    var $media = this.$media;
    var $wrapper = this.$wrapper;
    var width = this.getAttr('width');
    var elHeight = $media.height();
    var elWidth = $media.width();

    var ratio = elHeight / elWidth;
    var _this = this;

    if(this.get('_status')) {
      return this;
    }

    $wrapper.width(elWidth).height(elHeight);
    $el.width(width).height(Math.ceil(width * ratio));

    $el.addClass('pipit-player--on');

    this.set('_status', true);
    event.trigger('pipit:activated');

    return this;
  };

  Pipit.prototype.pipOff = function () {
    var $el = this.$el;
    var $wrapper = this.$wrapper;
    var _this = this;

    if(!this.get('_status')) {
      return this;
    }

    $el.css('width', '').css('height', '');
    $wrapper.css('width', '').css('height', '');

    $el.removeClass('pipit-player--on');

    this.set('_status', false);
    event.trigger('pipit:deactivated');

    return this;
  };

  var Plugin = function Plugin(options) {
    return this.each(function () {
      var $this = $(this);
      // If this jQuery object has already rendered pipit, return
      if ($this.data(PLUGIN_NAME)) return;

      $this.data(PLUGIN_NAME, new Pipit(this, options));
    });
  };

  $.fn.pipit = Plugin;
  $.fn.pipit.Constructor = Pipit;
})(jQuery);
//# sourceMappingURL=pipit.js.map
