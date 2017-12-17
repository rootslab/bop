var log = console.log
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , spattern = '-----hello'
    , data = new Buffer( 1024 )
    , dlen = data.length
    ;

log( '- %d bytes of data was generated without any pattern occurence', dlen );

var bop = Bop( spattern )
    , results = bop.parse( data, 0, false )
    // count with overlapping sequences
    , cnt = bop.count( data, 0, false, true )
    ;

log( '- check matches (with overlapping sequences), they should be: %d', 0 );
assert.ok( cnt[ 0 ] === 0, 'erroneous #count result!' );
assert.ok( cnt[ 0 ] === results.length, 'erroneous #count result!' );

log( '- check max distance, it should be equal to : %d', -1 );
assert.ok( cnt[ 1 ] === -1, 'erroneous #count result, max distance is: ' + cnt[ 1 ] );
