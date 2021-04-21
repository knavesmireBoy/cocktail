/*jslint nomen: true */
/*global window: false */
/*global Modernizr: false */
/*global speakEasy: false */
/*global document: false */
/*global _: false */
(function (mq, query) {
	"use strict";

	function is_touch_enabled() {
		return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
	}

	function invoke(f, arg) {
		return f(arg);
	}

	function doConcatDefer(flag, a) {
		return function (b) {
			return flag ? b + a : a + b;
		};
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function getValue(el) {
		return el.value;
	}

	function flatten(sub) {
		return _.isArray(sub[0]) ? sub[0] : sub;
	}

	function fromPost(list) {
		return _.filter(_.filter(list, function (el) {
			return !_.contains(['reset', 'submit', 'hidden'], el.type);
		}), function (el) {
			return el.name;
		});
	}

	function isInteger(arg) {
		return !isNaN(parseFloat(arg));
	}

	function capitalize(s) {
		if (typeof s !== 'string') {
			return s;
		}
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	function tbl(data) {
		var i,
			j,
			tr,
			td,
			method = once(ptL(klasAdd, 'method')),
			fragment = anCr($('response'))(),
			tbod = anCr(anCr(fragment)('table'))('tbody');
		for (i = 0; i < data.length; i += 1) {
			tr = anCr(tbod)('tr');
			for (j = 0; j < data[i].length; j += 1) {
				td = doComp(utils.setText(data[i][j]), anCr(tr))(i ? 'td' : 'th');
				if (!j && !data[i][j + 1]) {
					doComp(ptL(utils.doWhen, !data[i + 1]), method, ptL(setAttrs, {
						colspan: 2
					}), utils.always(td))();
				}
			}
		}
		return fragment;
	}

	function tagFactory(tag, ptl, txt) {
		ptl(tag)(txt);
	}

	function post(e) {
		var div,
			dash,
			anchor = anCr($('response')),
			data = _.filter(_.map(fromPost(e[mytarget].elements), _.identity), function (arg) {
				return arg;
			}),
			cocktail = getValue(data.splice(0, 1)[0]),
			units = _.filter(data.splice(2, 2), function (el) {
				return el.checked;
			}),
			addUnit = doConcatDefer(true, getValue(units[0])),
			getValueWrap = _.wrap(getValue, function (f, arg) {
				if (f(arg) === 'on') {
					return ['Dash', 'Bitters'];
				}
				return capitalize(f(arg));
			}),
			append = doComp(invoke, ptL(utils.getBest, doComp(isInteger, getValue), [doComp(addUnit, getValue), getValueWrap])),
			include = function (el) {
				if (el.type === 'checkbox') {
					return el.checked;
				} else {
					return el.value;
				}
			};
		data = _.chunk(data, 2);
		if (_.last(data)[1]) {
			dash = data.splice(-1, 1)[0];
			data.push([dash[0]]);
			data.push([dash[1]]);
		}
		data.unshift([{
			value: "recipe"
		}]);
		data = _.map(_.map(_.filter(data, function (sub) {
			return _.every(sub, function (el) {
				return include(el);
			});
		}), function (sub) {
			return _.map(sub, append);
		}), flatten);
		doComp(ptL(setAttrs, harrington_book), anCr(anchor('aside')))('img');
		_.each(bumf, ptL(tagFactory, 'p', doComp(doText, anchor)));
		klasAdd('response', utils.getBody);
		doComp(utils.setText('Bartender!, get me a <span>' + (cocktail || 'drink') + '!</span>'), anchor)('h2');
		anchor = anchor('section');
		div = anCr(anchor)('div');
		anCr(div)(tbl(data));
		doComp(ptL(setAttrs, comb_bound), anCr(anCr(anchor)('a')))('img');
		if (is_touch_enabled) {
			eventing('click', event_actions.slice(0), function (e) {
				function remove(e) {
					utils.removeNodeOnComplete(e.target.parentNode);
				}
				var eventer = ptL(eventing, 'click', event_actions.slice(0), remove),
					exec = thrice(doMethod)('execute')(null),
					getEl = thrice(doMethod)('getEl')(null);
				if (Modernizr.mq('only all') && !Modernizr.mq(query)) {
					if (!$('comb_bound')) {
						doComp(ptL(setAttrs, comb_bound), anCr(doComp(getEl, exec, eventer, ptL(setAttrs, {
							id: 'comb_bound'
						}), anCrIn(e.target.parentNode.nextSibling, e.target.parentNode.parentNode))('a')))('img');
					} else {
						utils.removeNodeOnComplete($('comb_bound'));
					}
				}
			}, $$('comb')).execute();
		}
		div = doComp(utils.setText(esquire), twice(invoke)('p'), anCr, ptL(utils.climbDom, 3), ptL(setAttrs, esquire_book), twice(invoke)('img'), anCr, ptL(setAttrs, esquire_link), twice(invoke)('a'), anCr, ptL(klasAdd, 'esquire'), anCr($('response')))('div');
	}
	var bumf = ['Sometime in 1997 — June, July or August — a friend, recently returned from Cuba, dropped by, told of his travels and raved about the cocktails imbibed at the famous “La Floradita” bar in Havana. The search term ‘Floradita’ fetched up at a great little site hosted at www.hotwired.com/cocktail. Classic cocktails were beginning to enjoy something of a <a href="https://www.berkeleyside.com/2017/09/15/west-coast-cocktail-revival-started-emeryville-thanks-man">renaissance</a>, due, in part, to the efforts of a certain<a href="http://frodelius.com/goodspiritsnews/paulharrington.html"> Paul Harrington</a>, who had not only penned a series of erudite articles for hotwired but was practising what he preached at the <a href="https://www.townhouseemeryville.com">Townhouse Bar &#38; Grill</a> in Emeryville, CA.', 'There was enough material to justify the publication of a companion book, <a href="https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2" title="by Paul Harrington and Laura Moorhead. Illustrations by Douglas Bowman.">“Cocktail”</a>, which appeared the following year. The hardcover book is a treasure trove and truly deserved better than being pawed over in the kitchen at party time. A bar-friendly digest was in order. Inspired by the wonderful <a href="https://dribbble.com/shots/18495-Frisco">illustrations</a> in “Cocktail”, I got to down to some weekend photoshopping, sneaked in a cheeky print run and produced a <a id="comb" href="https://en.wikipedia.org/wiki/Comb_binding" title="wikipedia article on comb-binding">comb-bound</a> booklet, or three, of, chiefly, classic cocktail recipes', 'When I enrolled in a web design refresher course many years later I decided to re-purpose the booklet as my chosen personal project. By this time the original hotwired site was long gone, but an archive of sorts was maintained by enthusiasts at <a href="https://www.chanticleersociety.org/index.php?title=Main_Page">The Chanticleer Society</a>. I was able to grab some copy and complete my project.', 'Several years on from that project I discovered the Chanticleer archive was no longer to be found. Shame. However, all is not <a href="#archived">lost*</a>. Quoted searches from passages of the book will still fetch up Harrington’s original copy in various sites, often uncredited. There are a few discrepancies between the web articles and the printed version so the text on this site is a facsimile of the published book. My copy did survive, it is <span class="insert">pictured</span>. You can still pick up a <a href= "https://www.amazon.co.uk/Cocktail-Paul-Harrington/dp/0670880221/ref=sr_1_2?dchild=1&keywords=paul+harrington&qid=1615892712&s=books&sr=1-2--">copy</a> on Amazon, albeit for the price of a very good single malt. I do aspire to get the thing into a database at some point, though that may well drive me to drink. Speaking of which...'],
		esquire = 'I should point out that the “RULES” are taken from another esteemed source... <a id="archived"href="http://web.archive.org/web/20050901000000*/http://cocktailtime.com"><h6>*Archived pages: prepare to dig.</h6></a>',
		harrington_book = {
			src: 'img/cocktail_book.jpg'
		},
		comb_bound = {
			src: 'img/cbook.jpg'
		},
		esquire_book = {
			src: 'img/esquire.jpg'
		},
		esquire_link = {
			href: "https://www.amazon.co.uk/Esquire-Drinks-Opinionated-Irreverent-Drinking/dp/1588162052"
		},
		utils = speakEasy.Util,
		//con = window.console.log.bind(window),
		ptL = _.partial,
		doComp = _.compose,
		curryFactory = utils.curryFactory,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		once = curryFactory(1, true),
		twice = curryFactory(2),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		setAttrs = utils.setAttributes,
		doText = thrice(utils.lazySet)('innerHTML'),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document);
	eventing('submit', event_actions.slice(0), post, document.forms[0]).execute();
	eventing('reset', [], function () {
		window.location.href = '.';
	}, document.forms[0]).execute();
	eventing('click', event_actions.slice(0), function () {
		klasRem('response', utils.getBody);
		var resp = $('response'),
			form = resp.removeChild(document.forms[0]),
			nodes = _.toArray(resp.childNodes);
		_.each(nodes, utils.removeNodeOnComplete);
		resp.appendChild(form);
	}, utils.getByTag('h1')[0]).execute();
	eventing('load', event_actions.slice(0), function () {
		var el = $('mix');
		el.innerHTML = "or mix your own..."
		eventing('click', event_actions.slice(0), function () {
			klasAdd('swap', utils.getBody);
		}, el).execute();
	}, window).execute();
    
}(Modernizr.mq('only all'), '(min-width: 736px)'));
//create div=response, aside, img, p list, h3, span, [SECTION [div table] <a>img] <div class="esquire">