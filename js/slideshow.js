/*jslint nomen: true */
/*global window: false */
/*global speakEasy: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
(function () {
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
	//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function randomSort(array) {
		var i = array.length,
			tmp, randomIndex;
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
	var utils = speakEasy.Util,
		ptL = _.partial,
		comp = _.compose,
        con = window.console.log.bind(window),
		Looper = speakEasy.Iterator,
		doCurry = utils.curryFactory,
		cssopacity = getNativeOpacity(!window.addEventListener),
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		drinks = ['martini', 'manhattan', 'margarita', 'maitai', 'cosmo', 'sidecar', 'julep'],
		drinks = ['manhattan', 'margarita', 'martini'],
		eventing = utils.eventer,
		once = utils.doOnce(),
		defer_once = doCurry(1, true),
		twice = doCurry(2),
		twicedefer = doCurry(2, true),
		thrice = doCurry(3),
		thricedefer = doCurry(3, true),
		deferEach = thricedefer(doCallbacks)('each'),
		deferEvery = thrice(doCallbacks)('every'),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
		main = document.getElementsByTagName('main')[0],
		doGet = twice(utils.getter),
		invoke = function (f, arg) {
			arg = _.isArray(arg) ? arg : [arg];
			return f.apply(null, arg);
		},
        doAlt = comp(twice(invoke)(null), utils.getZero, thrice(doMethod)('reverse')(null)),
		doMap = utils.doMap,
		doVal = doGet('value'),
		$img = twice(invoke)('img'),
		$cheers = twice(invoke)('h3'),
		config = {
			src: 'img/cbook.jpg'
		},
		daddy = utils.drillDown(['parentNode']),
		doInc = function (n) {
			return comp(ptL(modulo, n), increment);
		},
        show = ptL(klasAdd, 'showtime', utils.getBody),
        showtime = thricedefer(doMethod)('findByClass')('showtime')(utils),
        doShow = ptL(utils.getBest, _.negate(showtime), [show, function(){}]),
		noshow = ptL(utils.hide, utils.getBody),
        makeDummy = function () {
            return {
			render: function () {
            },
			unrender: function () {
            }
		};
        },
		getLength = doGet('length'),
		getValue = doGet('value'),
        parser = thrice(doMethod)('match')(/img\/[a-z]+\.jpe?g$/),
		doParse = comp(ptL(add, ''), doGet(0), parser),
        mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
        text_from_target = comp(doGet('id'), getTarget),
		node_from_target = comp(doGet('nodeName'), getTarget),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		getSlideChild = comp(utils.getChild, utils.getChild, $$('slide')),
		getBaseChild = comp(utils.getChild, utils.getChild, $$('base')),
		undostatic = ptL(klasRem, 'static', $$('controls')),
        getPlaceHolder = ptL(utils.findByClass, 'placeholder'),
        getBaseSrc = comp(utils.drillDown(['src']), getBaseChild),
		addElements = function (el) {
            return anCr(getPlaceHolder)(el);
			//return comp(twice(invoke)('img'), anCr, twice(invoke)('a'), anCr, anCr(getPlaceHolder))('li');
		},
		//height and width of image are compared BUT a) must invoke the comparison AFTER image loaded
		//b) must remove load listener or will intefere with slideshow
		onBase = function (img, path, promise) {
			img.src = path;
			var ev = eventing('load', event_actions.slice(0, 1), function (e) {
				promise.then(e.target);
				ev.unrender();
			}, img).render();
		},
		doMapLateVal = function (v, el, k) {
			return doMap(el, [
				[k, v]
			]);
		},
		doPath = comp(ptL(add, 'img/'), twice(add)('.jpg')),
		set = ptL(utils.setter, utils.$('base'), 'src'),
		slide_player = {
			render: function () {
                if(!showtime()){
                    show();
                 Looper.onpage = Looper.from(randomSort(_.map(drinks, doPath)), doInc(getLength(drinks)));
                }
               
			},
			unrender: function () {
				this.render();//reset random array
				comp(noshow, set, doPath)('fc');
			}
		},
		in_play = thricedefer(doMethod)('findByClass')('inplay')(utils),
		//could find a none dom dependent predicate
        getLoopValue = comp(doVal, ptL(doubleGet, Looper, 'onpage')),
		get_player = ptL(utils.getBest, _.negate(in_play), [slide_player, makeDummy()]),
        nextcaller = twicedefer(getLoopValue)('forward')(null),
		prevcaller = twicedefer(getLoopValue)('back')(null),
		get_play_iterator = function (flag) {
			//if we are inplay (ie pause or playing) we neither want to call enter or exit so a dummy object is returned
			var m = flag ? 'render' : 'unrender',
				slider = get_player();
			slider[m]();
		},
        loadImage = function (getnexturl, id, promise) {
			var img = getDomTargetImg($(id));
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
				var box = e.target.getBoundingClientRect();
				return e.clientX - box.left > box.width / 2;
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
           doShow()();
			locator(twicedefer(loader)('base')(nextcaller), twicedefer(loader)('base')(prevcaller))(e)[1]();
		}, getPlaceHolder()),
		
		recur = (function (player) {
			function test() {
				return _.map([getBaseChild(), getSlideChild()], function (img) {
					return img && img.width > img.height;
				});
			}

			function doSwap() {
                /*
				var coll = test(),
					bool = coll[0] === coll[1],
					body = utils.getClassList(utils.getBody()),
					m = bool ? 'remove' : 'add';
				body[m]('swap');
				return !bool;
                */
			}

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
                    /*
					doMap(slide, [
						[
							[cssopacity.getKey(), val]
						]
					]);
                    */
                    slide.style.opacity = val;
				}
			}

			function doSlide() {
				return loader(comp(utils.drillDown(['src']), $$('base')), 'slide');
			}
			var playmaker = (function () {
				var setPlayer = function (arg) {
						player = playmaker(arg);
						recur.execute();
					},
					doBase = function () {
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
							recur.i -= 1;
						},
						reset: function () {
							recur.i = 150;
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
		go_unrender = thrice(doMethod)('unrender')(null),
		//makeToolTip = comp(thrice(doMethod)('init')(null), ptL(poloAF.Tooltip, getPlaceHolder, tooltip_msg, touchevents ? 0 : 2)),
		playtime = ptL(klasAdd, 'inplay', main),
		//playing = comp(ptL(utils.doWhen, once(2), ptL(makeToolTip, true)), ptL(klasAdd, 'playing', main)),
		playing = ptL(klasAdd, 'playing', main),
		notplaying = ptL(klasRem, 'playing', main),
		exit_inplay = ptL(klasRem, 'inplay', main),
		
        //slide and pause 
		onLoad = function (img, path, promise) {
			var ret;
			if (promise) {
				ret = promise.then(img);
                            con(arguments);

			}
			img.src = path;
			return ret;
		},
		doMakeSlide = function (source, target) {
			var img = addElements($(source));
			doMap(img, [
				['id', target]
			]);
           return onLoad(img, doParse(img.src), new utils.FauxPromise(_.rest(arguments, 2)));
		},
		doMakePause = function (path) {
            return;
			var img = addElements($('slide'));
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
        $controller = makeDummy(),
		factory = function () {
			var remPause = comp(utils.removeNodeOnComplete, $$('paused')),
				remSlide = comp(utils.removeNodeOnComplete, $$('slide')),
				defer = defer_once(doAlt),
				doSlide = defer([clear, doplay]),
				doPlaying = defer([notplaying, playing]),
				doDisplay = defer([function () {}, playtime]),
				unlocate = thricedefer(doMethod)('unrender')(null)(locate),
				invoke_player = deferEach([doSlide, doPlaying, doDisplay])(getResult),
				//invoke_player = function(){},
				do_invoke_player = comp(ptL(eventing, 'click', event_actions.slice(0, 2), invoke_player), getPlaceHolder),
				relocate = ptL(lazyVal, null, locate, 'render'),
				doReLocate = ptL(utils.doWhen, $$('base'), relocate),
				doExitShow = thrice(lazyVal)('unrender')(slide_player),
                
				farewell = [notplaying, exit_inplay, comp(go_unrender, utils.always($controller)), doReLocate, doExitShow, deferEach([remPause, remSlide])(getResult)],
                
                farewell = [deferEach([remPause, remSlide])(getResult)],
                                
				next_driver = deferEach([get_play_iterator, showtime, defer_once(clear)(true), twicedefer(loader)('base')(nextcaller)].concat(farewell))(getResult),
				prev_driver = deferEach([get_play_iterator, defer_once(clear)(true)].concat(farewell))(getResult),
				controller = function () {
					//make BOTH slide and pause but only make pause visible on NOT playing
					if (!$('slide')) {
						$controller = doMakeSlide('base', 'slide', go_render, do_invoke_player/*, unlocate*/);
						//doMakePause();
					}
				},
				COR = function (predicate, action) {
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
						validate: function (str) {
							if (utils.findByClass('inplay') && recur.t && predicate(str)) {
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
        eventing('click', event_actions.slice(0, 1), function (e) {
					var str = text_from_target(e),
						node = node_from_target(e);
					if (node.match(/button/i)) {
						//!!REPLACE the original chain reference, validate will return either the original or brand new instance
						chain = chain.validate(str);
						chain.handle(str);
					}
				}, $('controls')).render();
    
   // locate.render();
    
    eventing('submit', event_actions.slice(0, 1), function (e) {
        utils.addClass('hide', e.target);
		comp(ptL(utils.setAttributes, config), $img, anCr, daddy, utils.setText('Bartender!'), $cheers, anCr, anCr(e.target.parentNode))('section');
	}, document.forms[0]).render();
    Looper.onpage = Looper.from(randomSort(_.map(drinks, doPath)), doInc(getLength(drinks)));
}());