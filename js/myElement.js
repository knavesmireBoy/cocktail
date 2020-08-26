
Bar.Core.Element = (function(){

    var show = 'show',
        hide = 'hide',
        _append = false,
        slice = Array.prototype.slice,

        getNode = function(el){
            if(!el) return null;
        try {
            return el.getElement();
        }
        catch(el){
            return el;
        }
    },

    getNextElement = function(node, flag) {
        var direction = flag ? 'nextSibling' : 'previousSibling';

        //console.log(arguments.callee.caller.toString())
        if (node.nodeType === 1) {
            return node;
        }
        if (node[direction]) {
            return getNextElement(node[direction], flag);
        }
        return null;
    },

        hasClass = function( klas) {/*bool*/
            var pattern = new RegExp('(^| )' + klas + '( |$)'), el = this.getElement();
            return !!pattern.test(el.className);
        };

    return {

        init: function(el, parent) {

            if(!el) { return null; }
            if (typeof el === 'string') {
                this.element = document.getElementById(el);
                this.element = this.element ? this.element : document.createElement(el);
            } else {
                this.element = el;
            }

             try {
             parent.append(this);
             this.frag = false;
             }
             catch(e) {
             try {
             parent.appendChild(this.element);
             this.frag = false;
             }
             catch (e) {
             return this;
             }
             }

            return this;
        },

        frag: false,

        isFragment: function(){
            return this.frag;
        },

        addEvent: function(elm, evType, fn, useCapture) {

            useCapture = useCapture || false;//added

            var add = function() {

                if (elm.addEventListener) {
                    elm.addEventListener(evType, fn, useCapture);
                    return true;
                }
                else if (elm.attachEvent) {
                    return elm.attachEvent('on' + evType, fn);
                }
                else {
                    elm['on' + evType] = fn;
                }
            };
            add();
            return this;
        },

        classed: function(arg){
            return hasClass.call(this, arg);
        },

        show: function (klas) {
            this.element.className = klas || show;
            return this;
        },
        hide: function (klas) {
            this.element.className = klas || hide;
            return this;
        },

        setAttr: function (attr, txt) {
            this.element.setAttribute(attr, txt);
            return this;
        },

        setText: function (txt) {
            var el = this.elements[this._i];
            while (el && el.firstChild) {
                el = el.firstChild.nodeType === 1 ? el.firstChild : el;
            }
            el.appendChild(txt);
            return this;
        },

        setAttrs: function (conf) {
            for (var p in conf) {
                this.setAttr(p, conf[p])
            }
            return this;
        },

        append: function(el, bool){
            el = getNode(el);
            if(!bool) {this.element.appendChild(el);}
            else{ el.appendChild(this.element)}
            return this;
        },

        addClass: function(klas) {
            var el = this.getElement(),
                str = el.className,
                concat = function(a, b){
                    return a + ' ' + b;
                };
           if (!hasClass.call(this, klas)) {
                el.className = str === '' ? klas : concat(str, klas);
            }
            return this;
        },

        removeClass: function(cls) {
         var el = this.getElement();
            if (hasClass.call(this, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                el.className = el.className.replace(reg, ' ');
            }
        },

        wrap: function(){
            /*
             org_html = document.getElementById("slidesContainer").innerHTML;
             new_html = "<div id='slidesInner'>" + org_html + "</div>";
             document.getElementById("slidesContainer").innerHTML = new_html;
             */

        },

        insertAfter: function(New, tgt) {
            New = getNode(New);
            tgt = getNode(tgt);
            var parent = tgt.parentNode;
            if (parent.lastChild === tgt) {
                parent.appendChild(New);
            } else {
                parent.insertBefore(New, tgt.nextSibling);
            }
            return this;
        },

        replaceChild: function(New, tgt){
            New = getNode(New);
            tgt = getNode(tgt);
            this.getParent().replaceChild(New, tgt)
        },

        removeChild: function(el){
            this.getParent().removeChild(el);
        },

        each: function (fn) {
            var i = 0,
                els = this.elements,
                n = els.length;
            for (; i < n; i++) {
                fn.call(this, els[i]);
            }
            return this;
        },

        setContent: function(content){
            this.element.innerHTML = content;
            return this;
        },

        getContent: function(content){
            return this.element.innerHTML;
        },

        //don't chain
        getElement: function (callback) {
           // callback.call(this);
            return this.element;
        },
        getParent: function(){
            return this.element.parentNode;
        }
    };

})();