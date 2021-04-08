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
    
    function getHeight(el){
        try {
            return el.offsetHeight;
        }
        catch(e){
            return el.getBoundingClientRect().height;
        }
    }
    
    function resetLists(){
        hidden = [];
        shown = [];
    }
    
	var instr = {
			margarita: [
				["Shake with cracked ice.","Strain into a chilled wine goblet or cocktail glass with kosher salt on the rim.","Garnish with a lime wheel."],
				["<a href='.'>Margarita</a>", "1½ oz tequila", "¾ oz Cointreau", "½ oz lemon juice", "½ oz lime juice", "<b>Cocktail Glass</b>"],
				["A properly concocted Margarita lets the imbiber taste the tequila. Of course, depending on a guest’s experience with tequila, the amount of spirit needed in a drink will vary.", "When mixing a Margarita to be served on the rocks, double the amount of fruit juice. If you’ve inadvertently purchased mescal (which comes with a senselessly murdered worm) and not tequila, do not puree the poor creature — it adds only protein to the drink.", "When salting the rim of a glass, moisten the rim with a lime garnish, then dip the vessel in fine kosher salt, and garnish with a lime wheel. If you start your party before noon, add fruit to your Margaritas. Although we’re partial to strawberries and bananas, just about any fruit would be appropriate.", "Similar drinks include the <a href='../c8'>Daiquiri</a>."]
			],
			dry_martini: [
				['Stir with cracked ice; strain into a chilled cocktail glass.',
                        "Garnish with a lemon twist or olive.", "For a wet Martini mix 1¼ ounces gin and 1¼ ounces dry vermouth, and for a sweet martini try 2¼ ounces gin and ¾ ounce sweet vermouth. A black olive makes it a Buckeye, and if an onion is used it's a Gibson.", 'A Martini with a splash of scotch is “smoky” and one with a spalsh of olive brine is “dirty”.'],
				["<a href='.'>Dry Martini</a>", "4 oz gin", "1 Dry Vermouth", "<b>Cocktail Glass</b>"],
				["Preparing a palatable Martini requires a unique style and masterful technique. First, completely fill the mixing vessel with the freshest, coldest ice available. The container can be glass, silver or stainless steel, but it must hold 16 ounces. Pour ½ oz of dry vermouth into the vessel in a circular motion, so as much vermouth as possible touches the ice. Next, strain the vermouth from the container. Whatever liquid stays on the surface of the ice will be enough for one or two Martinis.", "Add 3 ounces of your favorite gin. With a <strong>barspoon</strong>, stir in a clockwise motion, agitating the ice against the gin. If the ice and gin are moving at the same speed, you are not succeeding. Lastly, strain the liquid into a chilled cocktail glass. Garnish with a lemon twist or a stuffed olive.", "Similar drinks include the Martinez."]
			],
			sidecar: [
				["Shake well with cracked ice.", "Strain into a chilled cocktail glass that has had its outside rim rubbed with lemon juice and dipped in sugar."],
				["<a href='.'>Sidecar</a>", "1½ ounces cognac", "½ ounce Cointreau", "¾ ounce lemon juice", "<b>Cocktail Glass</b>"],
				["Given it’s due diligence the Sidecar can be made well by even the most inexperienced of mixers. The drink’s recipe also lends itself to any other primary spirit. When apple brandy is substituted, the drink becomes the Apple Cart.", "Catching up with the growing wine trade, California has recently begun to produce some very fine brandies, although not aged as long as the very best <strong>COGNACS</strong>, show many distinct qualities that make them perfect for delicious for cocktails like the Sidecar. Such distillers as Carneros Alambic Distillery, Germain Robin and Clear Creek Distillers (Oregon) are producing spectacular spirits that you should sample the next time you're thinking of this classic.", "Similar drinks include the Newton's Special and the Jack Rose."]
			],
			mai_tai: [
				["Shake with cracked ice.","Strain into a chilled wine goblet or Collins glass filled with ice.","Top with ½ oz dark rum.", "Garnish with a paper umbrella or a cherry and a flower blossom."],
				['<a href="../c6/">Mai Tai</a>', '2½ oz rum — dark rum', '¾ oz lime juice', '½ oz orange curacao', 'splash of orgeat syrup', 'splash grenadine or simple syrup', '<b>Large collins glass</b>'],
				["Sip the Mai Tai to toast the Everyman of cocktails, the late Trader Vic. Although it’s impossible to ruin the taste of this drink, you could go wrong with the garnish. An attractive paper umbrella is really all the Mai Tai needs, so resist the temptaion to overdo it with a fruit bowl topping that looks like some over-the-top prop from a cruise ship.", "Because Jamaican rum is heavy-bodied and you are already using either simple syrup or grenadine, there is no need to splurge for Cointreau. Any curacao will work nicely in this drink. If you suspect your guests will expect a layered look, shake the rum, lime juice and curacao first; the strain the drink into its glass before adding a splash of grenadine.", "Similar drinks include the <a>Planter's Punch</a>."]
			],
			mint_julep: [
				["Mix 3 ounces bourbon, 6 sprigs of mint, and 2 to 4 tablespoons simple syrup in a pint glass.", "Add three pieces of ice and muddle for about a minute. Let stand for several minutes. Strain into a glass filled with shaved ice.","Top with soda water and a mint sprig.", "For a mintier version, remove the three pieces of ice, leave the mint, and pour all ingredients into the glass follwed by the ice."],
				['<a href="../c4/">Mint Julep</a>', '3 oz bourbon', '6 sprigs mint', '2 to 4 tbsp simple syrup', '<b>Silver Beaker</b'],
				['The Mint Julep is a simple, relaxing drink to mix, complicated only by tradition. Always remember one overriding dictum for this drink, as set out by Alben Barkley, a Kentucky-born statesmen: “A Mint Julep is not the product of a formula”.', "So-called purists will mix the mint and sugar the night before a gathering, In theory this allows the mint to further release its essence. In reality, it gives the sugar enough time to dominate.", "Some guests will counsel that a Mint Julep should always be served in a pewter cup and with Irish linen, because touching the glass with the bare hand will disturb the frost. Ignore them if you like, confident that with a little bravura and practice, your mixing traditions will rise above such chatter.", "Similar drinks include the Mojito."]
			],
			moscow_mule: [
				["Stir vodka and juice together well in a chilled Collins glass.", "Add fresh cracked ice and a swizzle stick; top with chilled ginger beer.", "Garnish with a lime squeeze."],
				['<a href="../c5/">Moscow Mule', '2 oz vodka', '1 oz lime juice', '4 oz ginger beer', '<b>Collins Glass or Copper Mug</b>'],
				['“There is only one vodka left,”, Peter the Great, former czar of Russia, supposedly wrote to his wife from Paris. “I don’t know what to do.” We should have suggested mixing the vodka on Moscow Mules to make it last longer.', "As easily made for one as for twelve, the Moscow Mule garners interest whether served at a cocktail soiree or an after-game bash. It is also safe in the hands of the novice mixer. Store the drink’s vodka in the freezer and it will chill its soda to make certain that the drink will be cold.", "Ginger ale may be substituted, though be warned: it’ll be palatable, but far from memorable. If you must use this soda, add a few dahses of <strong>Angostura bitters</strong> or an extra squeeze of lime to give it an edge.", "Similar drinks include the Pimm’s Cup."]
			],
        manhattan: [
				["Stir with cracked ice; strain into a chilled coctail glass.", "Garnish with a maraschino cherry."],
				['<a href=".">Manhattan', '2 oz rye or bourbon', '½ oz sweet vermouth', '1 to 2 dashes Angostura bitters', '<b>Cocktail Glass</b>'],
				["The Manhattan’s sound recipe base has provided a starting point for a hundred other drinks.","Typically the Manhattan is served sweet and garnished with a maraschino cherry. When made correctly, the vermouth and bitters ony accent the whiskey’s flavor. A dry Manhattan calls for French vermouth instead of Italian; garnish it with a twist. A perfect Manhattan, however, calls for ¼ ounce each of sweet and dry vermouth. It’s garnished with a twist.","A dash of a cordial like <strong>Cointreau</strong>, <strong>Byrrh</strong> or <strong>Kümmel</strong> will make a Manhattan more complex in taste.", "An Uptown Manhattan is a perfect Manhattan with a splash of lemon juice. The Sidney is a dry Manhattan with a dash of <strong>orange bitters</strong> and a splash of <strong>Chartreuse</strong>.", "Similar drinks include the Rob Roy."]
			],
        daiquiri: [["Shake with cracked ice.","Strain into a chilled cocktail glass.", "Garnish with a lime wheel."],
				["<a href='.'>Daiquiri</a>", "1½ oz light rum", "¾ oz lime juice", "¼ ounce of simple syrup", "<b>Cocktail Glass</b>"],["No doubt the frozen kiwi-banana Daiquiri and the watermelon-strawberry Daiquiri are superlative choices when training for a drunken balcony-to-balcony climb at a Daytona Beach hotel midway through spring break. But the odds are you’re already past that — or somehow resisted such antics in the first place — and can now appreciate an unalduterated Daiquiri.", "Only mildly difficult to prepare, this drink is best served ice-cold. When a dash of <strong>grenadine</strong> is added it’s known as a Bacardi Cocktail. If the lime is too tart, add a dash of maraschino, orgeat, or crème d’ananas. Never opt of Rose’s lime juice; you'll end up with a mutated Gimlet. Always shake or flash blend the ingredients thoroughly with cracked ice.", "Similar drinks include the <a href='../c10'>Floridita</a>."]],
        cosmopolitan: [["Shake with cracked ice.","Strain into chilled cocktail glass.", "Garnish with a lime wheel."],["<a href='.'>Cosmopolitan</a>", "1½ oz vodka", "¾ oz Cointreau", "½ ounce lime juice", "1 splash cranberry juice"],["When faced with a sudden onslaught of univited guests around the cocktail hour, serve Cosmopolitans. A drink like this is easily adapted by home hosts on those occasions when mixing seems like too much stress and strain.", "Avoid situations in which guests recite their take on the Cosmo’s recipe. There are hundreds of variations, but only a few are worth mentioning and even fewer worth drinking.", "With any version of the Cosmopolitan, remember that without the proper of lime, the drink will also be too sweet. Also, avoid mixing syrups or <strong>simple syrup</strong> in this crisp cocktail.", "Citrus-infused vodkas will allow for plenty of experimentation.", "Similar drinks include the Evan, the Edisonian and the Jasmine."]],
        floridita: [["Shake with cracked ice.","Strain into chilled cocktail glass.", "Garnish with a lime wheel."],["<a href='.'>Floridita</a>", "1½ oz light rum", "½ ounce lime juice", "½ ounce sweet vermouth", "1 dash white crème de cacao", "1 dash of grenadine"],["The Floridita offers itself as common ground for even the most disparate of cocktail crowds. Unlike the Manhattan and the Old Fashioned, which provide the perfect backdrop for an event, the Floridita is so unusual that it actually provokes conversation.", "When mixing a Floridita, shake well, and never add too much crème de cacao or grenadine. With so many ingredients, this drink often ends up unbalanced. The key to a well-made Floridita is the layering of tastes it contains. The citrus should hit first and the cacao least. Although brown crème de cacao tastes no different from the cordial’s clear version, steer clear of it unless you want a cocktail that looks like mud.", "Similar drinks include the <a href='../c9'>Cosmopolitan</a> and the Hemingway Daiquiri."]]
		},
		lookup = {
			c1: 'dry_martini',
			c2: 'sidecar',
			c3: 'margarita',
			c6: 'mai_tai',
			c4: 'mint_julep',
			c5: 'moscow_mule',
            c7: 'manhattan',
            c8: 'daiquiri',
            c9: 'cosmopolitan',
            c10: 'floridita'
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
        inShown = doComp(twice(getGreater)(-.01), ptL(_.findIndex, shown)),
        inHidden = doComp(twice(getGreater)(-.01), ptL(_.findIndex, hidden)),
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
		manageQuery = [/*_.negate(contains), */always(true)],
        doReset = ptL(utils.doWhen, ptL(utils.isDesktop, threshold), resetLists),
        forceReset = ptL(utils.doWhen, true, resetLists),
		negator = function() {
            console.log('negat')
			/* for mobile toggle regardless, for desktop conditional on current status
			only add/toggle when csstabs !contain class (recipe/method/serve)
			mobile env empties callbacks
			*/
			if (!getEnvironment()) {
                console.log('negatE')
				clear();
				pass = Number(!pass);
				manageCallbacks[pass]();
				manageQuery.reverse();
				getEnvironment = _.negate(getEnvironment);
                doReset();
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
		handleEl = doComp(ptL(getGreater, ptL(getPageOffset, false)), twice(utils.getScrollThreshold)()),
        deferLower = thrice(doMethod)('toLowerCase')(null),
        getInnerHTML = twice(utils.getter)('innerHTML'),
		doDeferLower = twice(_.map)(deferLower),
        getDisplayClass = doComp(deferLower, getInnerHTML),
		getLower = doComp(doDeferLower, twice(_.map)(getInnerHTML), toggleElements),
        showTab = twice(klasAdd)(getCssTabs),
        hideTab = twice(klasRem)(getCssTabs),
		best = ptL(utils.getBestPred, handleEl, [showTab, hideTab]),
		concat = doComp(thrice(doMethod)('reverse')(null), ptL(cat, [getLower])),
        /* obtain tab collection, concatenate with corresponding innerHTML set to lowercase, both collections available on invoking
        zip the two collections [[func, arg], [func, arg]...] invoke func with arg only run below 668px*/
		scroller = doComp(twice(_.each)(invokeBridge), ptL(invokeArray, _.zip), twice(_.map)(getResult), concat, twicedefer(_.map)(best), toggleElements),
        restore_user_toggle = function(){
            _.each(hidden, function(el){
                hideTab(getDisplayClass(el));
            });
             _.each(shown, function(el){
                showTab(getDisplayClass(el));
            });
        },
        restore_user_toggle_wrap = function(f, e){
            f(e);
            restore_user_toggle();
        },
        scroller_wrap = _.wrap(scroller, restore_user_toggle_wrap),
        eScroller = ptL(utils.invokeWhen, _.negate(ptL(utils.isDesktop, threshold)), scroller_wrap),
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
		$recipe = utils.COR(matchReg(/^R/i), ptL(utils.invokeWhen, deferContains, addKlasWhen)),
		$method = utils.COR(matchReg(/^M/i), ptL(utils.invokeWhen, deferContains, addKlasWhen)),
		$serve = utils.COR(matchReg(/^S/i), ptL(utils.invokeWhen, deferContains, addKlasWhen)),
		isHead = ptL(utils.getBest, node_from_target, [doComp($recipe.handle.bind($recipe), toLower, drill([mytarget, 'innerHTML'])), cor.handle]),
		cb = _.wrap(doComp(invoke, isHead), function(f, e) {
            var el = getCssTabs(),
                hi = getHeight(el),
                pass = false;
			f(e);
            //check if element height is increased/decreased, could also check length of csstabs.classlist
            if(hi < getHeight(el)){
                shown = _.filter(shown, _.negate(ptL(utils.isEqual, e.target)));
                shown.unshift(e.target);
                hidden = _.reject(hidden, ptL(utils.isEqual, e.target));
                pass = true;
            }
            else if(hi > getHeight(el)){
                hidden = _.filter(hidden, _.negate(ptL(utils.isEqual, e.target)));
                hidden.unshift(e.target);
                shown = _.reject(shown, ptL(utils.isEqual, e.target));
                pass = true;
            }
            else {
                //not in mobile environment
                forceReset();
            }
            if(pass){
                restore_user_toggle();  
            }
		}),
		//eToggler = ptL(eventing, 'click', event_actions.slice(0, 1), cb),
		eToggler = ptL(eventing, 'click', [], cb),
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
    
	$recipe.setSuccessor($method);
	$method.setSuccessor($serve);
	_.each(utils.getByTag('a', $('nav')), ptL(utils.invokeWhen, utils.getNext, doComp(utils.removeNodeOnComplete, utils.getNext)));
	callbacks.unshift(clear);
	negator();
	eventing('resize', event_actions.slice(0, 1), _.throttle(negator, 99), window).execute();
	eventing('scroll', event_actions.slice(0), _.throttle(eScroller, 100), window).execute();
}(Modernizr.mq('only all'), '(min-width: 667px)', [], 0, [], []));

/*https://css-tricks.com/snippets/css/fluid-typography/
https://codepen.io/2kool2/pen/PKGrdj
(function () {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') != -1) {
    if (!(ua.indexOf('chrome') > -1)) {
      window.addEventListener("resize", function() {
        window.location.reload(false);
      }, false);
    }
  }
}());
*/