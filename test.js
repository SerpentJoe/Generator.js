function goldbach(n) {
    return new Generator((function(){
            for( ; n > 1; n = (n%2)?(3*n+1):(n/2) ) {
                yield n;
            }
            yield n;
        })());
}

function fibonacci() {
    return new Generator((function(){
            var f,
                f1 = 0,
                f2 = 1;
            yield f1;
            while(true) {
                f = f1 + f2;
                yield f;
                f2 = f1;
                f1 = f;
            }
        })());
}

function staircase(n) {
    return new Generator((function(){
            var i;
            for( i = n; true; i++ ) {
                yield i;
            }
        })());
}
