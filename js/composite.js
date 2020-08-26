//defaults for a composite or leaf, composite 'inherits' from leaf
Bar.Component = function () {

    var found,//used to register 'current' comp objects
        core = Bar.Core,
        iterator = Bar.Iterator,
        proto = core.fromPrototype;
    ///all composites have access to this

    return {

        Leaf: {

            //this should be abstract
            init: function ($element) {
                core.Interface.Init({str: 'Element', object: $element});
                this.$element = $element;
            },
            addChild: function () {
            },
            removeChild: function () {
            },
            getChild: function (i) {
            },
            findChild: function () {
            },
            getParent: function () {
                return this.p;
            },
            setParent: function (p) {
                this.p = p;
            },
            getAllLeaves: function () {
            },
            getElement: function (flag) {
                var $el = this.$element;
                return flag ? $el.getElement() : $el;
            },
            findElement: function (arg) {
                // console.log(arg, this.getElement(true), 'findIt')
                if (arg === this.getElement(true)) {
                    return this;
                }
                return null;
            },

            setFound: function (arg) {
                found = arg;
            },

            getFound: function () {
                return found;
            },
            //leaf or comp
            postTarget: function(){}

        },

        Composite: {

            //abstract
            init: function ($element) {
                this.children = proto(Bar.Iterator([]));
                if ($element) {//not mandatory
                    core.Interface.Init({str: 'Element', object: $element});
                    this.$element = $element;
                }
            },

            addChild: function (child) {
                Bar.Core.Interface.Init({str: 'Composite', object: child});
                child.setParent(this);
                this.children.addItem(child);
            },

            removeChild: function (child) {
                this.children.removeItem(child);
            },

            getChild: function (i) {
                return this.children.getItem(i);
            },

            findElement: function (arg) {
                return arg === this.getElement(true);
            },

            getElement: function (flag) {
                var $el = this.$element;
                if ($el) {
                    return flag ? $el.getElement() : $el;
                }
                return null;
            },
            //this COULD replace COMPOSITE methods like SHOW or HIDE,
            visitAll: function (func) {
                //assumes func is a string
                var k = this.children;
                k.rewind();
                while (k.hasNext()) {
                    k.getNext()[func]();
                }
            },

            ///nerve centre
            findChild: function (arg) {

                var k = this.children,
                    current;

                this.setFound(null);
                k.rewind();

                while (k.hasNext()) {
                    current = k.getNext();

                    if (current.findElement(arg)) {
                        this.setFound(k.getLast());
                    }
                }
                //if not found search grandchildren.....
                if (!this.getFound()) {
                    k.rewind();
                    while (k.hasNext()) {
                        k.getNext().findChild(arg);
                    }
                }
            },

            getTarget: function (leaf) {
                var newleaf = leaf.parentNode || null, res;
                this.findChild(leaf);
                if (!this.getFound()) {
                    if (newleaf) {
                        return this.getTarget(newleaf);
                    }
                }
                else {
                    return newleaf;
                }
            },

///not used but see chapter 16 http://www.apress.com/9781590599082?gtmf=s
            getAllLeaves: function () {
                var k = this.children,
                    leaves = k.getData();
                k.rewind();
                while (k.hasNext()) {
                    leaves.concat(k.getNext().getAllLeaves());
                }
                return leaves;
            }
        }//comp

    };//object
}();

Bar.Display = {

    //abstract?
    Leaf: {

        hide: function (klas) {
            this.getElement().removeClass('current');
            if(klas) { this.getElement().removeClass(klas); }
        },

        show: function (klas) {
            klas = klas || 'current';
            this.getElement().addClass('current');
            if(klas) { this.getElement().addClass(klas); }
        }
    },

    // concrete// must implement Composite
    Composite: {

        hide: function () {
            var k = this.children;
            k.rewind();
            while (k.hasNext()) {
                k.getNext().hide();
            }
        },

        show: function () {
            var k = this.children;
            k.rewind();
            while (k.hasNext()) {
                k.getNext().show();
            }
        }

    }
};

Bar.FrameManager = {

    init: function init($element){

      if(!$element){return;}

        var element = $element.getElement(),
            that = this;
        this.frame = element;
        this.frameMaker(element, true);
        this.frag = null;
        //fix
        if(element.form) {  return; }
        $element.addEvent(element, 'click', function(e) {
           if(e.target.form) { return; }

            //allows for external links
            if (e.target && e.target.href &&
                e.target.href.indexOf(document.domain) === -1) {
                return false;
            }


           // e.stopPropagation();
            that.requestBridge('GET', e.target.href);
        }.bind(that));

        this.header = {
            show: function () {
                that.frame.appendChild(that.frag.children[0]);
            },
            hide: function () {
                that.frag.insertBefore(that.frame.children[0], that.frag.children[0]);
            }
        };
    },

    //frame of manager and managed is SAME for first run
    //contents have to be stored in a document fragment when not current
    frameMaker: function(element, flag){

        var frame = this.createFrame(element, flag);//factory
        if(element){
            this.frameModule = frame.init(element, this);
        }
        else if(flag) {
          this.frame.appendChild(this.frag);//clear frag
            //start over, avoids having to check frag status
            this.frameModule = frame.init(this.frame, this);
        }
    },

    setCurrent: function(element){
        if(!this.frameModule) { return false; }
         this.frameModule.clear();
         this.frameMaker(element, !element);
    },

    append: function (node) {
        this.frame.appendChild(node);
    },

    createFrame: function(element, flag){

        function recipe(){
            return element.children[0].id === 'csstabs';
        }

        var mix = flag ? this.Frames.offPage : null,
            page = this.Frames.onPage;
            if(!flag && !recipe() && !this.decorated){
              // this.decorate(this.Frames.onPage);
              //  this.decorated = true;
            }
            return Bar.Core.fromPrototype(this.Frames.onPage, mix);
    },

    decorate: function(proto){
        var append = function(orig){
            this.manager.header.show();
            orig();
            },
            clear = function(orig){
            this.manager.header.hide();
            orig();
        };

        proto.append = proto.append.wrap(append);
        proto.clear = proto.clear.wrap(clear);
    },

    Frames: {

    onPage: {

        init: function (element, manager) {
            this.frame = element;
            this.manager = manager;
            this.append();
            return this;
        },

        append: function () {
           // this.manager.header.show();
            var frame = this.frame;
            while (frame.hasChildNodes()) {
                this.manager.append(frame.firstChild);
            }
        },

        clear: function () {
          //  this.manager.header.hide();
            var frame = this.manager.frame;
            while (frame.hasChildNodes()) {
                this.frame.appendChild(frame.firstChild);
            }
        }

    },

    offPage: {

        append: function () {//performed by manager, but keep as null operator
            // this.manager.frame.appendChild(this.getStore());
        },

        clear: function () {//to frag
            var frame = this.manager.frame;
            this.target = document.createDocumentFragment();
            while (frame.hasChildNodes()) {
                this.target.appendChild(frame.removeChild(frame.firstChild));
            }
            this.manager.frag = this.target;
        }
    }
}
};

/* AjaxHandler interface. */
//var AjaxHandler = new Bar.Core.Interface('AjaxHandler', ['request', 'createXhrObject']);
/* SimpleHandler class. */
// implements AjaxHandler

Bar.Core.SimpleHandler = function () {

    var Core = Bar.Core,

        count = 3,

        callback = {

            success: function (xhr/*, event*/) {
                count = 3;
                /*too late to preventDefault
                event.preventDefault();*/
                var res = this.getContent(parse(xhr));
                if(res) {
                    this.fire('GET', res, true);
                }
            },

            failure: function (xhr) {

                console.log('try one more');
                if(count % 2){//ie 1
                    this.request.apply(arguments);
                    count--;
                    return;
                }

                xhr.abort();
                console.log('Failure: ' + xhr.status);
            }
        };

    function parse(xhr) {
        var parser = new DOMParser();
        return parser.parseFromString(xhr.responseText, "text/html");
    }

    function createXhrObject() { // Factory method.
        var methods = [
            function () {
                return new XMLHttpRequest();
            },
            function () {
                return new ActiveXObject('Msxml2.XMLHTTP');
            },
            function () {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ], i = 0, len = methods.length;

        for (; i < len; i++) {
            try {
                methods[i]();
            }
            catch (e) {
                continue;
            }

            // If we reach this point, method[i] worked.
            createXhrObject = methods[i]; // Memoize the method.
            return createXhrObject();
        }

        // If we reach this point, none of the methods worked.
        throw new Error('SimpleHandler: Could not create an XHR object.');
    }


    function createGetContent(url){

        function home(){
            return url === location.href;
        }

        function hash(){
            return location.href  === split[0];
        }

        function seek(node){
            return node && node.nodeName !== 'DIV';
        }

        /*
         CONTENTS of node get appended not node itself,
         to include return parent of node
         */
        function check4ID(node){
            return node.parentNode;
        }

        if(!url) return;
        var that = this,
            split = url.split('#');

        //set strategy; simple factory
        if (home()){
            this.getContent = function () {
                return null;
            };
        }
        else if(hash()) {
            this.getContent = function () {
                return Core.$(split[1]);
            };
        }
        else {
            this.getContent = function (doc) {
                var node = doc.getElementById('content');
                if(!node){
                    doc = doc.body;
                    while (seek(doc)) {
                        doc = doc.children[0];
                    }
                    return check4ID(doc);
                }
                return node;
            };
        }

    }

    return {

        request: function (conf) {

            var xhr = createXhrObject(), that = this,
                method = conf.method, url = conf.url, postVars = conf.postVars;

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
               var func = xhr.status === 200 ? 'success' : 'failure';
                   callback[func].call(that, xhr);
            };
            xhr.open(method, url, true);
            if (method !== 'POST') postVars = null;
            // xhr.setRequestHeader('Content-Type', "text/xml");
            xhr.send(postVars);
        },


        requestBridge: function(method, url){

            if(!url){ return; }

            var that = this,
                post = method === 'POST',//temp
            conf = {method: method, url: url, postVars: post};

            createGetContent.call(this, url);

            that.request(conf);

           //setTimeout(function(){ that.request(conf); },1000);
        }
    }

}();