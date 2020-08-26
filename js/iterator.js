Bar.Iterator = function (data) {

//need to
    function testType() {
        data = data || arguments[0];
        if (!data) return false;
        if (isHash()) {
            return 'Object';
        }
        else if (isArray()) {
            return 'Array';
        }

        else if (isHTML()) {
            return 'Array';
        }

        else if (isArgument()) {
            return 'Array';
        }

        else {
            return null;
        }
    }

    function isHash(arg) {
        data = arg ? arg : data;
        return ops.call(data).slice(8, -1) === ostr;
    }

    function isArray(arg) {
        data = arg ? arg : data;
        return ops.call(data).slice(8, -1) === astr;
    }

    function isHTML(arg) {
        data = arg ? arg : data;
        return ops.call(data).slice(8, -1) === hstr;
    }

    function isArgument(arg) {
        data = arg ? arg : data;
        return data.callee;
    }

    var astr = 'Array',
        ostr = 'Object',
        hstr = 'HTMLCollection',
        ops = Object.prototype.toString,
        slice = Array.prototype.slice;

    function iterator(obj) {

        var data, index = 0, keys,
            addItem, removeItem, rewind, found;

        //common methods for hash and array types
        function getData() {
            return data;
        }

        function getIndex() {
            return index;
        }

        function getLength() {
            return keys.length;
        }

        function getItem(i) {
            return data[i];
        }

        function findItem(arg) {
            this.rewind();
            var current = this.getItem(arg);
            if(!current) {
                while (this.hasNext()) {
                    if (this.getNext() === arg) {
                        return this.getLast();
                    }
                }
            }
            return current;
        }///functions

        if (obj.type === 'Array') {

            data = slice.call(obj.data);
            //private methods
            addItem = function (arg) {
                data.push(arg);
            };

            removeItem = function (i) {
                data.splice(i, 1);
            };

            return {

                getData: getData,

                getIndex: getIndex,

                getLength: getLength,

                getItem: getItem,

                findItem: findItem,

                rewind: function () {
                    index = 0;
                    return data[index];
                },

                hasNext: function () {
                    return index < data.length;
                },

                getCurrent: function () {
                    return data[index];
                },

                getLast: function () {
                    return data[index - 1];
                },

                getNext: function () {
                    var element;
                    if (!this.hasNext()) {
                        return null;
                    }
                    element = data[index];
                    index++;
                    return element;
                },

                addItem: function () {
                    var args = slice.call(arguments), i = 0;
                    while (args[i]) {
                        //allows for adding to current Array
                        if (isArray(args[i]) && args[1] && typeof args[1] === 'boolean') {
                            data = data.concat(args[i]);
                            break;
                        }
                        else {
                            //or adding member as an Array
                            addItem(args[i]);
                        }
                        i++;
                    }
                },

                removeItem: function (arg) {
                    var current = this.getItem(arg), args, i = 0;

                    if (current) {
                        removeItem(arg);
                        return;
                    }
                    args = slice.call(arguments);
                    while (args[i]) {
                        this.findItem(args[i]);
                        i++;
                        //if found
                        if (this.getCurrent()) {
                            removeItem(index - 1);
                        }
                    }
                },

                toString: function () {
                    return console.log(data.toString());
                }


            };   //object

        }//if array

        else {
            data = obj.data;
            keys = Object.keys(data);

            //private methods

            removeItem = function (i) {
                delete data[keys[i]];
                keys = Object.keys(data);//reRun
            };

            addItem = function (n, v) {
                data[n] = v;
                keys = Object.keys(data);//reRun
            };

            return {

                getData: getData,

                getIndex: getIndex,

                getLength: getLength,

                getItem: getItem,

                findItem: findItem,

                rewind: function () {
                    index = 0;
                    return data[keys[index]];
                },

                hasNext: function () {
                    return index < keys.length;
                },

                getCurrent: function () {
                    return data[keys[index]];
                },

                getLast: function () {
                    return data[keys[index - 1]];
                },

                getNext: function () {
                    var element;
                    if (!this.hasNext()) {
                        return null;
                    }
                    element = data[keys[index]];
                    index++;
                    return element;
                },

                addItem: function (arg) {
                    if (isHash(arg)) {
                        for (var p in arg) {
                            addItem(p, arg[p])
                        }
                    }
                    else {
                        addItem.apply(null, arguments);
                    }
                },

                removeItem: function (arg) {
                    var current = this.getItem(arg), p;
                    if (current) {
                        removeItem(arg);
                        return;
                    }
                    if (isHash(arg)) {
                        for (p in arg) {
                            //sets index
                            this.findItem(arg[p]);
                            if (this.getCurrent()) {
                                removeItem(index - 1);
                            }
                        }
                    }
                    else {
                        this.findItem(arg);
                        if (this.getCurrent()) {
                            removeItem(index - 1);
                        }
                    }

                },

                toString: function () {
                    return console.log(JSON.stringify(data));
                }

            };
        }//else
    }//iterator


    try {
        return iterator({type: testType(), data: data});
    }
    catch (e) {
        throw new Error('Data is neither an Object or Array');
    }

};

