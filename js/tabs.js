/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global _: false */

(function() {
	"use strict";

	function setter(v, o, p) {
		if (o && o[p]) {
			o[p] = v;
		} else if (v && v[p]) {
			v[p] = o;
		}
	}


	var utils = speakEasy.Util,
		klasAdd = utils.addClass,
		curryFactory = utils.curryFactory,
		comp = _.compose,
		ptL = _.partial,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		always = utils.always,
		drill = utils.drillDown,
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		deferEach = twice(doCallbacks)('each'),
		doGet = twice(utils.getter),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
        
		validate = thrice(utils.doMethod)('match')(/h3/i),
		node_from_target = comp(validate, drill([mytarget, 'nodeName'])),
		text_from_target = comp(validate, drill([mytarget, 'innerHTML'])),
		matchReg = thrice(utils.doMethod)('match'),
		toLower = thrice(utils.doMethod)('toLowerCase')(null),
		csstabs = utils.findByClass('csstabs'),
		cor = {
			handle: function() {}
		},
		clear = ptL(setter, 'csstabs', csstabs, 'className'),
		csstablist = _.negate(thrice(utils.lazyVal)('contains')(utils.getClassList(csstabs))),
		addKlasWhen = comp(deferEach, thrice(utils.lazyVal)('concat')([clear]), twicedefer(klasAdd)(csstabs)),
		onMissing = ptL(comp, ptL(utils.invokeWhen, csstablist, _.identity), toLower, doGet('input')),
		recipe = utils.COR(comp(onMissing, matchReg(/^R/i)), addKlasWhen),
		method = utils.COR(comp(onMissing, matchReg(/^M/i)), addKlasWhen),
		serve = utils.COR(comp(onMissing, matchReg(/^S/i)), addKlasWhen),
        getBest = ptL(utils.getBest, node_from_target, [comp(recipe.handle.bind(recipe), toLower, drill([mytarget, 'innerHTML'])), cor.handle]);
	recipe.setSuccessor(method);
	method.setSuccessor(serve);
	utils.eventer('click', event_actions.slice(0), comp(invokey, getBest), utils.findByClass('csstabs')).execute();
}());