// ✔
var log = console.log
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , bpattern = new Buffer( 255 )
    , bop = Bop( bpattern )
    , osize = 257
    ;

log( '. create %d pattern long, with all bytes equal to 0xff', bpattern.length );

for ( var i = 0; i < 255; ++i ) {
    bpattern[ i ] = 0xff;
};

log( '- check if the bad char table is an istance of Buffer.' );
assert.equal( true, Buffer.isBuffer( bop.bc ), 'bc table should be a Buffer!' );

log( '- check if the bad char table is 256 bytes long [0,255].' );
assert.equal( 256, bop.bc.length, 'lookup table for this pattern should be 256 bytes long!' );

log( '- check 255th bad char table value, should be >= 0 and != undefined', bop.bc[ 255 ] );
assert.notEqual( undefined, bop.bc[ 255 ], 'lookup table for this pattern should be 256 bytes long!' );

log( '- test array creation if pattern length is >= 256' );
bpattern = new Buffer( osize );
bop = Bop( bpattern );

log( '- create %d pattern long, with all bytes equal to 0xff', bpattern.length );

for ( i = 0; i < osize; ++i ) {
    bpattern[ i ] = 0xff;
};

log( '- check if the pattern is an istance of Array.' );
assert.equal( true, Array.isArray( bop.bc ), 'pattern should be an Array!' );

log( '- check if the bad char table is %d bytes long [0,256].', osize );
assert.equal( osize, bop.bc.length, 'lookup table for this pattern should be 257 bytes long! now is ' + bop.bc.length );