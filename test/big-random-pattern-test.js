var log = console.log
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , pmb = 10
    , plen = pmb * 1024 * 1024
    , pattern = Buffer.alloc( plen )
    , i = 0
    , rand = 0
    , mb = 300
    , dlen = mb * 1024 * 1024
    , data = Buffer.alloc( dlen )
    , indexes = [ dlen / 1024, plen + dlen / 1024 ]
    , bop = null
    , results = null
    , stime = 0
    , etime = 0
    ;

log( '- creating big pattern,', pmb, 'MB' );
stime = Date.now();

for ( ; i < plen; ++i ) {
    rand = Math.floor( Math.random() * 255 * plen ) % 255;
    pattern[ i ] = rand; 
};

log( '- pattern created in', ( ( Date.now() - stime ) / 1000 ).toFixed( 2 ), 'secs' );

log( '- creating parser instance and tables' );
stime = Date.now();
bop = Bop( pattern );

log( '- parser and tables istantiated in', ( ( Date.now() - stime ) / 1000 ).toFixed( 2 ), 'secs' );

log( '- copy', indexes.length, 'big patterns in test data' );
pattern.copy( data, indexes[ 0 ] );
pattern.copy( data, indexes[ 1 ] );

log( '- parse test data for big patterns' );
stime = Date.now();
results = bop.parse( data );
etime = Date.now();

log( '- check if results length is equal to', indexes.length );
assert.equal( results.length, indexes.length );

log( '- compare results and pre-defined indexes' );
assert.deepEqual( results, indexes );

log( '- big random pattern test executed in', ( ( etime - stime ) / 1000 ).toFixed( 2 ), 'secs' );
