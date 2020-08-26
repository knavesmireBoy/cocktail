//implements Component, Display
Bar.Page = (function () {


    var Core = Bar.Core,
        Leaf = Bar.Component.Leaf,
        Comp = Bar.Component.Composite,
        dLeaf = Bar.Display.Leaf,
        dComp = Bar.Display.Composite,
        slice = Array.prototype.slice,
        config = {
            tabHolder: 'csstabs',
            tabs: 'tabbox',
            nav: 'nav',
            content: 'content',
            dash: 'dash',
            tab3: 'tab3',
            form: 'form'
        };

     function Constr(){}

    Constr.prototype = {

        constructor: Constr,

        setUp: function (anchor) {

            function prepCompBuilder(parent) {
                var args = slice.call(arguments, 1);
                /*returned function is a callback provided to an array iterative method,
                 the arguments to the outer function would be a list of mixins for use with compBuilder
                 */
                return function (el) {
                    //concat: place element in an array and concat with outer function arguments
                    var comp = compBuilder.apply(null, [el].concat(args));
                    parent.addChild(comp);
                    comp.on('GET', 'setCurrent', FrameManager);
                    comp.on('GET', 'onLoaded', that);
                }
            }

            function displayInput (e) {

                var head = Core.$(null, 'head')[0],
                    style = "<style>" + "#dash + input { width: 8.8em }" + "</style>",
                    parser = new DOMParser(),
                    doc = parser.parseFromString(style, "text/html");

                head.appendChild(doc.getElementsByTagName('style')[0]);

                if (this.element.checked) {
                    var $new = Core.fromPrototype(Core.Element),
                        conf = {type: 'text', name: 'bitters', value: 'Angostura'};
                    this.insertAfter($new.init('input').setAttrs(conf), this);
                }
                else {
                    this.removeChild(this.element.nextSibling);
                }

            }


               var that = this,
                   compBuilder = this.compBuilder(),
            target = {
                    postTarget: function (e) {
                        //make HAS A??
                        this.requestBridge('GET', this.getElement(true).href);
                    }
                },
                $dash = Core.fromPrototype(Core.Element),
                dash = Core.$(config.dash),
                tabs, callback, FrameManager,


                myHandler = Core.fromPrototype(Core.SimpleHandler),
                body = Core.$(null, 'body')[0],
                content = Core.$(config.content),
                nav = Core.$(config.nav);

            //get to work...

            body.className = 'js';


            if (nav) {
                tabs = slice.call(nav.getElementsByTagName('a')),
                    nav = compBuilder(nav, Leaf, Comp, dComp),
                    callback = prepCompBuilder(nav, Leaf, dLeaf, myHandler, target, Bar.Observer),
                    //if!content
                    //  content = content || Core.$(config.tabHolder),
                    FrameManager = compBuilder(content, Bar.FrameManager, Core.SimpleHandler, Bar.Observer);
                tabs.forEach(callback);


                if (anchor) {
                    nav.getTarget(anchor);
                    nav.getFound().postTarget();
                }//trigger


                //nav.getElement(true) == raw Element; nav.getElement(/*false*/) == wrapped element
                nav.getElement().addEvent(nav.getElement(true), 'click',
                    function (e) {
                        nav.getTarget(e.target);
                        if (that.onPage(e)) {
                            this.getFound().postTarget();
                        }
                        //  else {console.log(this.getFound().getElement(true).href)}
                    }.bind(nav)
                );
            }//nav?

           if(dash){
                $dash.init(dash).addEvent($dash.getElement(), 'change', displayInput.bind($dash));
            }

        },

        onPage: function (e) {  //deal with IE here
            var url = e.target.href, res = false,
            //omit the doc name from full url, the second arg (0) EXCLUDES everything past the lastIndex
                pathname = url.substring(url.lastIndexOf('/') + 1, 0),
            //INCLUDE everything past the last slash
                doc = url.substring(url.lastIndexOf('/') + 1),
            //allows for hardcoded index.html/php, which we're not interested in
                sub = (doc.indexOf('html') !== -1
                    || doc.indexOf('php') !== -1)
                    && doc.indexOf('index') === -1;

            if (pathname !== location.href) {//nav to other page
                window.name = url;
                e.target.href = sub ? pathname : url;
            }
            else {
                /*if(doc){
                    e.target.href = url;
                    return true;
                }*/
                if(e.preventDefault && doc){
                    e.preventDefault();
                }
                else  e.returnValue = false;

                res = true;
            }//stay on page, load data
            return res;
        },

        preLoad: function (/*DomContentLoaded*/) {
            var anchors = document.getElementsByTagName('a'), anchor;
            if (window.name) {
                anchor = this.checkWindow(anchors);
                window.name = '';
            }
            this.setUp(anchor);
        },

        checkWindow: function (data) {
            var i = 0, node;
            while (data[i]) {
                node = data[i];
                if (node.href && node.href === window.name) {
                    window.name = '';
                    return node;
                }
                i++;
            }
            return null;

        },

        TabViewer: {//subclasses of Composite

            showTab: function (child, klas) {
                //or publish
                //this.visitAll('hide');
                this.hide();
                child.show(klas);
            },

            //could decorate original addChild, or provide a callback, but then a context...
            addChild: function (child) {
                Bar.Core.Interface.Init({str: 'Composite', object: child});
                child.setParent(this);
                this.children.addItem(child);
                this.showTab(child);
            },

            postTarget: function () {
                this.showTab(this.getFound(), 'onclick');
            }

        },

        requiredModule: {//subclasses of Composite

            init: function(element){
                var el = Core.fromPrototype(Core.Element);
                this.$element = el(element);
            },

            show: function () {
                this.getElement(true).required = true;
            },

            hide: function () {
                this.getElement(true).required = false;
            },

            isActive: function(){//strategy
                return this.getElement(true).required;
            },

            getElement: function(flag){
                if(flag) return this.$element.getElement();
                return this.$element;
            }

        },

        enabledModule: {//subclasses of Composite

            init: function(element){
                var el = Core.fromPrototype(Core.Element);
                this.$element = el(element);
            },

            show: function () {
            },

            hide: function () {
            },

            isActive: function(){//strategy
                return this.getElement(true).value;
            },

            getElement: function(flag){
                if(flag) return this.$element.getElement();
                return this.$element;
            }

        },

        conditionalInputModule: {//subclasses of Composite

            init: function(anchor, tag, conf){
                this.anchor = anchor;
                if(this.isActive()){
                    this.show(tag, conf)
                }
            },

            show: function (tag, conf) {
                if(!tag || !conf) return;
                this.hide();
                var el = Core.fromPrototype(Core.Element);
                this.$element = el.init(tag).setAttrs(conf);
                this.anchor.insertAfter(this.$element, this.anchor);
                this.present();
            },

            hide: function () {
                this.anchor.removeChild(this.getElement(true));
            },

            isActive: function(){//strategy
                return this.anchor.isActive();
            },

            present: function(){
                var head = Core.$(null, 'head')[0],
                    style = "<style>" + "#dash + input { width: 8.8em }" + "</style>",
                    parser = new DOMParser(),
                    doc = parser.parseFromString(style, "text/html");
                head.appendChild(doc.getElementsByTagName('style')[0]);
            },

            getElement: function(flag){
                if(flag) return this.$element.getElement();
                return this.$element;
            }

        },

        compBuilder: function () {

            var Core = Bar.Core,
                slice = Array.prototype.slice;

            //clone a series of prototypes
            function fromPrototype(prototype) {
                fromPrototype.data = fromPrototype.data || [];
                fromPrototype.data.push(Object.create(prototype));
            }

            function isElement(arg) {
                if (!arg) return;
                //arg may be  a string
                if (!arg.innerHTML) {
                    arg = Core.$(arg);
                }
                return arg && arg.innerHTML;
            }

            return function (elem) {

                var el = Core.fromPrototype(Core.Element),
                    mixins = arguments.length > 1 ? slice.call(arguments, 1) : [],
                    comp;

                mixins.forEach(function (mixin) {
                    fromPrototype(mixin);
                });

                //an array of cloned objects that point to a prototype
                comp = Core.simpleMix(fromPrototype.data);
                fromPrototype.data = null;  //reset

                if (comp.init) {
                    if (elem && isElement(elem)) {
                        comp.init(el.init(elem));
                    }
                    else {
                        comp.init();
                    }
                }
                return comp;
            };
        },

        onLoaded: function () {

            function prepCompBuilder(parent) {
                var args = slice.call(arguments, 1);
                return function (el) {
                    //concat: place element in an array and concat with outer function arguments
                    var comp = compBuilder.apply(null, [el].concat(args));
                    parent.addChild(comp);
                }
            }

            function appendAll(src, tgt) {
                while (src.hasChildNodes()) {
                    tgt.append(src.firstChild);
                }
            }


            if (Core.$(config.tabHolder)) {

                var compBuilder = this.compBuilder(),
                    box = compBuilder(config.tabHolder, Leaf, Comp, dComp, this.TabViewer),
                callback = prepCompBuilder(box, Leaf, dLeaf),

                tabs = Core.convert2Array(config.tabs);

                tabs.forEach(callback);

                box.getElement().addEvent(box.getElement(true), 'click',
                    function (e) {
                        box.getTarget(e.target);
                        box.postTarget();
                    }.bind(box)
                );

            }
        }

    };

    return Constr;


}());
var page = new Bar.Page();
document.addEventListener("DOMContentLoaded", page.preLoad.bind(page));
/*

 BroadcastCommand = {

 init: function(receiver){
 this.receiver = receiver;
 },

 execute: function(element){
 this.receiver.setCurrent(element);
 },

 undo: function(element){
 this.receiver.setCurrent(element);
 }

 },

 BroadcastCommandDecorator = {

 init: function(command){
 this.command = command;
 },

 execute: function(){
 this.undoStack.push(this.command);
 this.command.execute();
 },

 undo: function(element){
 this.command.undo();
 }

 },
 */