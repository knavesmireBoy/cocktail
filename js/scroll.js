/*jslint nomen: true */
/*global window: false */
/*global Modernizr: false */
/*global speakEasy: false */
/*global document: false */
/*global _: false */
(function() {
	"use strict";

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function getGreater(a, b) {
		return getResult(a) > getResult(b);
	}

	function existy(x) {
		return x != null;
	}

	function cat() {
		var head = _.first(arguments);
		if (existy(head)) {
			return head.concat.apply(head, _.rest(arguments));
		} else {
			return [];
		}
	}

	function invoke(f) {
		return f && f.apply(null, _.rest(arguments));
	}

	function invokeArray(f, args) {
		return f && f.apply(null, args);
	}

	function invokeBridge(arr) {
		if (_.isFunction(arr[0])) {
			return invoke(arr[0], arr[1]);
		}
	}

	function doMethod(o, v, p) {
		o = getResult(o);
		return o && o[p] && o[p](v);
	}

	function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}

	var utils = speakEasy.Util,
		ptL = _.partial,
		doComp = _.compose,
		curryFactory = utils.curryFactory,
		eventing = utils.eventer,
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		toggleElements = ptL(utils.getByTag, 'h3', document),
		handleEl = doComp(ptL(getGreater, ptL(getPageOffset, false)), twice(utils.getScrollThreshold)(1.05)),
		getInner = twice(utils.getter)('innerHTML'),
		getCssTabs = ptL(utils.findByClass, 'csstabs'),
		deferText = twice(_.map)(getInner),
		deferLower = twice(_.map)(thrice(doMethod)('toLowerCase')(null)),
		getLower = doComp(deferLower, deferText, toggleElements),
		add = twice(klasAdd)(getCssTabs),
		rem = twice(klasRem)(getCssTabs),
		best = ptL(utils.getBestPred, handleEl, [add, rem]),
		concat = doComp(thrice(doMethod)('reverse')(null), ptL(cat, [getLower])),
		F = doComp(twice(_.each)(invokeBridge), ptL(invokeArray, _.zip), twice(_.map)(getResult), concat, twicedefer(_.map)(best), toggleElements);
    eventing('scroll', [], _.throttle(F, 100), window).execute();
}());