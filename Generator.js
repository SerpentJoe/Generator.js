Generator = (function() {
    
    function Generator(g) {
        _addMethodsWithPrivateAccess.call( this, _transformInput(g) );
        this.toString = _toString;
    }
    
    var _toString = function() {
        // Defining this in the prototype interferes with inspecting
        //   said prototype
        return "[object Generator]";
    };
    
    function _transformInput( g ) {
        var result;
        if( typeof g === "object"
                && "toString" in g
                && typeof g.toString === "function"
                && g.toString() === "[object Generator]" ) { // [gG]enerator
            result = g;
        } else if( typeof g === "object"
                && "length" in g
                && typeof g.length === "number"
                && g.length >= 0 ) {                     // array or arraylike
            result = (function() {
                    var currIndex;
                    for( currIndex = 0; currIndex < g.length; currIndex++ ) {
                        yield g[currIndex];
                    }
                })();
        } else {                                         // non-arraylike object
            result = (function() {
                    var currKey;
                    for( currKey in g ) {
                        yield currKey;
                    }
                })();
        }
        
        return result;
    }
    
    function _addMethodsWithPrivateAccess(g) {
        this.__iterator__ = function() {
            return new GeneratorIterator(g);
        };
        this.next = function() {
            return g.next();
        };
    }
    
    // Assign this.next only so it will show up in Generator.prototype
    Generator.prototype.next = function() {
        overridden_in_constructor;
    };
    
    Generator.prototype.map = function( callback ) {
        return new Generator((function(g) {
                var curr;
                for( curr in g ) {
                    yield callback( curr );
                }
            })(this));
    };
    
    Generator.prototype.reduce = function( callback, initial ) {
        var curr,
            accum;
        
        if( arguments.length === 1 ) { // initial not specified
            try {
                accum = this.next();
            } catch(e) { // no initial AND Generator empty
                return;
            }
        } else {
            accum = initial;
        }
        
        for( curr in this ) {
            accum = callback( accum, curr );
        }
        
        return accum;
    };
    
    Generator.prototype.filter = function( callback ) {
        return new Generator((function(g) {
                var curr;
                for( curr in g ) {
                    if( callback( curr )) {
                        yield curr;
                    }
                }
            })(this));
    };
    
    Generator.prototype.count = function() {
        var curr,
            i = 0;
        for( curr in this ) {
            i++;
        }
        return i;
    };
    
    Generator.prototype.first = function( search ) {
        var curr;
        for( curr in this ) {
            if( search( curr )) {
                return curr;
            }
        }
        return;
    };
    
    Generator.prototype.take = function( n ) {
        return new Generator((function(gen){
                var i;
                for( i = 0; i < n; i++ ) {
                    yield gen.next();
                }
            })(this));
    };
    
    // Consume first n values and throw them away
    Generator.prototype.reject = function( n ) {
        var i;
        for( i = 0; i < n; i++ ) {
            this.next();
        }
        return this;
    };
    
    Generator.prototype.join = function( sep ) {
        var callback = function(a, o) {
                return a + sep + o.toString();
            },
            result = this.reduce( callback );
        return result.toString(); // extra toString covers the one-item case
    };
    
    // remove items, add items in the middle (args beyond 2 are Generators)
    Generator.prototype.splice = function( index, count/*[, Generators]*/) {
        switch( arguments.length ) {
        case 0: // g.splice()
            return new Generator([]);
        case 1: // g.splice( index )
            return this.xtake(index);
        case 2: // g.splice( index, count )
        default: // g.splice( index, count, ... )
            return new Generator((function(g, args){
                    var curr,
                        i;
                    for( i = 0; i < index; i++ ) { // up to index
                        yield g.next();
                    }
                    for( i = 0; i < count; i++ ) { // consume and toss discards
                        g.next();
                    }
                    for( i = 2; i < args.length; i++ ) { // inject Generators
                        for( curr in args[i] ) {
                            yield curr;
                        }
                    }
                    for( curr in g ) { // finish reading from this
                        yield curr;
                    }
                })(this, arguments));
        }
    };
    
    Generator.concat = function(/*Generators*/) {
        return new Generator((function(args){
                var i,
                    curr;
                for( i = 0; i < args.length; i++ ) {
                    for( curr in args[i] ) {
                        yield curr;
                    }
                }
            })(arguments));
    };
    
    Generator.prototype.concat = function(/*Generators*/) {
        var args = [this],
            i;
        args.length += arguments.length;
        for( i = 0; i < arguments.length; i++ ) {
            args[i+1] = arguments[i];
        }
        return Generator.concat.apply( null, args );
    };
    
    Generator.zip = function(/*Generators*/) {
        return new Generator((function(args){
                var i,
                    curr;
                while( true ) {
                    curr = [];
                    curr.length = args.length;
                    for( i = 0; i < args.length; i++ ) {
                        curr[i] = args[i].next();
                    }
                    yield curr;
                }
            })(arguments));
    };
    
    Generator.prototype.zip = function(/*Generators*/) {
        var args = [this],
            i;
        args.length += arguments.length;
        for( i = 0; i < arguments.length; i++ ) {
            args[i+1] = arguments[i];
        }
        return Generator.zip.apply( null, args );
    };
    
    Generator.prototype.toArray = function() {
        var result = [],
            curr;
        for( curr in this ) {
            result.push( curr );
        }
        return result;
    };
    
    function GeneratorIterator(g) {
        this.next = function() {
            return g.next();
        };
    }
    
    return Generator;
})();
