// Enhanced xrange from Python 2.x
function xrange(/*[start,] end [, inc]*/) {
    var start = 0,
        end,
        inc   = 1,
        args  = arguments, // convenience
        result;
    
    switch( args.length ) {
    case 0: // xrange()
        end   = 0; // generator will be empty
    case 1: // xrange(end)
        end   = args[0];
        break;
    case 2: // xrange(start, end)
        start = args[0];
        end   = args[1];
        break;
    case 3: // xrange(start, end, inc)
    default: // args beyond 3 are ignored
        start = args[0];
        end   = args[1];
        inc   = args[2];
        break;
    }
    
    if( inc === 0 && start !== end // will never move toward end
            || (end-start)*inc < 0 ) { // will move away from end
        throw new RangeError([
            "Sequence will never terminate (",
            "start: ",     start, ", ",
            "end: ",       end,   ", ",
            "increment: ", inc,   ")"
        ].join(""));
    } else {
        return new Generator((function() {
            var i;
            for( i = start; (i-end)*(start-end) > 0; i += inc ) {
                yield i;
            }
        })());
    }
}
