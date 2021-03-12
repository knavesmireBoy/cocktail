/*jslint nomen: true */
/*global window: false */
/*global Modernizr: false */
/*global speakEasy: false */
/*global document: false */
/*global _: false */
(function(mq, query, callbacks, pass, shown, hidden) {
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

	function simple_invoke(f) {
		return f.apply(null, _.rest(arguments));
	}

	function invokeArray(f, args) {
		return f && f.apply(null, args);
	}

	function invokeBridge(arr) {
		if (_.isFunction(arr[0])) {
			return simple_invoke(arr[0], arr[1]);
		}
	}

	function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}

	function just_invoke(f) {
		return getResult(f);
	}

	function doMethod(o, v, p) {
		o = getResult(o);
		return o && o[p] && o[p](v);
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
    
    function getHeight(el){
        try {
            return el.offsetHeight;
        }
        catch(e){
            return el.getBoundingClientRect().height;
        }
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
				["Shake with cracked ice;  strain into a chilled wine goblet or cocktail glass with kosher salt on the rim; Garnish with a lime wheel"],
				["<a href='.'>Margarita</a>", "2 oz tequila -- silver tequila", "1 oz Cointreau", "1 oz lime juice", "<b>Cocktail Glass</b>"],
				["A properly concocted Margarita lets the imbiber taste the tequila. Of course, depending on a guest's experience with tequila, the amount of spirit needed in a drink will vary.", "When mixing a Margarita to be served on the rocks, double the amount of fruit juice. If you've inadvertently purchased mescal (which comes with a senselessly murdered worm) and not tequila, do not puree the poor creature - it adds only protein to the drink.", "When salting the rim of a glass, moisten the rim with a lime garnish, then dip the vessel in fine kosher salt, and garnish with a lime wheel. If you start your party before noon, add fruit to your Margaritas. Although we're partial to strawberries and bananas, just about any fruit would be appropriate.", "Similar drinks include the Daiquiri."]
			],
			dry_martini: [
				["Fill a metal shaker with cracked ice.", "Pour in the dry vermouth (we prefer Noilly Prat), stir briefly, and strain out (this may be discarded).", "Add 4 ounces gin (we prefer Tanqueray, Bombay Sapphire, Beefeater) -- you want it around 94-proof.", "Stir briskly for about 10 seconds, strain into chilled cocktail glass, and garnish with an olive."],
				["<a href='.'>Dry Martini</a>", "4 oz gin", "1 Dry Vermouth", "<b>Cocktail Glass</b>"],
				["Preparing a palatable Martini requires a unique style and masterful technique. First, completely fill the mixing vessel with the freshest, coldest ice available. The container can be glass, silver or stainless steel, but it must hold 16 ounces. Pour ½ oz of dry vermouth into the vessel in a circular motion, so as much vermouth as possible touches the ice. Next, strain the vermouth from the container. Whatever liquid stays on the surface of the ice will be enough for one or two Martinis.", "Add 3 ounces of your favorite gin. With a <strong>barspoon</strong>, stir in a clockwise motion, agitating the ice against the gin. If the ice and gin are moving at the same speed, you are not succeeding. Lastly, strain the liquid into a chilled cocktail glass. Garnish with a lemon twist or a stuffed olive.", "Similar drinks include the Martinez."]
			],
			sidecar: [
				["Shake well with cracked ice, then strain into a chilled cocktail glass that has had its outside rim rubbed with lemon juice and dipped in sugar"],
				["<a href='.'>Sidecar</a>", "1½ ounces cognac", "½ ounce Cointreau", "¾ ounce lemon juice", "<b>Cocktail Glass</b>"],
				["Given it's due diligence the Sidecar can be made well by even the most inexperienced of mixers. The drink's recipe also lends itself to any other primary spirit. When apple brandy is substituted, the drink becomes the Apple Cart.", "Catching up with the growing wine trade, California has recently begun to produce some very fine brandies, although not aged as long as the very best <strong>COGNACS</strong>, show many distinct qualities that make them perfect for delicious for cocktails like the Sidecar. Such distillers as Carneros Alambic Distillery, Germain Robin and Clear Creek Distillers (Oregon) are producing spectacular spirits that you should sample the next time you're thinking of this classic.", "Similar drinks include the Newton's Special and the Jack Rose."]
			],
			mai_tai: [
				["Shake with cracked ice; strain into a chilled wine goblet or Collins glass filled with ice. Top with ½ oz dark rum. Garnish with a paper umbrella or a cherry and a flower blossom."],
				['<a href="../c6/">Mai Tai</a>', '2½ rum -- dark rum', '¾oz lime juice,.', '½ oz orange curacao', 'splash of orgeat syrup', '1 splash grenadine or simple syrup', '<b>Large collins glass</b>'],
				["Sip the Mai Tai to toast the Everyman of cocktails, the late Trader Vic. Although it's impossible to ruin the taste of thei drink, you could go wrong with the garnish. An attractive paper umbrella is really all the Mai Tai needs, so resist the temptaion to overdo it with a fruit bowl topping that looks like some over-the-top prop from a cruise ship.", "Because Jamaican rum is heavy-bodied and you are already using either simple syrup or grenadine, there is no need to splurge for Cointreau. Any curacao will work nicely in this drink. If you suspect your guests will expect a layered look, shake the rum, lime juice and curacao first; the strain the drink into its glass before adding a splash of grenadine.", "Similar drinks include the <a>Planter's Punch</a>."]
			],
			mint_julep: [
				["Mix 3 ounces bourbon, 6 sprigs of mint, and 2 to 4 tablespoons simple syrup in a pint glass. Add three pieces of ice and muddle for about a minute. Let stand for several minutes. Strain into a glass filled with shaved ice. Top with soda water and a mint sprig.", "For a mintier version, remove the three pieces of ice, leave the mint, and pour all ingredients into the glass follwed by the ice."],
				['<a href="../c4/">Mint Julep</a>', '3 oz bourbon', '6 sprigs mint', '2 to 4 tbsp simple syrup', '<b>Silver Beaker</b'],
				['The Mint Julep is a simple, relaxing drink to mix, complicated only by tradition. Always remember one overriding dictum for this drink, as set out by Alben Barkley, a Kentucky-born statesmen: "A Mint Julep is not the product of a formula".', "So-called purists will mix the mint and sugar the night before a gatering, In theory this allows the mint to further release its essence. In reality, it gives the sugar enough time to dominate.", "Some guests will counsel that a Mint Julep should always be served in a pewter cup and with Irish linen, because touching the glass with the bare hand will disturb the frost. Ignore them if yiu like, confident that with a little bravura and practice, your mixing traditions will rise above such chatter.", "Similar drinks include the Mojito."]
			],
			moscow_mule: [
				["Stir vodka and juice together well in a chilled Collins glass. Add fresh cracked ice and a swizzle stick; top with chilled ginger beer.", "Garnish with a lime squeeze"],
				['<a href="../c5/">Moscow Mule', '2 oz vodka', '1 oz lime juice', '4 oz ginger beer', '<b>Copper Mug or Collins Glass</b>'],
				['"There is only one vodka left,", Peter the Great, former czar of Russia, supposedly wrote to his wife from Paris. "I don\'t know what to do." We should have suggested mixing the vodka on Moscow Mules to make it last longer.', "As easily made for one as for twelve, the Moscow Mule garners interest whether served at a cocktail soiree or an after-game bash. It is also safe in the hands of the novice mixer. Store the drink's vodka in the freezer and it will chill its soda to make certain that the drink will be cold.", "Ginger ale may be substituted, though be warned: it'll be palatable, but far from memorable. If you must use this soda, add a few dahses of <strong>Angostura bitters</strong> or an extra squeeze of lime to give it an edge.", "Similar drinks include the Pimm's Cup."]
			]
		},
		lookup = {
			c1: 'dry_martini',
			c2: 'sidecar',
			c3: 'margarita',
			c6: 'mai_tai',
			c4: 'mint_julep',
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
		page_id = doComp(twice(getter)('className'), utils.getBody)(),
		$ = thrice(lazyVal)('getElementById')(document),
		doMap = utils.doMap,
		doMapBridge = function(el, v, k) {
			return doMap(el, [
				[k, v]
			]);
		},
        //findIndex = ptL(invoke, _.findIndex, shown, ptL(utils.isEqual)),
        inShown = doComp(twice(getGreater)(-.01), ptL(_.findIndex, shown)),
        inHidden = doComp(twice(getGreater)(-.01), ptL(_.findIndex, hidden)),
        klasAddVal = ptL(utils.addClassVal),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		getEnvironment = ptL(utils.isDesktop, threshold),
		getCssTabs = ptL(utils.findByClass, 'csstabs'),
		contains = thrice(utils.lazyVal)('contains')(doComp(utils.getClassList, getCssTabs)),
		deferTabs = twicedefer(klasTog)(getCssTabs),
		clear = ptL(utils.lazySet, 'csstabs', getCssTabs, 'className'),
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
		toggleElements = ptL(utils.getByTag, 'h3', document),
		handleEl = doComp(ptL(getGreater, ptL(getPageOffset, false)), twice(utils.getScrollThreshold)(1.05)),
		deferLower = twice(_.map)(thrice(doMethod)('toLowerCase')(null)),
		getLower = doComp(deferLower, twice(_.map)(twice(utils.getter)('innerHTML')), toggleElements),
		best = ptL(utils.getBestPred, handleEl, [twice(klasAdd)(getCssTabs), twice(klasRem)(getCssTabs)]),
		concat = doComp(thrice(doMethod)('reverse')(null), ptL(cat, [getLower])),
		eScroller = doComp(twice(_.each)(invokeBridge), ptL(invokeArray, _.zip), twice(_.map)(getResult), concat, twicedefer(_.map)(best), toggleElements),
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
		cb = _.wrap(doComp(invoke, isHead), function(f, e) {
            
            var el = getCssTabs(),
                hi = getHeight(el);
			f(e);
            if(hi < getHeight(el)){
                shown = _.filter(shown, function(el){
                    return el !== e.target;
                });
                shown.unshift(e.target);
            }
            else {
                hidden = _.filter(shown, function(el){
                    return el !== e.target;
                });
                hidden.unshift(e.target);
            }
		}),
		eToggler = ptL(eventing, 'click', event_actions.slice(0, 1), cb),
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
	eventing('click', event_actions.slice(0, 1), doAltRecipe([ptL(execute, lookup[page_id]), undo]), doComp(ptL(utils.byIndex, 0), ptL(utils.getByTag, 'h2', document))).execute();
	recipe.setSuccessor(method);
	method.setSuccessor(serve);
	_.each(utils.getByTag('a', $('nav')), ptL(utils.invokeWhen, utils.getNext, doComp(utils.removeNodeOnComplete, utils.getNext)));
	callbacks.unshift(clear);
	negator();
	eventing('resize', event_actions.slice(0, 1), _.throttle(negator, 99), window).execute();
	eventing('scroll', event_actions.slice(0), _.throttle(eScroller, 100), window).execute();
    con(inShown('john'))
}(Modernizr.mq('only all'), '(min-width: 667px)', [], 0, ['john'], []));