var log = console.log
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , spattern = '-----hello'
    , splen = spattern.length
    // 2^n times
    , n = 1
    , tlen = splen * n
    , indexes = []
    , data = new Buffer( 256 )
    , dlen = data.length
    , bpattern = null
    , i = 0
    ;

log( '- create pattern with 2 sub-pattern side by side' );

for ( ; i < n; ++i ) spattern += spattern;

log( '- create a Buffer copying 2 patterns side by side' );
bpattern = new Buffer( spattern );
bpattern.copy( data, bpattern.length );
bpattern.copy( data, ( bpattern.length * 2 ) );

log( '- parse data for patterns and get results' );
var bop = Bop( bpattern )
    , results = bop.parse( data )
    ;

log( '- check if the parse method returns exactly 3 results' );
assert.equal( results.length, 3, 'results length is wrong, must be 3, now it\'s ' + results.length );
assert.deepEqual( results, [ 20, 30, 40 ], 'results don\'t match' );

log( '- now parse data with Bop#sparse, it doesn\'t collect overlapping patterns' );
var bop = Bop( bpattern )
    , results = bop.sparse( data )
    ;
log( '- check if the parse method returns exactly 2 results this time' );
assert.equal( results.length, 2, 'results length is wrong, must be 2, now it\'s ' + results.length );
assert.deepEqual( results, [ 20, 40 ], 'results don\'t match' );
