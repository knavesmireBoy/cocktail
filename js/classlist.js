/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global _: false */
if (!window.speakEasy) {
	window.speakEasy = {};
}
speakEasy.ClassList = (function () {
	"use strict";

	function existy(x) {
		return x != null;
	}
    //https://stackoverflow.com/questions/29454340/detecting-classname-of-svganimatedstring/29454358
     function isSVG(node){
        return typeof node && node.className && node.className.baseVal !== 'undefined'
    }

	function setter(o, k, v) {
        if(isSVG(o)){
           o[k].baseVal = v; 
        }
		else {
            o[k] = v;
        }
	}

	function setterplus(o, k, v) {
        if(isSVG(o)){
           o[k].baseVal += v; 
        }
        else {
         o[k] += v;   
        }
	}

	function best(fun, coll) {
		return _.reduce(_.toArray(coll), function (x, y) {
			return fun(x, y) ? x : y;
		});
	}

	function always(val) {
		return function () {
			return val;
		};
	}

	function cat() {
		var head = _.first(arguments);
		if (existy(head)) {
			return head.concat.apply(head, _.rest(arguments));
		} else {
			return [];
		}
	}

	function mapcat(fun, coll) {
		return cat.apply(null, _.map(coll, fun));
	}

	function condition1() {
		var validators = _.toArray(arguments);
		return function (fun, arg) {
			var errors = mapcat(function (isValid) {
				return isValid(arg) ? [] : [isValid.message];
			}, validators);
			if (!_.isEmpty(errors)) {
				throw new Error(errors.join(", "));
			}
			return fun(arg);
		};
	}

	function validator(message, fun) {
		var f = function () {
			return fun.apply(fun, arguments);
		};
		f.message = message;
		return f;
	}
    
	var constr = function (node) {
		var set = _.partial(setter, node, 'className'),
			superset = _.partial(setterplus, node, 'className'),
			contains = function (klas) {
				var pattern = new RegExp('(^| )' + klas + '( |$)'),
                    name = node.className.baseVal || node.className;
				return pattern.test(name) ? true : false;
			},
			add = function (klas) {
				if (!contains(klas)) {
                    var k = isSVG(node) ? node.className.baseVal : node.className;
					superset(_.isEmpty(k) ? klas : ' ' + klas);
				}
			},
			remove = function (klas) {
				var pattern = new RegExp('(^| )' + klas + '( |$)'),
                    name = isSVG(node) ? node.className.baseVal : node.className;
				set(name.replace(pattern, '$1').replace(/ $/, ''));
			},
            outcomes = [add, remove],
			toggle = function (klas, bool) {
				if (_.isBoolean(bool)) {
					best(always(bool), outcomes)(klas);
				} else {
					best(_.partial(_.negate(contains), klas), outcomes)(klas);
				}
			},
			replace = function (oldklas, newklas) {
				var pattern = new RegExp('(^| )' + oldklas + '( |$)');
				set(node.className.replace(pattern, '$1').replace(/ $/, newklas));
			},
			notEmpty = function (klas) {
				return !/^\s+$/.test(klas);
			},
			valid = condition1(validator('please supply a string', _.isString), validator('string cannot be empty', notEmpty)),
			valid1 = function (fun, arg) {
				return fun(arg);
			};
		return {
			contains: contains,
			add: _.partial(valid1, add),
			replace: _.partial(valid, replace),
			remove: _.partial(valid, remove),
			toggle: toggle,
			getNode: function () {
				return node;
			}
		};
	};
	return constr;
}());