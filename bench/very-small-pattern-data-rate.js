var log = console.log,
    assert = require( 'assert' ),
    BoyerParser = require( '../' ).Bop,
    mb = 100,
    dlen = mb * 1024 * 1024,
    plen = 16,
    pattern = new Buffer( plen ),
    data = new Buffer( dlen ),
    i = 0,
    rand = 0,
    bop = null,
    indexes = [],
    results = null,
    otime = 0,
    ttime = 0,
    stime = 0,
    etime = 0,
    // pre-process time
    pptime = 0;

log( '- benchmark for worst case with a big pattern, not sparse in data' );

stime = Date.now();
for ( ; i < plen; ++i ) {
    rand = Math.floor( Math.random() * 255 * plen ) % 255;
    pattern[ i ] = rand; 
}
log( '- created %d MB big pattern in %d secs', plen, ( ( Date.now()- stime ) / 1000 ).toFixed( 1 ) );

otime = Date.now();
stime = Date.now();
bop = BoyerParser( pattern );
pptime = ( ( Date.now()- stime ) / 1000 ).toFixed( 1 );
log( '- big pattern pre-processed in %d secs', pptime );

log( '- allocating %d MB of data', mb );
stime = Date.now();
for ( i = 0; i <= dlen - plen; i += 2 * plen ) {
    pattern.copy( data, i );
    indexes.push( i );
}
log( '- test data buffer (' + mb + 'MB) created in', ( Date.now() - stime ) / 1000, 'secs' );
log( '- copied', ( indexes.length ) , 'big patterns (' + plen + 'bytes) in test data' );

stime = Date.now();
results = bop.parse( data );
etime = ( Date.now() - stime ) / 1000;
ttime = ( Date.now() - otime ) / 1000;
log( '- test data was parsed in', etime, 'secs' );

log( '- check if results length is equal to', indexes.length );
assert.equal( results.length, indexes.length );

log( '- compare results and pre-defined indexes' );
assert.deepEqual( results, indexes );

log( '- pre-processing data rate is:', ( 8 * mb / pptime / 1024 ).toFixed( 2 ), 'Gbit/sec' );
log( '- parsing data rate is:', ( 8 * mb / etime / 1024 ).toFixed( 2 ), 'Gbit/sec' );
log( '- total elapsed time:', ttime.toFixed( 2 ), 'secs' );
log( '- resulting data-rate:', ( ( 8 * mb / ttime / 1024 ) ).toFixed( 2 ), 'Gbit/sec' );

