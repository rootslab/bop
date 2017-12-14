/*
 * Bop#sparse Bop#parse and Bop#count example with 
 */

var log = console.log
    , Bop = require( '../' )
    , hello = '------hello'
    , line = new Buffer( hello + hello )
    , bop = Bop( line )
    , llen = line.length
    , l = 8
    , data = new Buffer( 23 + llen * l )
    , i = 0
    , matches = null
    , cnt = -1
    ;

log( '- pattern is:', bop.p );

log( '- fill data with %d patterns', l );

/* 
 * NOTE: it builds example data using Buffer#copy, instead of
 * Buffer#concat, to mantain retro compatibility with older 
 * nodejs versions.
 */
for ( ; i < l; ++i ) line.copy( data, 23 + i * llen );

matches = bop.parse( data );

log( '\n-> use #parse (overlapping sequences).' );

log( '- bop.parse(data) matches:', matches.length );

cnt = bop.count( data )

log( '- bop.count(data):', cnt );

matches = bop.sparse( data );

log( '\n-> use #sparse (no overlapping sequences).' );

log( '- bop.sparse(data) matches:', matches.length );

cnt = bop.count( data, 0, true )

log( '- bop.count(data, true):', cnt );

