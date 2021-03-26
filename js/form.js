/*jslint nomen: true */
/*global window: false */
/*global Modernizr: false */
/*global speakEasy: false */
/*global document: false */
/*global _: false */
(function() {
	function isUnit(arg) {
		return arg === 'unit';
	}

	function equals(a, b) {
		return a === b;
	}

	function open(str) {
		return "<tr><td>str</td>";
	}

	function close(n) {
		return "<td>n</td></tr>";
	}

	function equalsDefer(flag, a) {
		return function(b) {
			return flag ? !equals(a, b) : equals(a, b);
		};
	}

	function colspanHead(v) {
		str = "<h3>Bartender! Get me a <span>" + v + "<span>!</h3><section><div><table><tr><th colspan='2'>RECIPE</th></tr>";
		return v ? str : "<h3>Bartender!</h3><section><div><table><tr><th colspan='2'>RECIPE</th></tr>";
	}

	function colspan(v, k) {
		if (k === 'cocktail') {
			colspanHead(v);
		} else {
			return "<tr><td colspan='2' class='method'>" + v + "</td></tr>";
		}
	}

	function doConcat(a, b) {
		return a + b;
	}

	function doConcatDefer(flag) {
		return function(a, b) {
			return flag ? b + a : a + b;
		};
	}
	/*
	function decorate(cb, decos) {
		return function(a) use(cb, decos) {
			max = count(decos);
			fns = array();
			for (i = 0; i < max; i++) {
				f[] = decos[i](func_get_arg(i));
			}
			call_user_func_array(cb, fns);
		};
	}
	*/
	function soPrintBridge(o, c) {
		return doConcat(open(o), close(c));
	}

	function soPrintBridgeDefer(o, c) {
		return function() {
			return doConcat(open(o), close(c));
		};
	}

	function doWhen(pred, thunk) {
		return function(arg) {
			if (pred(arg)) {
				return thunk();
			}
			return '';
		};
	}

	function checkPairs(cb) {
		return function(a) {
			return function(b) {
				return _.every([a, b], function(str) {
					return str;
				}) ? cb(a, b) : '';
			};
		};
	}

	function inc(arg) {
		return _.findIndex(['reset', 'submit', 'go', 'x', 'y'], arg) > -1;
	}
	var bumf = ['Sometime in 1997 a friend, recently returned from Cuba, dropped by, told of his travels and raved about the cocktails imbibed at the famous “La Floradita” bar in Havana. The search term ‘Floridita’ led us to a great little site hosted at www.hotwired.com/cocktail. Classic cocktails were beginning to enjoy something of a <a href="https://www.berkeleyside.com/2017/09/15/west-coast-cocktail-revival-started-emeryville-thanks-man">renaissance</a>, not least due to the efforts of<a href="http://frodelius.com/goodspiritsnews/paulharrington.html"> Paul Harrington</a>, who had penned a series of articles for hotwired and was practising what he preached at the <a href="https://www.townhouseemeryville.com">Townhouse Bar &#38; Grill</a> in Emeryville, CA.', 'There was enough material to justify the publication of a companion book <a href="https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2" title="by Paul Harrington and Laura Moorhead. Illustrations by Douglas Bowman.">“Cocktail”</a> which appeared the following year. The hardcover book is a treasure trove and truly deserved better than being pawed over in the kitchen at party time. A bar-friendly digest was in order. Inspired by the wonderful <a href="https://dribbble.com/shots/18495-Frisco">illustrations</a> in “Cocktail”, I got to down to some weekend photoshopping, sneaked in a cheeky print run and produced a comb-bound booklet, or three, of, chiefly, classic cocktail recipes.', 'When I enrolled in a web design refresher course many years later I decided to re-purpose the booklet as my chosen personal project. By this time the original hotwired site was long gone, but an archive of sorts was maintained by enthusiasts at <a href="https://www.chanticleersociety.org/index.php?title=Main_Page">The Chanticleer Society</a>. I was able to grab some copy and complete my project.', 'Several years on from that project I discovered the Chanticleer archive was no longer to be found. Shame. However, all is not lost. Quoted searches from passages of the book will still fetch up Harrington’s original copy in various sites, often uncredited. There are a few discrepancies between the web articles and the printed version so the text on this site is a facsimile of the published book. My copy did survive, it is <span class="insert">pictured</span>. You can still pick up a <a href= "https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2--">copy</a> on Amazon, albeit for the price of a very good single malt. I do aspire to get the thing into a database at some point, although it may very well drive me to drink. Speaking of which...'],
		esquire = ['I should point out that the “RULES” are taken from another marvellous book by a more establshed writer on the subject.'],
        harrington_book = {src: 'img/cocktail_book.jpg'},
        comb_bound = {src: 'img/cbook.jpg'},
        esquire_book = {src: 'img/esquire.jpg'},
        esquire_link =  {href: "https://www.amazon.co.uk/Esquire-Drinks-Opinionated-Irreverent-Drinking/dp/1588162052"},
		output,
		doDash = doWhen(equalsDefer(true, 'false'), soPrintBridgeDefer('dash', 'bitters')),
		proxy = checkPairs('soPrintBridge'),
		concat = checkPairs(doConcatDefer(false)),
		concatRev = checkPairs(doConcatDefer(true)),
		cocktail_unit,
		base_spirit_measure,
		gang = {
			prep: 'colspan',
			cocktail: 'colspan',
			dash: doDash
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
        submit = eventing('submit', [], ptL(klasAdd, '.response', utils.getBody), document.forms[0]);
}());

//create div=response, aside, img, p list, h3, span, [SECTION [div table] <a>img] <div class="esquire">