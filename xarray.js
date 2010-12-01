Array.prototype.xmap = function( callback ) {
    return (new Generator(this)).map( callback );
};

Array.prototype.xreduce = function( callback, initial ) {
    return (new Generator(this)).reduce( callback, initial );
};

Array.prototype.xfilter = function( callback ) {
    return (new Generator(this)).filter( callback );
};
