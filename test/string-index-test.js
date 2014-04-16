var log = console.log
    , assert = require( 'assert' )
    , Bop = require( '../' )
    , crlf = '\r\n'
    , crlfcrlf = crlf + crlf
    , pattern = 'bacicc\r\n\r\n'
    , data = 'ambara' + pattern + 'icocco\r\n\r\tregallinesulcom' + pattern + 'obacicc\r\n\ri'
    , qcrlf = Bop( crlf )
    , qcrlfcrlf = Bop( crlfcrlf )
    , qpattern = Bop( pattern )
    ;

log( '- parse data from index 7 returns only one result (index 41)' )
assert.equal( 41, qpattern.parse( data, 7 ), 'results don\'t match' );

log( '- counting CRLF occurrences (6)' );
assert.equal( 6, qcrlf.parse( data ).length, 'results don\'t match' );

log( '- counting CRLFCRLF occurrences (2)' );
assert.equal( 2, qcrlfcrlf.parse( data ).length, 'results don\'t match' );