var log = console.log
    , floor = Math.floor
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , pattern = '-----hello!\r\n'
    , bpattern = Buffer.alloc( pattern.length, pattern )
    , plen = pattern.length
    , dlen = 1024 * 1024
    , data = Buffer.alloc( dlen )
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
    log( ' -> !copy (%d) pattern to (%d,%d) slice', ++occ, i , i + bpattern.length );
};

for ( i = 1; i < indexes.length; ++i ) distances.push( indexes[ i ] - indexes[ i - 1 ] - plen );

log( '- parse for pattern (%d bytes )', plen );

// count with overlapping sequences
var results = bop.parse( data, 0 )
    , cnt = null
    , i = 0
    , snip = null
    ;

log( '- parsed results: %d\n -> [%s]', results.length, results );
log( '- run #count on %d slices of data ', indexes.length );
log( '- check distance results.. ' ); 

do {
    snip = data.slice( 0, indexes[ i ] );
    cnt = bop.dist( snip, 0 );
    assert.ok( cnt[ 0 ] === i );
    if ( i ) {
        if ( i > 1 ) {
            assert.ok( cnt[ 1 ] === ( indexes[ i - 2 ] - bpattern.length ), 'wrong value: ' + cnt[ 2 ] + ' for slice(0,' + indexes[ i ] + ')' );
            assert.ok( cnt[ 2 ] === results[ 0 ], 'wrong value: ' + cnt[ 2 ] + ' for slice(0,' + indexes[ i ] + ')' );
            assert.ok( cnt[ 3 ] === snip.length - indexes[ i - 1 ] - bpattern.length,  'wrong value: ' + cnt[ 3 ] + ' for slice(0,' + indexes[ i ] + ')' );
        }
        else {
            // i === 1
            assert.ok( cnt[ 1 ] === -1, 'wrong value: ' + cnt[ 1 ] + ' for slice(0,' + indexes[ i ] + ')' );
            assert.ok( cnt[ 2 ] === results[ 0 ], 'wrong value: ' + cnt[ 2 ] + ' for slice(0,' + indexes[ i ] + ')' );
            assert.ok( cnt[ 3 ] === snip.length - results[ 0 ] - bpattern.length, 'wrong value: ' + cnt[ 3 ] + ' for slice(0,' + indexes[ i ] + ')' );
        }
    } else {
        // i = 0, should return -1
        assert.ok( cnt[ 1 ] === -1 );
        // check 0 length reesults
        assert.ok( cnt[ 2 ] === -1, 'wrong value: ' + cnt[ 2 ] + ' for slice(0,' + indexes[ i ] + ')' );
        assert.ok( cnt[ 3 ] === -1, 'wrong value: ' + cnt[ 2 ] + ' for slice(0,' + indexes[ i ] + ')' );
    }
    log( ' -> !OK (%d) slice(%d,%d) ->', i , 0, indexes[ i ] || data.length , cnt );

} while ( i++ < indexes.length );

