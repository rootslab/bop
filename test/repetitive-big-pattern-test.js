var log = console.log,
    assert = require( 'assert' ),
    BoyerParser = require( '../' ).Bop,
    spattern = '---------------hellofolks!!!!!!!!!!!!\r\n\r\n\r\n',
    splen = spattern.length,
    n = 8, // 2^n times
    tlen = splen * n,
    indexes = [],
    data = new Buffer( Math.pow( 2, n ) * 1024 * 1024 ),
    dlen = data.length,
    bpattern = null,
    i = 0,
    offset = 0;

log( '- create a long pattern with ' + n + ' repetition of itself side by side' );
for ( ; i < n; ++i ) {
    spattern += spattern;
} 
log( '- resulting pattern length is ' + spattern.length / 1024 + ' KB' );
bpattern = new Buffer( spattern );
log( '- create a test data buffer (' + ( data.length / 1024 / 1024 ) + ' MB) copying ' + n + ' patterns' );
for ( i = 0; i < n; ++i ) {
    offset = bpattern.length * Math.pow( 2, 2 * i );
    indexes.push( offset );
    bpattern.copy( data, offset );
}
log( '- parse data for patterns and get results' );
var bop = BoyerParser( bpattern ),
    results = bop.parse( data );

// log( results, bpattern.length );
// log( indexes )
// log( data.slice( 2709, 2720), bpattern )
log( '- check results length, it should be equal to ' + n );
assert.equal( results.length, n, 'results length is wrong, must be ' + n + ', now it\'s ' + results.length );

log( '- compare returned results and pre-recorded indexes, indexes should match' );
assert.deepEqual( results, indexes, 'results don\'t match : ' + indexes + ' !== ' + results );
