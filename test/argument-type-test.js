var log = console.log,
    assert = require( 'assert' ),
    Bop = require( '../' ).Bop;

log( '- passing a String to constructor, doesn\'t throw an Error.' );
assert.doesNotThrow(
  function() {
    Bop( Date() + '' );
  },
  'Test failed! An argument type different from String or Buffer, should throw an Error.'
);

log( '- passing a Buffer to constructor, doesn\'t throw an Error.' );
assert.doesNotThrow(
  function() {
    Bop( new Buffer( Date.now() + '' ) );
  },
  'Test failed! An argument type different from String or Buffer, should throw an Error.'
);

log( '- passing a Date object to constructor, throws an Error.' );
assert.throws(
  function() {
    Bop( Date );
  },
  'Test failed! An argument type different from String or Buffer, should throw an Error.'
);