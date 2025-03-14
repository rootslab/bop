/*
 * Bop#parse and Bop#count example
 */

var log = console.log
    , Bop = require( '../' )
    , hello = '------hello'
    , CRLF = '\r\n'
    , bop = Bop( CRLF )
    , line = Buffer.alloc(hello.length + CRLF.length, hello + CRLF)
    , llen = line.length
    , data = Buffer.alloc(llen << 10 >>> 0)
    , i = 0
    , l = 1024
    , matches = null
    , cnt = -1
    ;

log( '- pattern is:', bop.p );

log( '- fill data with %d lines:', l, line );

/* 
 * NOTE: it builds example data using Buffer#copy, instead of
 * Buffer#concat, to mantain retro compatibility with older 
 * nodejs versions.
 */
for ( ; i < l; ++i ) line.copy( data, i * llen );

matches = bop.parse( data );

log( '- matches:', matches.length );

cnt = bop.count( data, 0, false, true )

log( '- count:', cnt );

