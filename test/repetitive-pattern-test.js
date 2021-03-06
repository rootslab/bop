var log = console.log
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , spattern = '-----hello'
    , splen = spattern.length
    // 2^n times
    , n = 1
    , tlen = splen * n
    , indexes = []
    , offset = 27
    , data = new Buffer( offset + 256 )
    , dlen = data.length
    , bpattern = null
    , i = 0
    ;

log( '- create pattern with 2 sub-pattern side by side' );

for ( ; i < n; ++i ) spattern += spattern;

log( '- create a Buffer copying 2 patterns side by side' );
bpattern = new Buffer( spattern );
bpattern.copy( data, offset + bpattern.length );
bpattern.copy( data, offset + ( bpattern.length * 2 ) );

log( '- parse data (with overlapping sequences)' );
var bop = Bop( bpattern )
    , results = bop.parse( data )
    // count with overlapping sequences
    , cnt = bop.count( data )
    , sresults = null
    ;

log( '- counting matches (with overlapping sequences), they should be: %d', results.length );
assert.ok( cnt[ 0 ] === results.length, 'erroneous #count result!' );

log( '- check if the parse method returns exactly 3 results' );
assert.equal( results.length, 3, 'results length is wrong, must be 3, now it\'s ' + results.length );
assert.deepEqual( results, [ offset + 20, offset + 30, offset + 40 ], 'results don\'t match' );

log( '- now parse data with Bop#sparse (it doesn\'t collect overlapping sequences)' );
sresults = bop.sparse( data );

log( '- results should be: %d', 2 );
assert.equal( sresults.length, 2, 'results length is wrong, must be 2, now it\'s ' + sresults.length );

log( '- check resulting indexes' );
assert.deepEqual( sresults, [ offset + 20, offset + 40 ], 'results don\'t match' );

log( '- counting matches (without overlapping sequences), they should be: %d', sresults.length );
cnt = bop.scount( data, 0 );
assert.ok( cnt[ 0 ] === sresults.length, 'erroneous #scount result!' );

log( '- check remaining bytes, they should be: %d', data.length - sresults[ sresults.length - 1 ] - bpattern.length );
assert.ok( cnt[ 1 ] === data.length - sresults[ sresults.length - 1 ] - bpattern.length, 'erroneous #scount result! is: ' + cnt[ 1 ] );
