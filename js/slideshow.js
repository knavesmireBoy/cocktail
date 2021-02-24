/*jslint nomen: true */
/*global window: false */
/*global speakEasy: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
(function (config, mytarget) {
	"use strict";

	function getNativeOpacity(bool) {
		return {
			getKey: function () {
				return bool ? 'filter' : Modernizr.prefixedCSS('opacity');
			},
			getValue: function (val) {
				return bool ? 'alpha(opacity=' + val * 100 + ')' : val;
			}
		};
	}

	function doubleGet(o, sub, v, p) {
		return o[sub][p](v);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function doInvoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function invokeArgs(f) {
		var args = _.rest(arguments);
		return f.apply(null, _.map(args, getResult));
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
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

	function doInc(n) {
		return _.compose(_.partial(modulo, n), increment);
	}
	//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function randomSort(array) {
		var i = array.length,
			tmp,
			randomIndex;
		// While there remain elements to shuffle...
		while (0 !== i) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * i);
			i -= 1;
			// And swap it with the current element.
			tmp = array[i];
			array[i] = array[randomIndex];
			array[randomIndex] = tmp;
		}
		return array;
	}

	function doCallbacks(cb, coll, p) {
		return _[p](coll, cb);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function makeDummy() {
		return {
			render: function () {},
			unrender: function () {}
		};
	}
	var utils = speakEasy.Util,
		ptL = _.partial,
		comp = _.compose,
		con = window.console.log.bind(window),
		Looper = speakEasy.Iterator,
		doCurry = utils.curryFactory,
		cssopacity = getNativeOpacity(!window.addEventListener),
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		drinks = ['martini', 'manhattan', 'margarita', 'maitai', 'mule', 'sidecar', 'julep'],
		eventing = utils.eventer,
		defer_once = doCurry(1, true),
		twice = doCurry(2),
		twicedefer = doCurry(2, true),
		thrice = doCurry(3),
		thricedefer = doCurry(3, true),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
		doGet = twice(utils.getter),
		doMap = utils.doMap,
		drill = utils.drillDown,
		getLength = doGet('length'),
		parser = thrice(doMethod)('match')(/img\/[a-z]+\.jpe?g$/),
		doParse = comp(ptL(add, ''), doGet(0), parser),
		doImagePath = comp(ptL(add, 'img/'), twice(add)('.jpg')),
		show = ptL(klasAdd, 'showtime', utils.getBody),
		noshow = ptL(klasRem, 'showtime', utils.getBody),
        getBod = utils.getDomParent(utils.getNodeByTag('body')),
		showtime = thricedefer(doMethod)('findByClass')('showtime')(utils),
		checkShowTime = ptL(utils.getBest, _.negate(showtime), [show, function () {}]),
		undostatic = ptL(klasRem, 'static', $$('controls')),
        main = document.getElementsByTagName('main')[0],
        remInPlay1 = comp(noshow, getBod, ptL(klasRem, ['inplay', 'playing'], main)),
		slide_player = {
			render: function () {
				checkShowTime()();
				Looper.onpage = Looper.from(randomSort(_.map(drinks, doImagePath)), doInc(getLength(drinks)));
			},
			unrender: function (e) {
                con('unrender' + e)
				Looper.onpage = Looper.from(randomSort(_.map(drinks, doImagePath)), doInc(getLength(drinks)));
				comp(ptL(utils.setter, utils.$('base'), 'src'), doImagePath)('fc');
				//noshow();
               remInPlay1();
			}
		},
		getLoopValue = comp(doGet('value'), ptL(doubleGet, Looper, 'onpage')),
		in_play = thricedefer(doMethod)('findByClass')('inplay')(utils),
		get_player = ptL(utils.getBest, _.negate(in_play), [slide_player, makeDummy()]),
		nextcaller = twicedefer(getLoopValue)('forward')(null),
		prevcaller = twicedefer(getLoopValue)('back')(null),
		getPlaceHolder = ptL(utils.findByClass, 'placeholder'),
		get_play_iterator = function (flag) {
			//if we are inplay (ie pause or playing) we neither want to call enter or exit so a dummy object is returned
			var m = flag ? 'render' : 'unrender',
				slider = get_player();
			slider[m]('foo');
		},
		loadImage = function (getnexturl, id, promise) {
			var img = $(id);
			if (img) {
				img.onload = function (e) {
					promise.then(e.target);
				};
				img.src = getnexturl();
			}
		},
		loader = function (caller, id) {
			var args = _.rest(arguments, 2);
			args = args.length ? args : [function () {}];
			loadImage(caller, id, new utils.FauxPromise(args));
		},
		locator = function (forward, back) {
			var getLoc = function (e) {
				var ret = true,
                    box = {};
				//allow function to be invoked directly it meely returnd a predicate 
				if (e && e.target && e.clientX) {
					box = e.target.getBoundingClientRect();
					ret = e.clientX - box.left > box.width / 2;
				}
				return ret;
			};
			return function (e) {
				return utils.getBest(function (agg) {
					return agg[0](e);
				}, [
					[getLoc, forward],
					[utils.always(true), back]
				]);
			};
		},
		locate = eventing('click', event_actions.slice(0), function (e) {
			checkShowTime()();
			locator(twicedefer(loader)('base')(nextcaller), twicedefer(loader)('base')(prevcaller))(e)[1]();
		}, getPlaceHolder().parentNode),
		recur = (function (player) {
			function doRecur() {
				player.inc();
				recur.t = window.requestAnimationFrame(recur.execute);
			}

			function doOpacity(flag) {
				var slide = utils.$('slide'),
					val;
				if (slide) {
					val = flag ? 1 : recur.i / 100;
					val = cssopacity.getValue(val);
					doMap(slide, [
						[
							[cssopacity.getKey(), val]
						]
					]);
				}
			}
            function doSwap(img){
                /* for a slideshow containing a mix of image sizes doSwap calculates current an next images and will add a class of swap to an element (body is good) this indicates when to switch "players" 
                for this slideshow re need to ensure a falsy is returned it receives an event.target by default*/
            }

			function doSlide() {
				return loader(comp(drill(['src']), $$('base')), 'slide');
			}
			var playmaker = (function () {
				var setPlayer = function (arg) {
						player = playmaker(arg);
						recur.execute();
					},
					doBase = function () {
                        //doSwap
						return loader(_.bind(Looper.onpage.play, Looper.onpage), 'base', setPlayer, doSwap);
					},
					fadeOut = {
						validate: function () {
							return recur.i <= -15.5;
						},
						inc: function () {
							recur.i -= 1;
						},
						reset: function () {
							doSlide();
							var body = utils.getClassList(utils.getBody());
							setPlayer(body.contains('swap'));
						}
					},
					fadeIn = {
						validate: function () {
							return recur.i >= 134.5;
						},
						inc: function () {
                            
							recur.i += 1;
						},
						reset: function () {
							doBase();
						}
					},
					fade = {
						validate: function () {
							return recur.i <= -1;
						},
						inc: function () {
							recur.i -= 2;
						},
						reset: function () {
							recur.i = 300;
							doSlide();
							doOpacity();
							doBase();
							undostatic();
						}
					},
					actions = [fadeIn, fadeOut];
				return function (flag) {
					return flag ? actions.reverse()[0] : fade;
				};
			}());
			player = playmaker();
			return {
				execute: function () {
					if (!recur.t) {
						get_play_iterator(true);
					}
					if (player.validate()) {
						player.reset();
					} else {
						doOpacity();
						doRecur();
					}
				},
				undo: function (flag) {
					doOpacity(flag);
					window.cancelAnimationFrame(recur.t);
					recur.t = null;
				}
			};
		}({})),
		clear = _.bind(recur.undo, recur),
		doplay = _.bind(recur.execute, recur),
		go_render = thrice(doMethod)('render')(null),
		go_unrender = thrice(doMethod)('unrender')('bar'),
		addInPlay = ptL(klasAdd, 'inplay', main),
		addPlaying = ptL(klasAdd, 'playing', main),
		remPlaying = ptL(klasRem, 'playing', main),
		remInPlay = ptL(klasRem, 'inplay', main),
		remPause = comp(utils.removeNodeOnComplete, $$('paused')),
		remSlide = comp(utils.removeNodeOnComplete, $$('slide')),
		//slide and pause 
		onLoad = function (img, path, promise) {
			var ret;
			if (promise) {
				ret = promise.then(img);
			}
			img.src = path;
			return ret;
		},
		doMakeSlide = function (source, target) {
			var img = anCr(getPlaceHolder)($(source));
			doMap(img, [
				['id', target]
			]);
			return onLoad(img, doParse(img.src), new utils.FauxPromise(_.rest(arguments, 2)));
		},
		doMakePause = function () {
			var img = anCr(getPlaceHolder)($('slide'));
			doMap(img, [
				['id', 'paused']
			]);
			doMap(img, [
				[
					[cssopacity.getKey(), cssopacity.getValue(0.5)]
				]
			]);
			return onLoad(img, 'img/pause.png');
		},
        $controller = makeDummy(),//must be OUTSIDE factory
		factory = function () {
            con('fact')
			var unrenderWhen = ptL(utils.doWhen, in_play, comp(go_unrender, utils.always($controller))),
                doExitShow = ptL(utils.doWhen, in_play, thrice(lazyVal)('unrender')(slide_player)),
				doAlt = comp(twice(doInvoke)(null), utils.getZero, thrice(doMethod)('reverse')(null)),
				deferAlt = defer_once(doAlt),
				defEach = thricedefer(doCallbacks)('each'),
				doSlide = deferAlt([clear, doplay]),
				doPlaying = deferAlt([remPlaying, addPlaying]),
				doDisplay = deferAlt([function () {}, addInPlay]),
				invoke_player = defEach([doSlide, doPlaying, doDisplay])(getResult),
				do_invoke_player = comp(ptL(eventing, 'click', event_actions.slice(0), invoke_player), comp(drill(['parentNode']), getPlaceHolder)),
				doReLocate = ptL(utils.doWhen, $$('base'), ptL(lazyVal, null, locate, 'render')),
				
                myprevcaller = utils.getBest(showtime, [prevcaller, utils.always('img/fc.jpg')]),
                
				farewell = [doExitShow, doReLocate, unrenderWhen, defEach([remPause, remSlide])(getResult)],
                
				next_driver = defEach([get_play_iterator, show, defer_once(clear)(true), twicedefer(loader)('base')(nextcaller)].concat(farewell))(getResult),
                
				prev_driver = defEach([get_play_iterator, defer_once(clear)(true), twicedefer(loader)('base')(prevcaller)].concat(farewell))(getResult),
                
				controller = function () {
					var unlocate = thricedefer(doMethod)('unrender')(null)(locate);
					//make BOTH slide and pause but only make pause visible on NOT playing
					if (!$('slide')) {
						//swap out fc.jpg for first image IF not in "showtime"
						if (!showtime()) {
							locate.invoke();
						}
						$controller = doMakeSlide('base', 'slide', go_render, do_invoke_player, unlocate);
						doMakePause();
					}
				},
				COR = function (predicate, action) {
                    var test = _.negate(ptL(equals, 'playbutton'));
					return {
						setSuccessor: function (s) {
							this.successor = s;
						},
						handle: function () {
							if (predicate.apply(this, arguments)) {
								return action.apply(this, arguments);
							} else if (this.successor) {
								return this.successor.handle.apply(this.successor, arguments);
							}
						},
						validate: function(str) {
                            con(str);
							if (in_play() && recur.t && test(str)) {
								con('clear');
								//return fresh instance on exiting slideshow IF in play mode
								clear();
								return factory();
							}
							return this;
						}
					};
				},
				mynext = COR(ptL(invokeArgs, equals, 'forwardbutton'), next_driver),
				myprev = COR(ptL(invokeArgs, equals, 'backbutton'), prev_driver),
				myplayer = COR(function () {
					controller();
					return true;
				}, invoke_player);
			myplayer.validate = function () {
				return this;
			};
			mynext.setSuccessor(myprev);
			myprev.setSuccessor(myplayer);
			recur.i = 50; //slide is clone of base initially, so fade can start quickly
			return mynext;
		},
		chain = factory();
	eventing('click', event_actions.slice(0), function (e) {
		var text_from_target = comp(doGet('id'), drill([mytarget])),
			node_from_target = comp(doGet('nodeName'), drill([mytarget])),
			str = text_from_target(e),
			node = node_from_target(e);
		if (node.match(/button/i)) {
            con('button')
			//!!REPLACE the original chain reference, validate will return either the original or brand new instance
			chain = chain.validate(str);
			chain.handle(str);
		}
	}, $('controls')).render();
	locate.render();
	eventing('submit', event_actions.slice(0, 1), function (e) {
		utils.addClass('hide', e.target);
		comp(ptL(utils.setAttributes, config), twice(doInvoke)('img'), anCr, drill(['parentNode']), utils.setText('Bartender!'), twice(doInvoke)('h3'), anCr, anCr(e.target.parentNode))('section');
	}, document.forms[0]).render();
	Looper.onpage = Looper.from(randomSort(_.map(drinks, doImagePath)), doInc(getLength(drinks)));
}({
	src: 'img/cbook.jpg'
}, !window.addEventListener ? 'srcElement' : 'target'));