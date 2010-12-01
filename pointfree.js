// returns a function which applies a callback repeatedly
function stack(fn, n) {
    var callback = function( a, o ) {
            return function( x ) {
                return fn( a( x ));
            };
        },
        identity = function( x ) {
            return x;
        },
        result = xrange(n).reduce( callback, identity );
    return result;
}

// returns a function which applies a list of callbacks in order
function compose( /*args*/ ) {
    var callback  = function( a, o ) {
            return function( x ) {
                return a( o( x ));
            };
        },
        identity  = function( x ) {
            return x;
        },
        result = (new Generator(arguments)).reduce( callback, identity );
    return result;
}
