var log = console.log
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , spattern = '-----hello'
    , data = new Buffer( 1024 )
    , dlen = data.length
    ;

log( '- %d bytes of data was generated without any pattern occurence', dlen );
log( '- using Bop#dist' );

var bop = Bop( spattern )
    , results = bop.parse( data, 0, false )
    // count with overlapping sequences
    , cnt = bop.dist( data, 0 )
    ;

log( '- check matches (with overlapping sequences), they should be: %d', 0 );
assert.ok( cnt[ 0 ] === 0, 'erroneous #count result!' );
assert.ok( cnt[ 0 ] === results.length, 'erroneous #count result!' );

log( '- check max distance, it should be equal to : %d', -1 );
assert.ok( cnt[ 1 ] === -1, 'erroneous #dist result, max distance is: ' + cnt[ 1 ] );
assert.ok( cnt[ 2 ] === -1, 'erroneous #dist result, left distance is: ' + cnt[ 2 ] );
assert.ok( cnt[ 3 ] === -1, 'erroneous #dist result, right distance is: ' + cnt[ 3 ] );

log( '- using Bop#sdist' );

cnt = bop.sdist( data, 0 );

log( '- check matches (with overlapping sequences), they should be: %d', 0 );
assert.ok( cnt[ 0 ] === 0, 'erroneous #count result!' );
assert.ok( cnt[ 0 ] === results.length, 'erroneous #count result!' );

log( '- check max distance, it should be equal to : %d', -1 );
assert.ok( cnt[ 1 ] === -1, 'erroneous #dist result, max distance is: ' + cnt[ 1 ] );
assert.ok( cnt[ 2 ] === -1, 'erroneous #dist result, left distance is: ' + cnt[ 2 ] );
assert.ok( cnt[ 3 ] === -1, 'erroneous #dist result, right distance is: ' + cnt[ 3 ] );

log( '- check #scount results, remaining bytes should be: %d', data.length );
cnt = bop.scount( data, 0 );
assert.ok( cnt[ 0 ] === 0, 'erroneous #scount result, is: ' + cnt[ 0 ] + ' should be: ' + 0 );
assert.ok( cnt[ 1 ] === data.length, 'erroneous #scount result for reamining bytes, is: ' + cnt[ 1 ] + ' should be: ' + data.length );