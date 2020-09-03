/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global _: false */
if (!window.Booze) {
	window.Booze = {};
}
window.Booze.Eventing = (function (eventing) {
	"use strict";
    
    function always(val) {
		return function () {
			return val;
		};
	}

	function mapper(src, tgt, method) {
		if (src[method] && _.isFunction(src[method])) {
			tgt[method] = function () {
				return src[method].apply(src, arguments);
			};
		}
	}

	function isfunc(fn) {
		return _.isFunction(fn);
	}

	function isElement(el) {
		return _.isElement(el) || el === window;
	}

	function sortArgs(fn, el, context) {
		var f = isfunc(fn, context) ? fn : el,
			element = isElement(el) ? el : fn;
		return {
			func: f,
			element: element
		};
	}
    
	var count = 0,
        methods = ['flush', 'get', 'getEventTarget', 'listEvents', 'prevent', 'preventOnly', 'remove', 'stop', 'triggerEvent'],
        EventCache = window.Booze.EventCache;
		
	if (window.addEventListener) {
		eventing.init = function (type, el, fn, context) {
        //console.log(arguments)
            //var inta = new Booze.Intaface('Element', ['setAttribute']);
			//Booze.Intaface.ensures(config.element, inta);
			var config = sortArgs(fn, el, context),
				bound;
			this.addListener = function (el) {
				bound = el ? _.bind(config.func, el) : config.func;
				config.element.addEventListener(type, bound, false);
				EventCache.add(this);
				return this;
			};
			this.removeListener = function () {
				config.element.removeEventListener(type, bound, false);
				return this;
			};
			this.getElement = always(config.element);
            this.getAction = always(bound);
            this.el = config.element + '_' + EventCache.listEvents().length + '_' + (count += 1) + '__' + config.element.id;
			_.each(methods, _.partial(mapper, EventCache, this));
			return _.extendOwn({}, this);
		};
	} else if (document.attachEvent) { // IE
		//window.onload = function (){alert(9);}
		eventing.init = function (type, el, fn, context) {
			var config = sortArgs(fn, el, context),
				bound;
			this.addListener = function (el) {
				bound = el ? _.bind(config.func, el) : config.func;
				EventCache.add(this);
				config.element.attachEvent('on' + type, bound);
				return this;
			};
			this.removeListener = function () {
				el.detachEvent('on' + type, fn);
				return this;
			};
			this.getElement = always(config.element);
            this.getAction = always(bound);
            this.el = config.element + '_' + (count += 1);
			_.each(methods, _.partial(mapper, EventCache, this));
			return _.extendOwn({}, this);
		};
	} else { // older browsers
		eventing.init = function (type, el, fn, context) {
			var config = sortArgs(fn, el, context),
				bound;
			this.addListener = function (el) {
				bound = el ? _.bind(config.func, el) : config.func;
				EventCache.add(this);
				el['on' + type] = bound;
				return this;
			};
			this.removeListener = function () {
				el['on' + type] = null;
				return this;
			};
			this.getElement = always(config.element);
            this.getAction = always(bound);
			this.el = config.element + '_' + (count += 1);
			_.each(methods, _.partial(mapper, EventCache, this));
			return _.extendOwn({}, this);
		};
	}
	return eventing;
}({}));