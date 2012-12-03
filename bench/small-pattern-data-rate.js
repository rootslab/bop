var log = console.log,
    BoyerParser = require( '../' ).Bop,
    defaultSize = 700.1, //megabytes
    buildTestBuffer = function( p, MBsize, gapFactor ){
        var s = Date.now(),
            mtime = 0,
            len = p.length,
            gap = Math.pow( len, ( gapFactor && gapFactor > 1 ) ? gapFactor : 3 ),//power of len
            mb =  1024 * 1024,
            size = MBsize || defaultSize // megabytes
            tSize = parseInt( size * mb, 10 ),
            logp = Math.log( len ), // log bt
            logt = Math.log( tSize ), // log a
            logr = logt / logp,
            maxLenPower = parseInt( logr, 10 ); // maxLenPower = max power of len after which the 2nd pattern writed is out of buffer bound  
            log( '\n ->\tMin Gap Factor: 2\n ->\tMax Gap Factor:', maxLenPower, '\n ->\tCurrent Gap Factor:', ( gapFactor ) ? gapFactor : 3 ); 
            
        for( var i = 0,  c = 1, t = new Buffer( tSize ); i + len < tSize; i += len  ){
            if( ( i % ( gap ) ) === 0 ){
                t.write( p.toString() + '\r\nContent-Disposition: form-data\r\nLorem Ipsum et Dolor sit amet, Quisquisce\r\n\r\n', i );
            }else{
                t[ i ] = i % 255;
            } 
        }
        mtime = Date.now() - s;
        log( '\n ->\tpattern:', p.toString() );
        log( ' ->\ max pattern length: 254 bytes' );
        log( ' ->\ pattern length:', len, 'bytes' );
        log( ' ->\ pattern gap:', ( gap / 1024 ).toFixed( 2 ), 'KB (distance in bytes for patterns)' );
        log( ' ->\ plength / pgap:', len/gap, '\n' );
        

        log( ' ->\tbuffer size:', size, 'MB' );
        log( ' ->\tbuffer creation time:', mtime / 1000, 'secs\n' ); 
        return t;
    },
    bsize,
    gapfactor,
    pattern = '---------------------------2046863043300497616870820724\r\n',
    p = t = null;

process.argv.forEach( function ( val, index, array ) {
    ( index === 2 ) ? ( bsize = parseInt( val, 10 ) )  : null; 
    ( index === 3 ) ? ( gapfactor = parseInt( val, 10 ) )  : null;
    ( index === 4 ) ? ( pattern = ( ( val.length > 1 ) && ( val.length < 255 ) ) ? ( '--' + val + '\r\n' ) : pattern ) : null;  
} );

p = new Buffer( pattern );
t = buildTestBuffer( p, bsize, gapfactor );

var bop = BoyerParser( p ),
    stime = Date.now(),
    results = bop.parse( t ),
    elapsed = Date.now() - stime;

log( 'Results Matched:', results.length >>> 1 );
log( 'Time Elapsed:', elapsed / 1000 );
log( 'Test Buffer Size:', bsize || defaultSize, 'MB' );
log( 'Data Rate:', ( ( 8 * ( bsize || defaultSize ) / ( elapsed / 1000 ) ) / 1024 ).toFixed( 2 ), 'Gbit/s' );
log();


// log( results )