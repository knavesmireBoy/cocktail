/*jslint nomen: true */
/*global window: false */
/*global Modernizr: false */
/*global speakEasy: false */
/*global document: false */
/*global _: false */
(function(mq, query, callbacks, pass) {
	"use strict";

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function undef(prop) {
		return typeof prop === 'undefined';
	}

	function getter(o, p) {
		o = getResult(o);
		if (o && !undef(o[p])) {
			return o[p];
		}
	}

	function partial(f, arg) {
		return f()(arg);
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function just_invoke(f) {
		return getResult(f);
	}

	function simple_invoke(f) {
		return f.apply(null, _.rest(arguments));
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function invokeMethod(o, p) {
		return o[p] && o[p].apply(o, _.rest(arguments, 2));
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function doCallbacks(coll, p) {
		return _[p](coll, just_invoke);
	}

	function reducer(acc, cur) {
		return acc[cur] ? acc[cur] : acc;
	}

	function searcher(obj, ary) {
		/*noticed an issue with parentNode where on supply of an element, the initial value for reduce is the parent
		but THAT parent would get set on the second iteration to ITS parent so. When array has just one item reduce not really required*/
		if (ary && ary[1]) {
			return ary.reduce(reducer, obj[ary[0]]);
		}
		return ary[0] ? obj[ary[0]] : obj;
	}
	var instr = {
			margarita: [
				["Shake well with cracked ice, then strain into a chilled cocktail glass that has had its rim rubbed with lime juice and dipped in coarse salt.", "A note on the <a href='http://www.esquire.com/features/tequila-drinks'>tequila</a>: It should be 100 percent agave, the plant from which the stuff is traditionally made. Save the great golden <em>añejos</em> for sipping.", "A note on the Cointreau: It yields results clearly superior to triple sec, most brands of which are marred by an unpleasant chemical aftertaste."],
				["<a href='.'>Margarita</a>", "2 oz tequila -- silver tequila", "1 oz Cointreau", "1 oz lime juice", "<b>Cocktail Glass</b>"]
			],
			martini: [
				["Fill a metal shaker with cracked ice.", "Pour in the dry vermouth (we prefer Noilly Prat), stir briefly, and strain out (this may be discarded).", "Add 4 ounces gin (we prefer Tanqueray, Bombay Sapphire, Beefeater) -- you want it around 94-proof.", "Stir briskly for about 10 seconds, strain into chilled cocktail glass, and garnish with an olive."],
				["<a href='.'></a>", "4 oz gin", "1 Dry Vermouth", "<b>Cocktail Glass</b>"],
				['Por baby purr']
			],
			sidecar: [
				["Shake well with cracked ice, then strain into a chilled cocktail glass that has had its outside rim rubbed with lemon juice and dipped in sugar"],
				["<a href='.'>Sidecar</a>", "1 1/2 ounces cognac", "3/4 ounce Cointreau", "3/4 ounce lemon juice", "<b>Cocktail Glass</b>"]
			],
			mai_tai: [
				['Stir the rum, lime juice, curaçao, orgeat syrup (an almond syrup sometimes inflicted on coffee; for all we know, you can pick some up at your local Starbucks), and "rock candy syrup" (no more than sugar syrup -- look that up in your <i>Joy of Cooking</i> -- made with a couple drops of vanilla extract) with cracked ice in a chilled cocktail shaker.', 'Shake well and pour unstrained into a large Collins glass (or, of course, tiki mug). If making two or more, you might want to strain the mixture into the glasses, <i>then</i> pour in the ice (to ensure even distribution). Garnish with half a lime shell and sprig of mint.'],
				['<a href="../c6/">Mai Tai</a>', '2 oz rum -- dark rum<', '1 ounce lime juice,.', '1/2 oz orange curacao', '1.2 oz orgeat syrup', '1/8 oz simple syrup', '<b>Large collins glass</b>']
			],
			mintjulep: [
				["Representing the High Kentucky School of Julepistics)", "Place 5 or 6 leaves of mint in the bottom of a prechilled, dry 12-ounce glass or silver beaker. Add sugar and crush slightly with a muddler. Pack glass with finely cracked ice. Pour a generous 3 ounces of Kentucky bourbon over the ice. Stir briskly until the glass frosts. Add more ice and stir again before serving.  Stick a few sprigs of mint into the ice so that the partaker will get the aroma.", "Still not enough mint flavor? Try this: For each julep, lightly cover about 10 sprigs of mint with superfine sugar, add an ounce of spring water, macerate, let stand for 10-15 minutes, and strain through a fine sieve into the ice-filled glass. Then add whiskey and proceed as above. If you'll stoop to maceration, you might also want to float 1/2 ounce of dark Jamaica rum on top."],
				['<a href="../c4/">Mint Julep</a>', 'Mint', '1 teaspoon sugar', '3 oz whiskey -- bourbon<', '<b>Silver Beaker</b']
			],
			moscow_mule: [
				["Shake ingredients well with cracked ice, then strain into a chilled cocktail glass., ", "Some frost the rim of the glass with sugar, à la the <b>Sidecar</b> This looks great -- looks being the Moscow Mule's strong point -- so why not?", "Some even suggest a dash of orange bitters, if you can get them. Couldn't hurt."],
				['<a href="../c5/">Moscow Mule', '2 oz vodka', '1 oz Cointreau', '1 oz cranberry juice', 'lime juice', '<b>Cocktail Glass</b>']
			]
		},
		lookup = {
			c1: '',
			c2: 'sidecar',
			c3: 'margarita',
			c6: 'mai_tai',
			c4: 'mintjulep',
			c5: 'moscow_mule'
		},
		utils = speakEasy.Util,
		con = window.console.log.bind(window),
		con2 = function(arg) {
			con(arg)
			return arg;
		},
		ptL = _.partial,
		doComp = _.compose,
		curryFactory = utils.curryFactory,
		always = utils.always,
		drill = utils.drillDown,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasTog = utils.toggleClass,
		klasRem = utils.removeClass,
		doAltRecipe = utils.doAlternate(),
		deferEach = twice(doCallbacks)('each'),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		$ = thrice(lazyVal)('getElementById')(document),
		doMap = utils.doMap,
		doMapBridge = function(el, v, k) {
			return doMap(el, [
				[k, v]
			]);
		},
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		getEnvironment = ptL(utils.isDesktop, threshold),
		csstabs = ptL(utils.findByClass, 'csstabs'),
		contains = thrice(utils.lazyVal)('contains')(doComp(utils.getClassList, csstabs)),
		deferTabs = twicedefer(klasTog)(csstabs),
		clear = ptL(utils.lazySet, 'csstabs', csstabs, 'className'),
		splice = ptL(invokeMethod, callbacks, 'splice', 0, 1),
		unshift = ptL(splice, clear),
		manageCallbacks = [unshift, splice],
		manageQuery = [_.negate(contains), always(true)],
		negator = function() {
			/* for mobile toggle regardless, for desktop conditional on current status
			only add/toggle when csstabs !contain class
			mobile env empties callbacks
			*/
			if (!getEnvironment()) {
				clear();
				pass = Number(!pass);
				manageCallbacks[pass]();
				manageQuery.reverse();
				getEnvironment = _.negate(getEnvironment);
			}
		},
		doExec = thrice(doMethod)('execute')(null),
		doGetEl = thrice(doMethod)('getEl')(null),
		doText = thrice(utils.lazySet)('innerHTML'),
		tagFactory = function(tag, ptl, txt) {
			ptl(tag)(txt);
		},
		mycontent = ptL(utils.findByClass, 'content'),
		validate = thrice(utils.doMethod)('match')(/h3/i),
		node_from_target = doComp(validate, drill([mytarget, 'nodeName'])),
		matchReg = thrice(utils.doMethod)('match'),
		toLower = thrice(utils.doMethod)('toLowerCase')(null),
		cor = {
			handle: function() {}
		},
		identity = (function() {
			var dir = {
				/*recipe is default view,
				element.classList.add complains if attempting to add an empty string
				so simply set class to original class, which means element.classList.add won't actually run as it already exists*/
				//recipe: 'csstabs',
				recipe: 'recipe', //adding class recipe after all purely for css transition
				method: 'method',
				"serving suggestion": 'serving'
			}
			return function(str) {
				return str && dir[str];
			};
		}()),
		addKlasWhen = doComp(deferEach, thrice(utils.lazyVal)('concat')(callbacks), doComp(deferTabs, identity)),
        //we need to obtain a function on the fly not capture it in a closure, manageQuery flips between two predicates for desktop/mobile and we obtain the correct one
		deferContains = ptL(partial, twicedefer(getter)(0)(manageQuery)),
		recipe = utils.COR(matchReg(/^R/i), ptL(utils.invokeWhen, deferContains, addKlasWhen)),
		method = utils.COR(matchReg(/^M/i), ptL(utils.invokeWhen, deferContains, addKlasWhen)),
		serve = utils.COR(matchReg(/^S/i), ptL(utils.invokeWhen, deferContains, addKlasWhen)),
		isHead = ptL(utils.getBest, node_from_target, [doComp(recipe.handle.bind(recipe), toLower, drill([mytarget, 'innerHTML'])), cor.handle]),
		eToggler = ptL(eventing, 'click', event_actions.slice(0, 1), doComp(invoke, isHead)),
		$id = thrice(doMapBridge)('id'),
		$root = anCr(mycontent()),
		$tabcontent = ptL(klasAdd, 'tabcontent'),
		$tabbox = ptL(klasAdd, 'tabbox'),
		$showtime = doComp(ptL(klasAdd, 'showtime'), utils.drillDown(['parentNode']), mycontent),
		$noShowtime = doComp(ptL(klasRem, 'showtime'), utils.drillDown(['parentNode']), mycontent),
		execute = function(page) {
			var $node = anCr(doComp(doGetEl, doExec, eToggler, ptL(klasAdd, ['csstabs']), $root)('div')),
				$doTab = doComp($tabbox, $node, always('div')),
				$ancr3 = anCr(doComp($id('tab3'), $doTab)),
				$ancr2 = anCr(doComp($id('tab2'), $doTab)),
				$ancr1 = anCr(doComp($id('tab1'), $doTab));
			anCr(doComp(twice(invoke)('Serving Suggestion'), doText, $ancr3)('h3'));
			anCr(doComp(twice(invoke)('Method'), doText, $ancr2)('h3'));
			anCr(doComp(twice(invoke)('Recipe'), doText, $ancr1)('h3'));
			$ancr3 = anCr(doComp($tabcontent, $ancr3)('section'));
			$ancr2 = anCr(doComp($tabcontent, $ancr2)('div'));
			$ancr1 = anCr(doComp($tabcontent, $ancr1)('ul'));
			_.each(instr[page][1], ptL(tagFactory, 'li', doComp(doText, $ancr1)));
			_.each(instr[page][0], ptL(tagFactory, 'p', doComp(doText, $ancr2)));
			_.each(instr[page][2], ptL(tagFactory, 'p', doComp(doText, $ancr3)));
			$showtime();
		},
		undo = doComp($noShowtime, ptL(utils.climbDom, 2), utils.removeNodeOnComplete, utils.getZero, ptL(utils.getByClass, 'csstabs', document));
	eventing('click', event_actions.slice(0, 1), doAltRecipe([ptL(execute, lookup[utils.getBody().id]), undo]), doComp(ptL(utils.byIndex, 0), ptL(utils.getByTag, 'h2', document))).execute();
	recipe.setSuccessor(method);
	method.setSuccessor(serve);
	_.each(utils.getByTag('a', $('nav')), ptL(utils.invokeWhen, utils.getNext, doComp(utils.removeNodeOnComplete, utils.getNext)));
	callbacks.unshift(clear);
	negator();
	eventing('resize', event_actions.slice(0, 1), _.throttle(negator, 99), window).execute();
}(Modernizr.mq('only all'), '(min-width: 667px)', [], 0));