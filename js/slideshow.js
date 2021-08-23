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
        p = p || 'each';
        cb = cb || getResult;
		return _[p](coll, cb);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}
	var utils = speakEasy.Util,
		ptL = _.partial,
		comp = _.compose,
		always = utils.always,
        /*
		con = window.console.log.bind(window),
        con2 = function(arg){
            con(arg);
            return arg;
        },
        */
		Looper = speakEasy.Iterator,
		doCurry = utils.curryFactory,
		cssopacity = getNativeOpacity(!window.addEventListener),
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		drinks = ['dry_martini', 'manhattan', 'margarita', 'mai_tai', 'moscow_mule', 'sidecar', 'mint_julep', 'daiquiri', 'floridita', 'cosmopolitan'],
		eventing = utils.eventer,
		defer_once = doCurry(1, true),
		twice = doCurry(2),
		twicedefer = doCurry(2, true),
		thrice = doCurry(3),
		thricedefer = doCurry(3, true),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		removeNode = utils.removeNodeOnComplete,
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
		doGet = twice(utils.getter),
		doMap = utils.doMap,
		drill = utils.drillDown,
		getLength = doGet('length'),
		parser = thrice(doMethod)('match')(/img\/[a-z_]+\.jpe?g$/),
		doParse = comp(ptL(add, ''), doGet(0), parser),
		doImagePath = comp(ptL(add, 'img/'), twice(add)('.jpg')),
		go_execute = thrice(doMethod)('execute')(null),
		go_undo = thrice(doMethod)('undo')(null),
		show = ptL(klasAdd, 'showtime', utils.getBody),
		noshow = ptL(klasRem, 'showtime', utils.getBody),
		getBod = utils.getDomParent(utils.getNodeByTag('body')),
		showtime = thricedefer(doMethod)('findByClass')('showtime')(utils),
		checkShowTime = ptL(utils.getBest, _.negate(showtime), [show, function () {}]),
		main = document.getElementsByTagName('main')[0],
		getPlaceHolder = ptL(utils.findByClass, 'placeholder'),
        exitInPlay = ptL(klasRem, ['inplay', 'playing'], main),
        exitPlus = comp(noshow, getBod, exitInPlay),
        restoreBaseImg = comp(noshow, ptL(utils.setter, utils.$('base'), 'src'), doImagePath, always('fc')),
        remPlaying = ptL(klasRem, ['inplay', 'playing'], main),
        remInPlay = comp(noshow, getBod, remPlaying),
		slide_player = {
			execute: function () {
				checkShowTime()();
			},
			undo: function (e) {
				Looper.onpage = Looper.from(randomSort(_.map(drinks, doImagePath)), doInc(getLength(drinks)));
				//comp(ptL(utils.setter, utils.$('base'), 'src'), doImagePath)('fc');
				remPlaying();
			}
		},
		init_slideshow = thricedefer(doMethod)('execute')(null)(slide_player),
		getLoopValue = comp(doGet('value'), ptL(doubleGet, Looper, 'onpage')),
		nextcaller = twicedefer(getLoopValue)('forward')(null),
		prevcaller = twicedefer(getLoopValue)('back')(null),
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
				var box = e[mytarget].getBoundingClientRect(),
                    threshold = (box.right - box.left) / 2;
                //default to forward
				return e.clientX ? (e.clientX - box.left) > threshold : true;
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
		}, getPlaceHolder),
		go_invoke = ptL(utils.doWhen, _.negate(showtime), thricedefer(doMethod)('invoke')(null)(locate)),
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
			return onLoad(img, 'img/pauser.png');
		},
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

			function doSwap(img) {
				/* for a slideshow containing a mix of image sizes doSwap would compare the width of current and next images and will add a class of swap to an element (body is good) for styling (hiding base) and also a signal when to switch "players" 
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
						init_slideshow();
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
		chainFactory = function () {
			utils.makeCommand(); //reset utils.command to dummy command object
			var doAlt = comp(twice(doInvoke)(null), utils.getZero, thrice(doMethod)('reverse')(null)),
				deferAlt = defer_once(doAlt),
				defEach = thricedefer(doCallbacks)('each'),
				doSlide = deferAlt([clear, doplay]),
				doPlaying = deferAlt([ptL(klasRem, 'playing', main), ptL(klasAdd, 'playing', main)]),
				doDisplay = deferAlt([function () {}, ptL(klasAdd, 'inplay', main)]),
				doExitShow = ptL(utils.doWhen, $$('slide'), thrice(lazyVal)('undo')(slide_player)),
				justUndo = ptL(utils.doWhen, $$('slide'), comp(go_undo, utils.always(utils.command))),
				invoke_player = defEach([doSlide, doPlaying, doDisplay])(getResult),
				do_invoke_player = comp(ptL(eventing, 'click', event_actions.slice(0), invoke_player), comp(ptL(utils.climbDom, 1), getPlaceHolder)),
				doReLocate = ptL(utils.doWhen, $$('slide'), ptL(lazyVal, null, locate, 'execute')),
				doShow = ptL(utils.doWhen, _.negate($$('slide')), show),
				cleanup = [doReLocate, doExitShow, justUndo, doShow, defEach([comp(removeNode, $$('paused')), comp(removeNode, $$('slide'))])(getResult)],
				next_driver = defEach([defer_once(clear)(true), twicedefer(loader)('base')(nextcaller)].concat(cleanup))(getResult),
				prev_driver = defEach([defer_once(clear)(true), twicedefer(loader)('base')(prevcaller)].concat(cleanup))(getResult),
				prep_slideshow = function () {
					var unlocate = thricedefer(doMethod)('undo')(null)(locate);
					//make BOTH slide and pause but only make pause visible on NOT playing
					//swap out fc.jpg for first image IF not in "showtime"
					go_invoke();
					doMakeSlide('base', 'slide', go_execute, do_invoke_player, unlocate);
					doMakePause();
				},
				doPrepSlideShow = comp(always(true), ptL(utils.doWhen, _.negate($$('slide')), prep_slideshow)),
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
						validate: function (str) {
							if ($('slide') && recur.t && test(str)) {
								//con('clear');
								//return fresh instance on exiting slideshow IF in play mode
								clear();
								return chainFactory();
							}
							return this;
						}
					};
				},
				mynext = COR(ptL(invokeArgs, equals, 'forwardbutton'), next_driver),
				myprev = COR(ptL(invokeArgs, equals, 'backbutton'), prev_driver),
                //myplayer = COR(doPrepSlideShow, invoke_player),
				myplayer = COR(ptL(invokeArgs, equals, 'playbutton'), comp(invoke_player, doPrepSlideShow)),
                myend = COR(_.negate($$('slide')), restoreBaseImg);
            
            myplayer.validate = function () {
				return this;
			};
			mynext.setSuccessor(myprev);
			myprev.setSuccessor(myplayer);
			myplayer.setSuccessor(myend);
			recur.i = 0; //slide is clone of base initially, so fade can start quickly
			return mynext;
		},
		chain = chainFactory();
	eventing('click', event_actions.slice(0), function (e) {
		var text_from_target = comp(doGet('id'), drill([mytarget])),
			node_from_target = comp(doGet('nodeName'), drill([mytarget])),
			str = text_from_target(e),
			node = node_from_target(e);
		if (node.match(/button/i)) {
			//!!REPLACE the original chain reference, validate will return either the original or brand new instance
			chain = chain.validate(str);
		}
        chain.handle(str);//if empty area of #controls is clicked restore initial layout IF slideshow is not active
       
	}, $('controls')).execute();
	locate.execute();
	Looper.onpage = Looper.from(randomSort(_.map(drinks, doImagePath)), doInc(getLength(drinks)));
}({
	src: 'img/cbook.jpg'
}, !window.addEventListener ? 'srcElement' : 'target'));