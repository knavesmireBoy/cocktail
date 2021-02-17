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


var margarita = [["Shake well with cracked ice, then strain into a chilled cocktail glass that has had its rim rubbed with lime juice and dipped in coarse salt.", "A note on the <a href='http://www.esquire.com/features/tequila-drinks'>tequila</a>: It should be 100 percent agave, the plant from which the stuff is traditionally made. Save the great golden <em>añejos</em> for sipping.", "A note on the Cointreau: It yields results clearly superior to triple sec, most brands of which are marred by an unpleasant chemical aftertaste."],["<a href='.'>Margarita</a>", "2 oz tequila -- silver tequila", "1 oz Cointreau","1 oz lime juice", "<b>Cocktail Glass</b>"]],
recipes = [margarita];
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
  getDaddy = utils.drillDown(['parentNode']),
  getBFG = utils.drillDown(['parentNode', 'parentNode']),
  getTarget = utils.drillDown([mytarget]),
  id_from_target = doComp(doGet('id'), getDaddy),
  isTab1 = doComp(utils.hide, getBFG),
  isTab2 = doComp(doComp(ptL(utils.toggleClass, 'show'), getBFG)),
isTabbed1 = ptL(utils.invokeWhen, doComp(ptL(utils.isEqual, 'tab1'), id_from_target), isTab1),
isTabbed2 = ptL(utils.invokeWhen, doComp(ptL(utils.isEqual, 'tab2'), id_from_target), isTab2),


  isToggled = ptL(utils.getBest, [ptL(utils.findByClass, 'show')], [isTabbed1, isTabbed2]),
  doTog =  doComp(invoke, isToggled, getTarget),

  $ = thrice(lazyVal)('getElementById')(document),
  $$ = thricedefer(lazyVal)('getElementById')(document),
  doMap = utils.doMap,
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

  toggler = ptL(eventing, 'click', event_actions.slice(0, 1), doTog),
  $id = thrice(doMapBridge)('id'),
  $csstabs = $id('csstabs'),
  $tab1 = $id('tab1'),
  $tab2 = $id('tab2'),
  $root = anCr($('content')),

  $tabcontent = ptL(klasAdd, 'tabcontent'),
  $tabbox = ptL(klasAdd, 'tabbox'),

  doIt = function(){
    var $node = anCr(doComp(doGetEl, doRender, toggler, ptL(klasAdd, 'csstabs'), $root)('div')),
      $ancr2 = anCr(doComp($tab2, $tabbox, $node)('div')),
      $ancr1 = anCr(doComp($tab1, $tabbox, $node)('div')),
      $ancr3 = anCr(doComp(twice(invoke)('Method'), doText, $ancr1)('h3')),
      $recipe = anCr(doComp(twice(invoke)('Recipe'), doText, $ancr2)('h3')),
    $cb1 = anCr(doComp($tabcontent, $ancr1)('div')),
    $cb2 = anCr(doComp($tabcontent, $ancr2)('ul'));
    _.each(margarita[0], ptL(tagFactory, 'p', doComp(doText, $cb1)));
    _.each(margarita[1], ptL(tagFactory, 'li', doComp(doText, $cb2)));
  },

unDoIt = doComp(utils.removeNodeOnComplete, utils.getZero, ptL(utils.getByClass, 'csstabs', document));
eventing('click', event_actions.slice(0,1), doAltRecipe([doIt, unDoIt]), doComp(ptL(utils.byIndex, 1), ptL(utils.getByClass, 'h2', document))).render();
}());
