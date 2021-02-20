/*jslint nomen: true */
/*global window: false */
/*global speakEasy: false */
/*global _: false */
if (!window.speakEasy) {
	window.speakEasy = {};
}
(function () {
	"use strict";

	function equals(a, b) {
		return a === b;
	}
	speakEasy.Iterator = function (group, advancer) {
		this.group = group;
		this.position = 0;
		this.rev = false;
		this.advance = advancer;
	};
	speakEasy.Group = function () {
		this.members = [];
	};
	speakEasy.Group.prototype = {
		add: function (value) {
			if (!this.has(value)) {
				this.members.push(value);
			}
		},
		remove: function (value) {
			this.members = _.filter(this.members, _.negate(_.partial(equals, value)));
		},
		has: function (value) {
			return _.contains(this.members, value);
		}
	};
	speakEasy.Group.from = function (collection) {
		var group = new speakEasy.Group(),
			i,
			L = collection.length;
		for (i = 0; i < L; i += 1) {
			group.add(collection[i]);
		}
		return group;
	};
	speakEasy.Iterator.from = function (coll, advancer) {
		return new speakEasy.Iterator(speakEasy.Group.from(coll), advancer);
	};
	speakEasy.Iterator.onpage = null;
	speakEasy.Iterator.cross_page = null;
	speakEasy.Iterator.prototype = {
		forward: function (flag) {
			if (!flag && this.rev) {
				return this.back(true);
			}
			//this.position++;
			//this.position = this.position % this.group.members.length;
			this.position = this.advance(this.position);

			var result = {
				value: this.group.members[this.position],
				index: this.position
			};
			return result;
		},
		back: function (flag) {
			if (!this.rev || flag) {
				this.group.members = this.group.members.reverse();
				//this.position = this.group.members.length - 1 - (this.position);
				this.position = this.group.members.length - 2 - (this.position);
				//this.position = this.position % this.group.members.length;
				this.position = this.advance(this.position);
				this.rev = !this.rev;
				return this.forward(this.rev);
			} else {
				return this.forward(this.rev);
			}
		},
		play: function () {
			return this.forward(true).value;
		},
		current: function () {
			var result = {
				value: this.group.members[this.position],
				index: this.position
			};
			return result;
		},
		find: function (tgt) {
			return this.set(_.findIndex(this.group.members, _.partial(equals, tgt)));
			//return this.set(this.group.members.findIndex(_.partial(equals, tgt)));
		},
		set: function (pos) {
			this.position = pos;
			var result = {
				value: this.group.members[this.position],
				index: this.position
			};
			return result;
		},
		get: function () {
			return this.current().value;
		}
	};
}());