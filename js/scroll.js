/*jslint nomen: true */
/*global window: false */
/*global Modernizr: false */
/*global speakEasy: false */
/*global document: false */
/*global _: false */

(function(){
"use strict";
    
    
   
    
    function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
    
     function getGreater(a, b){
         con(getResult(a), b)
        return getResult(a) > getResult(b);
    }
    
    
    function invoke(f, arg){
        return f(arg);
    }
    
    function invokeBridge(arr){
        return invoke(arr[0], arr[1]);
    }
      function doMethod(o, v, p) {
          o = getResult(o);
          return o && o[p] && o[p](v);
	}
    
   function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}
    
    function getElementOffset(el) {
		//https://medium.com/snips-ai/make-your-next-microsite-beautifully-readable-with-this-simple-javascript-technique-ffa1a18d6de2
		var top = 0,
			left = 0;
		// grab the offset of the element relative to it's parent,
		// then repeat with the parent relative to it's parent,
		// ... until we reach an element without parents.
		do {
			top += el.offsetTop;
			left += el.offsetLeft;
			//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
			el = el.offsetParent;
		} while (el);
		return {
			top: top,
			left: left
		};
	}
    

	function handleScroll($el, cb, klas) {
		if (getPageOffset() > cb($el)) {
				speakEasy.Util.addClass(klas, $el);
			} else {
				speakEasy.Util.removeClass(klas, $el);
			}
		}
    
     function getScrollThreshold(el, percent) {
         if(el){
            try {
			var elementOffsetTop = getElementOffset(el).top,
				elementHeight = el.offsetHeight || el.getBoundingClientRect().height,
				wh = window.innerHeight,
				extra = percent ? (elementHeight * percent) : 0,
                calc = (elementOffsetTop + extra) - wh;
			//return (elementOffsetTop - wh) + extra;
			return calc;
		} catch (e) {
			return 0;
		} 		
	}
         return 0;
     }
    
    function setScrollHandlers(collection, getThreshold, klas) {
			// ensure we don't fire this handler too often
			// for a good intro into throttling and debouncing, see:
			// https://css-tricks.com/debouncing-throttling-explained-examples/
			klas = klas || 'show';
			var deferHandle = thricedefer(handleScroll)(klas)(getThreshold || speakEasy.Util.getScrollThreshold),
				funcs = _.map(collection, deferHandle);
			return _.map(_.map(funcs, thrice(_.throttle)(100)), _.partial(addHandler, 'scroll', window));
		}

    
    var utils = speakEasy.Util,
        $ = utils.$,
        con = window.console.log.bind(window),
        foo = window.console.log.bind(window, 'foo'),
        bar = window.console.log.bind(window, 'bar'),
		con2 = function(arg) {
			con(arg)
			return arg;
		},
        con3 = function(arg) {
			con(3, arg)
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
		thricedefer = curryFactory(3, true),
		thrice = curryFactory(3),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasTog = utils.toggleClass,
		klasRem = utils.removeClass,
        toggleElements = ptL(utils.getByTag, 'h3', document),
        //toggleElements = function(){},
        handleEl = doComp(ptL(getGreater, ptL(getPageOffset, false)), twice(getScrollThreshold)(1.7)),
        getInner = twice(utils.getter)('innerHTML'),
        reset = thrice(utils.setter)('csstabs')('className'),
        getCssTabs = ptL(utils.findByClass, 'csstabs'),
        deferText = twice(_.map)(getInner),
        deferLower = twice(_.map)(thrice(doMethod)('toLowerCase')(null)),
        getLower = doComp(deferLower, deferText, toggleElements),
        add = twice(klasAdd)(getCssTabs),
        rem = twice(klasRem)(getCssTabs),
        best = ptL(utils.getBest, handleEl, [add, rem]),
        //best = ptL(utils.getBest, handleEl, [utils.shout('confirm', 'con'), utils.shout('prompt', 'prompt')]),
        zip = twice(_.map)(best),
        deferEach = twice(_.each)(getResult),
        
        ff = function(funs){
          // if(funs) funs();
        
        },
        
    
        //F = doComp(addEach, deferLower, deferMap, con2, twice(_.filter)(handleEl), toggleElements /*,reset, ptL(utils.findByClass, 'csstabs')*/),
        F = doComp(twice(invoke)('serving'), best, utils.getZero, toggleElements);
    
    window.addEventListener('scroll', _.throttle(F, 100));
    
}());