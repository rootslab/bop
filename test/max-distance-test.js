var log = console.log
    , floor = Math.floor
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , pattern = '-----hello!\r\n'
    , bpattern = new Buffer( pattern )
    , plen = pattern.length
    , dlen = 1024 * 1024
    , data = new Buffer( dlen )
    , bop = Bop( bpattern )
    , i = plen
    , occ = 0
    , indexes = []
    , distances = []
    ;

log( '- creating test data (%d bytes )', dlen );
log( '- copying (%d bytes) pattern to data, varying distances between every occurence..', plen );

for ( ; i < dlen; i *= 2 ) {
    indexes.push( i );
    bpattern.copy( data, i );
};

for ( i = 1; i < indexes.length; ++i ) {
   distances.push( indexes[ i ] - indexes[ i - 1 ] - plen );
}

log( '- parse for pattern (%d bytes )', plen );

var bop = Bop( bpattern )
    , results = bop.parse( data, 0, false )
    // count with overlapping sequences
    , cnt = null
    , i = 0
    , snip = null
    ;

log( '- run #count on %d slices of data ', indexes.length );
log( '- check distance results.. ' ); 
do {
    snip = data.slice( 0, indexes[ i ] );
    cnt = bop.count( snip, 0, false, true );
    assert.ok( cnt[ 0 ] === i );
    if ( i ) {
        if ( i > 1 ) assert.ok( cnt[ 1 ] === ( indexes[ i - 2 ] - bpattern.length ) );
        else assert.ok( cnt[ 1 ] === -1 );
    } else
        // i = 0, should return -1
        assert.ok( cnt[ 1 ] === -1 );
    log( ' -> !OK (%d) slice(%d,%d) ->', i , 0, indexes[ i ] || data.length , cnt );

} while ( i++ < indexes.length );

