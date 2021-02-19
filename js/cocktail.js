(function(){

  "use strict";


	function makeDummy() {
		return {
			render: function () {},
			unrender: function () {}
		};
	}

	function invokeMethod(o) {
		return function (m) {
			return o[m] && o[m].apply(null, _.rest(arguments));
		};
	}

	function doPartial(flag, f) {
		var F = _.partial(flag, f);
		if (flag && _.isBoolean(flag)) {
			F = function (elem) {
				return _.partial(f, elem);
			};
		}
		return F;
	}

	function doubleGet(o, sub, v, p) {
		return o[sub][p](v);
	}

	function greater(a, b) {
		return a > b;
	}

  function setter(v, o, p){
    o[p] = v;
  }

	function greaterBridge(o, p1, p2) {
		return greater(o[p1], o[p2]);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function equals(a, b) {
		return a === b;
	}

	function add(a, b) {
		return a + b;
	}

	function modulo(n, i) {
		return i % n;
	}

	function increment(i) {
		return i + 1;
	}

	function equalNum(tgt, cur) {
		return cur === tgt || parseFloat(cur) === parseFloat(tgt);
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function invokeCB(arg, cb) {
		arg = _.isArray(arg) ? arg : [arg];
		return cb.apply(null, arg);
	}

	function invokeBridge(arr) {
		return invoke(arr[0], arr[1]);
	}

	function invokeArgs(f) {
		var args = _.rest(arguments);
		return f.apply(null, _.map(args, getResult));
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function doCallbacks(cb, coll, p) {
		return _[p](coll, cb);
	}

	function spread(f, j, group) {
		if (!group || !group[j]) {
			return [
				[],
				[]
			];
		}
		//allow for partial
		if (j) {
			return f(group[0], group[j]);
		}
		//or curry
		return f(group[1])(group[0]);
	}


var instr = {

margarita: [["Shake well with cracked ice, then strain into a chilled cocktail glass that has had its rim rubbed with lime juice and dipped in coarse salt.", "A note on the <a href='http://www.esquire.com/features/tequila-drinks'>tequila</a>: It should be 100 percent agave, the plant from which the stuff is traditionally made. Save the great golden <em>añejos</em> for sipping.", "A note on the Cointreau: It yields results clearly superior to triple sec, most brands of which are marred by an unpleasant chemical aftertaste."],["<a href='.'>Margarita</a>", "2 oz tequila -- silver tequila", "1 oz Cointreau","1 oz lime juice", "<b>Cocktail Glass</b>"]],
martini: [["Fill a metal shaker with cracked ice.", "Pour in the dry vermouth (we prefer Noilly Prat), stir briefly, and strain out (this may be discarded).", "Add 4 ounces gin (we prefer Tanqueray, Bombay Sapphire, Beefeater) -- you want it around 94-proof.","Stir briskly for about 10 seconds, strain into chilled cocktail glass, and garnish with an olive."],["<a href='.'>Martini</a>", "4 oz gin", "1 Dry Vermouth", "<b>Cocktail Glass</b>"]],
sidecar: [["Shake well with cracked ice, then strain into a chilled cocktail glass that has had its outside rim rubbed with lemon juice and dipped in sugar"] ,["<a href='.'>Sidecar</a>", "1 1/2 ounces cognac", "3/4 ounce Cointreau", "3/4 ounce lemon juice",  "<b>Cocktail Glass</b>"]],
maitai: [['Stir the rum, lime juice, curaçao, orgeat syrup (an almond syrup sometimes inflicted on coffee; for all we know, you can pick some up at your local Starbucks), and "rock candy syrup" (no more than sugar syrup -- look that up in your <i>Joy of Cooking</i> -- made with a couple drops of vanilla extract) with cracked ice in a chilled cocktail shaker.', 'Shake well and pour unstrained into a large Collins glass (or, of course, tiki mug). If making two or more, you might want to strain the mixture into the glasses, <i>then</i> pour in the ice (to ensure even distribution). Garnish with half a lime shell and sprig of mint.'], ['<a href="../c6/">Mai Tai</a>','2 oz rum -- dark rum<','1 ounce lime juice,.','1/2 oz orange curacao','1.2 oz orgeat syrup','1/8 oz simple syrup','<b>Large collins glass</b>']]
},
lookup = {
  c1: 'martini',
  c2: 'sidecar',
  c3: 'margarita',
  c4: 'maitai',
  c5: 'mintjulep',
  c6: 'sidecar'
}

var utils = speakEasy.Util,
  con = window.console.log.bind(window),
  con2 = function(arg){
    con(arg);
    return arg;
  },
  ptL = _.partial,
  doComp = _.compose,
  Looper = speakEasy.LoopIterator,
  curryFactory = utils.curryFactory,
  event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
  eventing = utils.eventer,
  once = utils.doOnce(),
  defer_once = curryFactory(1, true),
  twice = curryFactory(2),
  twicedefer = curryFactory(2, true),
  thrice = curryFactory(3),
  thricedefer = curryFactory(3, true),
  anCr = utils.append(),
  anCrWait = utils.append(true),
  anCrIn = utils.insert(),
  klasAdd = utils.addClass,
  klasRem = utils.removeClass,
  doAltRecipe = utils.doAlternate(),
  doGet = twice(utils.getter),
  mytarget = !window.addEventListener ? 'srcElement' : 'target',
  getTAB = utils.drillDown(['parentNode', 'parentNode']),
  getTarget = utils.drillDown([mytarget]),
  id_from_target = doComp(doGet('id'), utils.drillDown(['parentNode'])),
  isTab1 = ptL(utils.invokeWhen, doComp(ptL(utils.isEqual, 'tab1'), id_from_target), doComp(utils.hide, getTAB)),
  isTab2 = ptL(utils.invokeWhen, doComp(ptL(utils.isEqual, 'tab2'), id_from_target), doComp(utils.show, getTAB)),
  isRecipe = ptL(utils.getBest, [ptL(utils.findByClass, 'show')], [isTab1, isTab2]),
  $ = thrice(lazyVal)('getElementById')(document),
  $$ = thricedefer(lazyVal)('getElementById')(document),
  doMap = utils.doMap,
  getRecipe = thrice(doMethod)('match')(/.+recipe\.html$/),

  doMapBridge = function (el, v, k) {
    return doMap(el, [
      [k, v]
    ]);
  },
  doRender = thrice(doMethod)('render')(null),
  doGetEl = thrice(doMethod)('getEl')(null),
  doText = thrice(setter)('innerHTML'),
  tagFactory = function(tag, ptl, txt){
    ptl(tag)(txt);
  },
  mycontent = doComp(utils.getZero, ptL(utils.getByClass, 'content')),

  toggler = ptL(eventing, 'click', event_actions.slice(0, 1), doComp(invoke, isRecipe, getTarget)),
  $id = thrice(doMapBridge)('id'),
  $csstabs = $id('csstabs'),
  $tab1 = $id('tab1'),
  $tab2 = $id('tab2'),

  $root = anCr(mycontent()),

  $tabcontent = ptL(klasAdd, 'tabcontent'),
  $tabbox = ptL(klasAdd, 'tabbox'),
  $showtime = doComp(ptL(klasAdd, 'showtime'), utils.drillDown(['parentNode']), mycontent),
  $noShowtime = doComp(ptL(klasRem, 'showtime'), utils.drillDown(['parentNode']), mycontent),

  doIt = function(){
    var $node = anCr(doComp(doGetEl, doRender, toggler, ptL(klasAdd, 'csstabs'), $root)('div')),
      $ancr2 = anCr(doComp($tab2, $tabbox, $node)('div')),
      $ancr1 = anCr(doComp($tab1, $tabbox, $node)('div')),
      $ancr3 = anCr(doComp(twice(invoke)('Method'), doText, $ancr2)('h3')),
      $recipe = anCr(doComp(twice(invoke)('Recipe'), doText, $ancr1)('h3')),
    $cb1 = anCr(doComp($tabcontent, $ancr1)('div')),
    $cb2 = anCr(doComp($tabcontent, $ancr2)('ul')),
    page = lookup[utils.getBody().id];
    _.each(instr[page][0], ptL(tagFactory, 'p', doComp(doText, $cb2)));
    _.each(instr[page][1], ptL(tagFactory, 'li', doComp(doText, $cb1)));
    $showtime();
  },

unDoIt = doComp($noShowtime, utils.removeNodeOnComplete, utils.getZero, ptL(utils.getByClass, 'csstabs', document));
eventing('click', event_actions.slice(0,1), doAltRecipe([doIt, unDoIt]), doComp(ptL(utils.byIndex, 0), ptL(utils.getByTag, 'h2', document))).render();

_.each(utils.getByTag('a', $('nav')), ptL(utils.invokeWhen, utils.getNext, doComp(utils.removeNodeOnComplete, utils.getNext)));


}());
