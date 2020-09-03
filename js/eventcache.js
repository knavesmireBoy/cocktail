/*jslint nomen: true */
/*global window: false */
/*global document: false */
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