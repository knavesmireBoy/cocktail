/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Booze: false */
/*global _: false */
if (!window.Booze) {
	window.Booze = {};
}
window.Booze.Listener = function(){};
window.Booze.preventer = (function () {
    "use strict";
	function getEventObject(e) {
		return e || window.event;
	}
    function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
	var modern = {
			prevent: function (e) {
				e.preventDefault();
				e.stopPropagation();
			},
			preventOnly: function (e) {
				e.preventDefault();
			},
			stop: function (e) {
				e.stopPropagation();
			},
			getEventTarget: function (e) {
				return e.target;
			},
        preventWhen: function(conditional, action, extent, e){
            if(getResult(conditional)){
                this[extent](e);
            }
            action(e);
        },
            
			////$element.triggerEvent($element.getElement(), 'scroll');
			triggerEvent: function (el, type) {
				var e = document.createEvent('HTMLEvents');
				e.initEvent(type, false, true);
				el.dispatchEvent(e);
			}
		},
		legacy = {
			prevent: function (e) {
				e = getEventObject(e);
				e.returnValue = false;
				e.cancelBubble = true;
			},
			preventOnly: function (e) {
				e = getEventObject(e);
				e.returnValue = false;
			},
			stop: function (e) {
				e = this.getEventObject(e);
				e.cancelBubble = true;
			},
			getEventTarget: function (e) {
				e = getEventObject(e);
				return e.srcElement;
			},
			triggerEvent: function (el, type) {
				var e = document.createEventObject();
				e.eventType = type;
				el.fireEvent('on' + e.eventType, e);
			}
		};
	return window.addEventListener ? modern : legacy;
}());
window.Booze.EventCache = (function (list, preventer) {
    "use strict";
	function existy(x) {
		return x != null;
	}

	function fail(thing) {
		throw new Error(thing);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function isEqual(a, b) {
		return a === b;
	}

	function doWhen(cond, action) {
		if (getResult(cond)) {
			return action();
		} else {
			return undefined;
		}
	}

	function invoker(name, method) {
		return function (target) {
			if (!existy(target)) {
				fail("Must provide a target");
			}
			var targetMethod = target[name],
				args = _.rest(arguments);
			return doWhen((existy(targetMethod) && method === targetMethod), function () {
				return targetMethod.apply(target, args);
			});
		};
	}

	function find(coll, _equals) {
		var res = _.findIndex(coll, _equals);
		if (res !== -1) {
			//be AWARE -1 can be used by splice...
			return res;
		}
		//return undefined otherwise to prevent deleting by mistake
	}
	var willRemove = invoker('removeListener', window.Booze.Listener.prototype.removeListener),
		safeAdd = function (tgt) {
			if (!existy(tgt)) {
				fail("Must provide a target");
			}
			list = _.filter(list, _.negate(_.partial(isEqual, tgt)));
			list.unshift(tgt);
			return list;
		},
		byIndex = function (i) {
			if (!isNaN(i)) {
				return willRemove(list.splice(i, 1)[0]);
			}
		};
	return {
		listEvents: function () {
			return list;
		},
		add: safeAdd,
		flush: function () {
			var i;
			for (i = list.length - 1; i >= 0; i = i - 1) {
				list[i].removeListener();
			}
			list = [];
		},
		get: function (i) {
			return _.isNumber(i) ? list[i] : _.isBoolean(i) && !i ? list[list.length - 1] : _.isBoolean(i) && i ? list[0] : list;
		},
		remove: function (arg) {
			if (arg && _.isObject(arg)) {
				byIndex(find(list, arg));
			} else if (!isNaN(arg)) {
				_.each(list.splice.apply(list, arguments), willRemove);
			}
		},
		prevent: preventer.prevent,
		preventOnly: preventer.preventOnly,
		stop: preventer.stop,
		getEventTarget: preventer.getEventTarget,
		triggerEvent: preventer.triggerEvent
	};
}([], window.Booze.preventer));

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
        ownmethods = ['addListener', 'getAction', 'getElement', 'removeListener'],
        EventCache = Booze.EventCache;
		
	if (window.addEventListener) {
		eventing.init = function (type, el, fn, context) {
			var config = sortArgs(fn, el, context),
				bound,
                that;

			Booze.Listener.prototype.addListener = function (el) {
				bound = el ? _.bind(config.func, el) : config.func;
				config.element.addEventListener(type, bound, false);
				EventCache.add(this);
				return this;
			};
			Booze.Listener.prototype.removeListener = function () {
				config.element.removeEventListener(type, bound, false);
				return this;
			};
			Booze.Listener.prototype.getElement = always(config.element);
            Booze.Listener.prototype.getAction = always(bound);
            
            that = new Booze.Listener();
            eventing.el = config.element + '_' + EventCache.listEvents().length + '_' + (count += 1) + '__' + config.element.id;
            
            _.each(ownmethods, _.partial(mapper, that, this));
			_.each(methods, _.partial(mapper, EventCache, that));
            return that;
			//return _.extendOwn(t, this);
		};
	} else if (document.attachEvent) { // IE
		//window.onload = function (){alert(9);}
		eventing.init = function (type, el, fn, context) {
			var config = sortArgs(fn, el, context),
				bound,
                that;
			Booze.Listener.prototype.addListener = function (el) {
				bound = el ? _.bind(config.func, el) : config.func;
				EventCache.add(this);
				config.element.attachEvent('on' + type, bound);
				return this;
			};
			Booze.Listener.prototype.removeListener = function () {
				el.detachEvent('on' + type, fn);
				return this;
			};
			Booze.Listener.prototype.getElement = always(config.element);
            Booze.Listener.prototype.getAction = always(bound);
            
            that = new Booze.Listener();
            eventing.el = config.element + '_' + (count += 1);
			_.each(ownmethods, _.partial(mapper, that, this));
			_.each(methods, _.partial(mapper, EventCache, this));
			return _.extendOwn({}, this);
		};
	} else { // older browsers
		eventing.init = function (type, el, fn, context) {
			var config = sortArgs(fn, el, context),
				bound,
                that;
			Booze.Listener.prototype.addListener = function (el) {
				bound = el ? _.bind(config.func, el) : config.func;
				EventCache.add(this);
				el['on' + type] = bound;
				return this;
			};
			Booze.Listener.prototype.removeListener = function () {
				el['on' + type] = null;
				return this;
			};
			Booze.Listener.prototype.getElement = always(config.element);
            Booze.Listener.prototype.getAction = always(bound);
            
            that = new Booze.Listener();
			eventing.el = config.element + '_' + (count += 1);
			_.each(ownmethods, _.partial(mapper, that, this));
			_.each(methods, _.partial(mapper, EventCache, this));
			return _.extendOwn({}, this);
		};
	}
	return eventing;
}({}));