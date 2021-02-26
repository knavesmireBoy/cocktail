/*jslint nomen: true */
/*global window: false */
/*global speakEasy: false */
/*global document: false */
/*global _: false */
(function () {
	"use strict";

	function setter(v, o, p) {
		o[p] = v;
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}
	var instr = {
			margarita: [
				["Shake well with cracked ice, then strain into a chilled cocktail glass that has had its rim rubbed with lime juice and dipped in coarse salt.", "A note on the <a href='http://www.esquire.com/features/tequila-drinks'>tequila</a>: It should be 100 percent agave, the plant from which the stuff is traditionally made. Save the great golden <em>añejos</em> for sipping.", "A note on the Cointreau: It yields results clearly superior to triple sec, most brands of which are marred by an unpleasant chemical aftertaste."],
				["<a href='.'>Margarita</a>", "2 oz tequila -- silver tequila", "1 oz Cointreau", "1 oz lime juice", "<b>Cocktail Glass</b>"]
			],
			martini: [
				["Fill a metal shaker with cracked ice.", "Pour in the dry vermouth (we prefer Noilly Prat), stir briefly, and strain out (this may be discarded).", "Add 4 ounces gin (we prefer Tanqueray, Bombay Sapphire, Beefeater) -- you want it around 94-proof.", "Stir briskly for about 10 seconds, strain into chilled cocktail glass, and garnish with an olive."],
				["<a href='.'>Martini</a>", "4 oz gin", "1 Dry Vermouth", "<b>Cocktail Glass</b>"], ['Por baby purr']
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
			c1: 'martini',
			c2: 'sidecar',
			c3: 'margarita',
			c6: 'mai_tai',
			c4: 'mintjulep',
			c5: 'moscow_mule'
		},
		utils = speakEasy.Util,
		con = window.console.log.bind(window),
        con2 = function(arg){
            con(arg);
            return arg;
        },
		ptL = _.partial,
		doComp = _.compose,
		curryFactory = utils.curryFactory,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		twice = curryFactory(2),
		thrice = curryFactory(3),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		doAltRecipe = utils.doAlternate(),
		doGet = twice(utils.getter),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTAB = utils.drillDown(['parentNode', 'parentNode']),
		getTarget = utils.drillDown([mytarget]),
        
		id_from_target = doComp(doGet('id'), utils.drillDown(['parentNode'])),
		isTab1 = ptL(utils.invokeWhen, doComp(ptL(utils.isEqual, 'tab1'), id_from_target), doComp(ptL(klasRem, 'method'), getTAB)),
		isTab2 = ptL(utils.invokeWhen, doComp(ptL(utils.isEqual, 'tab2'), id_from_target), doComp(ptL(klasAdd, 'method'), getTAB)),
		isRecipe = ptL(utils.getBest, [ptL(utils.findByClass, 'method')], [isTab1, isTab2]),
		$ = thrice(lazyVal)('getElementById')(document),
		doMap = utils.doMap,
		doMapBridge = function (el, v, k) {
			return doMap(el, [
				[k, v]
			]);
		},
		doExec = thrice(doMethod)('execute')(null),
		doGetEl = thrice(doMethod)('getEl')(null),
		doText = thrice(setter)('innerHTML'),
		tagFactory = function (tag, ptl, txt) {
			ptl(tag)(txt);
		},
		mycontent = doComp(utils.getZero, ptL(utils.getByTag, 'article')),
		toggler = ptL(eventing, 'click', event_actions.slice(0, 1), doComp(invoke, isRecipe, getTarget)),
		$id = thrice(doMapBridge)('id'),
		$tab1 = $id('tab1'),
		$tab2 = $id('tab2'),
		$tab3 = $id('tab3'),
		$root = anCr(mycontent()),
		$tabcontent = ptL(klasAdd, 'tabcontent'),
		$tabbox = ptL(klasAdd, 'tabbox'),
		$showtime = doComp(ptL(klasAdd, 'showtime'), utils.drillDown(['parentNode']), mycontent),
		$noShowtime = doComp(ptL(klasRem, 'showtime'), utils.drillDown(['parentNode']), mycontent),
		doIt = function () {
			var $node = anCr(doComp(doGetEl, doExec, toggler, ptL(klasAdd, 'csstabs'), $root)('div')),
				$ancr33 = anCr(doComp($tab3, $tabbox, $node)('div')),
				$ancr2 = anCr(doComp($tab2, $tabbox, $node)('div')),
				$ancr1 = anCr(doComp($tab1, $tabbox, $node)('div')),
                
				/*$ancr3, and $recipe are not used but must run in this sequence*/
                 $serve = anCr(doComp(twice(invoke)('Serving Suggestion'), doText, $ancr33)('h3')),
				$ancr3 = anCr(doComp(twice(invoke)('Method'), doText, $ancr2)('h3')),
				$recipe = anCr(doComp(twice(invoke)('Recipe'), doText, $ancr1)('h3')),
               $cb3 = anCr(doComp($tabcontent, $ancr33)('section')),
				$cb1 = anCr(doComp($tabcontent, $ancr1)('div')),
				$cb2 = anCr(doComp($tabcontent, $ancr2)('ul')),
				page = lookup[utils.getBody().id];
			_.each(instr[page][0], ptL(tagFactory, 'p', doComp(doText, $cb2)));
			_.each(instr[page][1], ptL(tagFactory, 'li', doComp(doText, $cb1)));
			_.each(instr[page][2], ptL(tagFactory, 'p', doComp(doText, $cb3)));
			$showtime();
		},
		unDoIt = doComp($noShowtime, ptL(utils.climbDom, 2), utils.removeNodeOnComplete, utils.getZero, ptL(utils.getByClass, 'csstabs', document));
	eventing('click', event_actions.slice(0, 1), doAltRecipe([doIt, unDoIt]), doComp(ptL(utils.byIndex, 0), ptL(utils.getByTag, 'h2', document))).execute();
	_.each(utils.getByTag('a', $('nav')), ptL(utils.invokeWhen, utils.getNext, doComp(utils.removeNodeOnComplete, utils.getNext)));
}());