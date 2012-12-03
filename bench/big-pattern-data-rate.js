var log = console.log,
    assert = require( 'assert' ),
    BoyerParser = require( '../' ).Bop,
    mb = 100,
    pmb = 2,
    dlen = mb * 1024 * 1024,
    plen = pmb * 1024 * 1024,
    pattern = new Buffer( plen ),
    data = new Buffer( dlen ),
    i = 0,
    rand = 0,
    bop = null,
    indexes = [],
    results = null,
    stime = 0,
    etime = 0;

for ( ; i < plen; ++i ) {
    rand = Math.floor( Math.random() * 255 * plen ) % 255;
    pattern[ i ] = rand; 
}
bop = BoyerParser( pattern );

log( '- benchmark for worst case with a big pattern, not sparse in data' );

stime = Date.now();
for ( i = 0; i <= dlen - plen; i += 2 * plen ) {
    pattern.copy( data, i );
    indexes.push( i );
}
log( '- test data buffer (' + mb + 'MB) created in', ( Date.now() - stime ) / 1000, 'secs' );
log( '- copied', ( indexes.length ) , 'big patterns (' + pmb + 'MB) in test data' );

stime = Date.now();
results = bop.parse( data );
etime = ( Date.now() - stime ) / 1000;

log( '- check if results length is equal to', indexes.length );
assert.equal( results.length, indexes.length );

log( '- compare results and pre-defined indexes' );
assert.deepEqual( results, indexes );

log( '- test data was parsed in', etime, 'secs' );
log( '- parsing data rate is:', ( 8 * mb / etime / 1024 ).toFixed( 2 ), 'Gbit/sec' );
