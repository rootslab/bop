/*
 * Bop#sparse Bop#scount and Bop#count example
 */

var log = console.log
    , Bop = require( '../' )
    , hello = '------hello'
    , line = Buffer.alloc(hello.length + hello.length, hello + hello)
    , bop = Bop( line )
    , llen = line.length
    , l = 8
    , data = Buffer.alloc(230 + llen * l)
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


matches = bop.sparse( data );

log( '\n-> use #sparse (no overlapping sequences).' );

log( '- bop.sparse(data) matches:', matches.length );

cnt = bop.scount( data, 0, true )

log( '- bop.scount(data, true):', cnt );
