
(function (DOMParser) {
    "use strict";

    var DOMParser_proto = DOMParser.prototype,
        real_parseFromString = DOMParser_proto.parseFromString;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {
    }

    DOMParser_proto.parseFromString = function (markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.implementation.createHTMLDocument(""),
                root = markup.toLowerCase().indexOf('<!doctype');

            if (root > -1) {
                doc.documentElement.innerHTML = markup;
            }
            else {
                doc.body.innerHTML = markup;
            }
            return doc;
        } else {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(DOMParser));


/* Reference Article: http://www.dustindiaz.com/top-ten-javascript/ */
/*window.onload = function() { console.log('ready'); }
 document.addEventListener("DOMContentLoaded", function(event) {
 console.log("DOM fully loaded and parsed", event.type);
 });
 */
var Bar = Bar || {};
Bar.Core = (function () {
    var pub = Bar.Observer,
        iterator = Bar.Iterator,
        slice = Array.prototype.slice,
        $ = this.$;

//Core
    return {
        $: function (node, tag) {
            var id = node || document,
                isDoc = function (arg) {
                    return arg === document;
                };
            id = (isDoc(id)) ? id : (typeof id === 'string') ? document.getElementById(id) : id;
            if (!tag && isDoc(id)) return null;
            if (id && tag) {
                return id.getElementsByTagName(tag);
            }
            return id;
        },
//slice??
        toArray: function (arg, callback) {
            var Els = [], i = 0, el;
            while (arg[i]) {
                el = arg[i];
                if (callback) {
                    el = callback(el);
                }
                Els.push(el);
                i++;
            }
            return Els;
        },
        makePub: function () {
            var i = 0, args = arguments;
            while (args[i]) {
                this.mix(pub, args[i]);
                //CRUCIAL break link to prototype as this needs to be an instance property
                args[i].subscribers = {any: []/*, special: []*/};
                i++;
            }
        },
        hasMethods: function () {
            if (!document.getElementById) return null;
            if (!document.getElementsByTagName) return null;
            return true;
        },

        toString: function () {
            return 'core blimey';
        },
        makeIterator: function (tags) {
            var arr = this.toArray(tags),
                that = this;
            arr = arr.map(function (el) {
                var t = that.clone(Bar.$$);
                return t.init(el);
            });
            return iterator.make(arr);
        },
        Accessor: {
            visit: function (arg) {
                this.element = arg;
            },
            getElement: function () {
                return this.element;
            }
        },
        getTarget: function (srcnode, targetnode, direction) {
            var node = null;
            if (!arguments[0]) {
                return;
            }
            if (!targetnode) {
                return srcnode;
            }
            if (direction) {
                node = srcnode;
                while (node[direction]) {
                    if (node.nodeName.toLowerCase() === targetnode) {
                        break;
                    }
                    node = node[direction];
                }
            }
            return node;
        },
        Interface: function (name, methods) {
            //console.log(arguments.callee.caller);
            if (arguments.length != 2) {
                throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
            }
            this.name = name;
            this.methods = [];
            for (var i = 0, len = methods.length; i < len; i++) {
                if (typeof methods[i] !== 'string') {
                    throw new Error("Interface constructor expects method names to be " + "passed in as a string.");
                }
                this.methods.push(methods[i]);
            }
        },
        /* addEvent: simplified event attachment */
        addEvent: function (obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false);
                EventCache.add(obj, type, fn);
            }
            else if (obj.attachEvent) {
                obj["e" + type + fn] = fn;
                obj[type + fn] = function () {
                    obj["e" + type + fn](window.event);
                };
                obj.attachEvent("on" + type, obj[type + fn]);
                EventCache.add(obj, type, fn);
            }
            else {
                obj["on" + type] = obj["e" + type + fn];
            }
        },
//http://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string/359910#359910
        executeFunctionByName: function (functionName, context /*, args */) {
            var args = Array.prototype.slice.call(arguments, 2);
            var namespaces = functionName.split(".");
            var func = namespaces.pop();
            for (var i = 0; i < namespaces.length; i++) {
                context = context[namespaces[i]];
            }
            return context[func].apply(context, args);
        },

        addLoadEvent: function () {
            //assumes obj, method etc...
            var oldonload = window.onload,
                args = arguments,
                obj = args[0], func = args[1], args = slice.call(args, 2);
            if (typeof window.onload != 'function') {
                window.onload = function () {
                    func.apply(obj, args);
                };
            }
            else {
                window.onload = function () {
                    oldonload.apply(obj, args);
                    func.apply(obj, args);
                }
            }
        },
        /* grab Elements from the DOM by className */
        getElementsByClass: function (searchClass, node, tag) {
            try {
                return document.getElementsByClassName(searchClass);
            } catch (err) {
                var classElements = [];
                if (node == null)
                    node = document;
                if (tag == null)
                    tag = '*';
                var els = node.getElementsByTagName(tag);
                var elsLen = els.length;
                var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
                for (var i = 0, j = 0; i < elsLen; i++) {
                    if (pattern.test(els[i].className)) {
                        classElements[j] = els[i];
                        j++;
                    }
                }
                return classElements;
            }
        },

        convert2Array: function (collection, n) {
            n = n || 0;
            //console.log(document.querySelectorAll('.tabbox'))
            return slice.call(this.getElementsByClass(collection), n);
        },

        /* insert an element after a particular node */
        insertAfter: function (parent, node, referenceNode) {
            parent.insertBefore(node, referenceNode.nextSibling);
        },
        /* get, set, and delete cookies */
        getCookie: function (name) {
            var start = document.cookie.indexOf(name + "=");
            var len = start + name.length + 1;
            if (( !start ) && ( name != document.cookie.substring(0, name.length) )) {
                return null;
            }
            if (start == -1) return null;
            var end = document.cookie.indexOf(";", len);
            if (end == -1) end = document.cookie.length;
            return ( document.cookie.substring(len, end) );
            /*unescape*/
        },
        setCookie: function (name, value, expires, path, domain, secure) {
            var today = new Date();
            today.setTime(today.getTime());
            if (expires) {
                expires = expires * 1000 * 60 * 60 * 24;
            }
            var expires_date = new Date(today.getTime() + (expires));
            document.cookie = name + "=" + ( value ) + /*escape value*/
            ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
            ( ( path ) ? ";path=" + path : "" ) +
            ( ( domain ) ? ";domain=" + domain : "" ) +
            ( ( secure ) ? ";secure" : "" );
        },
        deleteCookie: function (name, path, domain) {
            if (getCookie(name)) document.cookie = name + "=" +
            ( ( path ) ? ";path=" + path : "") +
            ( ( domain ) ? ";domain=" + domain : "" ) +
            ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        },
        /*
         //quick getElement reference
         $: function () {
         var elements = [], element, i = 0, n = arguments.length;
         for (; i < n; i++) {
         element = arguments[i];
         if (typeof element == 'string')
         element = document.getElementById(element);
         if (n === 1)
         return element;
         elements.push(element);
         }
         return elements;
         },
         */
//http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        invoke: function (constr, args) {
            function F() { // constructor returns **this**
                return constr.apply(this, args);
            }

            F.prototype = constr.prototype;
            var f = new F();
            f.constructor = constr; //reset constructor property
            return f; //returns instance
        },

        /* Object-oriented Helper functions. */
        //prototype inheritance
        clone: function (object) {
            function F() {
            }
            F.prototype = object;
            return new F;
        },

        cloneLoop: function (/*array of strings*/) {
            //called in context of current instance
            this.$els = {};
            var  core = Bar.Core,
            i = 0, arg = arguments, str;
            while (arg[i]) {
                str = arg[i];
                this.$els[str] = core.clone(Bar.$$);
                i++;
            }
        },

        mix: function (parent, child) {//shallow copy
            var i;
            child = child || {};
            for (i in parent) {
                //NOTE a cloned object of base prototype will NOT have any OWN properties
                //below will NOT overwrite an existing member
                if (!child.hasOwnProperty(i)) {
                    child[i] = parent[i];
                }
            }
            return child;
        },

        mixIn: function () {
            var i = 0, args = arguments,
                prop, child = {};
            while (args[i]) {
                for (prop in args[i]) {
                    if (args[i].hasOwnProperty(prop)) {
                        child[prop] = args[i][prop];
                    }
                }
            }
            return child;
        },

        simpleMix: function (parent, child) {//shallow copy
            //takes an array of objects
            var i = 0, p, child = child || {};
            while (parent[i]) {
                for (p in parent[i]) {
                    child[p] = parent[i][p];
                }
                i++;
            }
            return child;
        },

        //http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/
        fromPrototype: function (prototype, object) {
            if(!prototype) return;
            var newObject = Object.create(prototype),
                p, o = object || {};
            for (p in o) {

                if (o.hasOwnProperty(p)) { //important

                    if (typeof o[p] === 'object') { //with amend
                        this.fromPrototype(prototype, o[p])
                    }
                    newObject[p] = o[p];
                }
            }
            return newObject;
        },

        extend: (function () {
            var F = function () {
            };
            return function (C, P) {
                //console.log(629, arguments.callee.caller);
                F.prototype = P.prototype;
                C.prototype = new F();
                C.prototype.constructor = C;
                C.uber = P.prototype;
                if (P.prototype.constructor === Object.prototype.constructor) {
                    P.prototype.constructor = P;
                }
            }
        }()),

        augment: function (receivingClass, givingClass) {
            var methodName, i = 2, args = arguments, len = args.length;
            if (arguments[2]) { // Only give certain methods.
                for (; i < len; i++) {
                    receivingClass.prototype[args[i]] = givingClass.prototype[args[i]];
                }
            }
            else { // Give all methods.
                for (methodName in givingClass.prototype) {
                    if (!receivingClass.prototype[methodName]) {
                        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
                    }
                }
            }
        }
    };
}());

//function r(f){/in/(document.readyState)?setTimeout(r,9,f):f()}
// Static class method.


Bar.Core.Interface.ensureImplements = function (object /*interface1, interface2...*/) {
    if (!object) {
        // throw new Error("No instance provided");
        return;
    }
    var i, j,
        len = arguments.length,
        inter_face, methodsLen, method,
        instr = "Function Interface.ensureImplements ";

    if (arguments.length < 2) {
        throw new Error(instr + "called with " + arguments.length + "arguments, but expected at least 2.");
    }
    for (i = 1; i < len; i++) {
        inter_face = arguments[i]; //interface is an instance of Interface
        methodsLen = inter_face.methods.length;
        if (inter_face.constructor !== Bar.Core.Interface) {
            throw new Error(instr + "expects arguments two and above to be instances of Interface.");
        }
        for (j = 0; j < methodsLen; j++) {
            method = inter_face.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error(instr + "object does not implement the " + inter_face.name + " interface. Method " + method + " was not found.");
            }
        }
    }
};
Bar.Core.Interface.Lib = {
    Composite: ['addChild', 'removeChild', 'getChild', 'getAllLeaves'/*, 'goFetch'*/],
    Visitor: ['accept'],
    Element: ['getElement'],
    Display: ['hide', 'show']
};

Bar.Core.Interface.Init = function (o) {
    var methods = o.methods || this.Lib[o.str],
        I = new this(o.str, methods);
    this.ensureImplements(o.object, I);
};

Function.prototype.method = function (name, fn, _static, override) {
    if (_static) {
        if (!this[name]) {
            this[name] = fn;
        }
    } else {
        if (!override && !this.prototype[name]) {
            this.prototype[name] = fn;
        }
    }
    return this;
};

if (typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function (thisArg) {
        var fn = this,
            args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(thisArg, args.concat(slice.call(arguments)));
        };
    };
}

if (typeof Function.prototype.wrap === 'undefined') {
    Function.prototype.wrap = function(wrapper) {
        var _method = this;
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return wrapper.apply(this, [_method.bind(this)].concat(args));
            //return wrapper.apply(this, [_method].concat(args));
        }
    };
}

/*
 function Publisher() {
 this.subscribers = [];
 }
 Publisher.prototype.fire = function(data) {
 this.subscribers.forEach(
 function(fn) {
 fn(data);
 }
 );
 return this;
 };

 Function.prototype.subscribe = function(publisher) {
 var that = this;
 var alreadyExists = publisher.subscribers.some(
 function(el) {
 if ( el === that ) {
 return;
 }
 }
 );
 if ( !alreadyExists ) {
 publisher.subscribers.push(this);
 }
 return this;
 };

 Function.prototype.unsubscribe = function(publisher) {
 var that = this;
 publisher.subscribers = publisher.subscribers.filter(
 function(el) {
 if ( el !== that ) {
 return el;
 }
 }
 );
 return this;
 };
 */
var EventCache = function () {
    var listEvents = [];
    return {
        listEvents: listEvents,
        add: function (node, sEventName, fHandler) {
            listEvents.push(arguments);
        },
        flush: function () {
            var i, item;
            for (i = listEvents.length - 1; i >= 0; i = i - 1) {
                item = listEvents[i];
                if (item[0].removeEventListener) {
                    item[0].removeEventListener(item[1], item[2], item[3]);
                }
                if (item[1].substring(0, 2) != "on") {
                    item[1] = "on" + item[1];
                }
                if (item[0].detachEvent) {
                    item[0].detachEvent(item[1], item[2]);
                }
                item[0][item[1]] = null;
            }
        }
    };
}();


Array.prototype.isEmpty = function () {
    return this.length === 0;
};

if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {
        }

        F.prototype = o;
        return new F();
    };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
}

if (!Array.isArray) {
    Array.prototype.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}


Element.prototype.prependChild = function(child) { this.insertBefore(child, this.firstChild); };
/*
 if unNamed function (for examp) F.uber.constructor.apply(this, arguments);
 this.constructor.uber.constructor.apply(this, arguments);

//empty
 document.getElementById("container").innerHTML = null;

 var c = document.getElementById("container");
 while (c.lastChild) c.removeChild(c.lastChild);

 function Each(obj, fn) {
 if (obj.length) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
 else for (var p in obj) if (fn(obj[p], p) === false) break;
 };

 */