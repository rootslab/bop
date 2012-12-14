var log = console.log,
    t = require( './tables' );

// stuff
var bytes = 255,
    msg = log( '- building and pre-processing a short pattern.. (%d bytes)' ),
    smem = process.memoryUsage(),
    bp = new Buffer( bytes ),
    emem0 = process.memoryUsage(),
    bc = t.bcTable( bp ),
    emem1 = process.memoryUsage(),
    suff = t.suffixes( bp ),
    emem2 = process.memoryUsage(),
    gs = t.gsTable( suff ),
    emem3 = process.memoryUsage(),
    // output results
    output = function ( n, e, s, t ) {
        log( '- %s length is %s bytes', n, t );
        log( '- %s mem usage is %d KBytes', n, ( ( e.rss - s.rss ) / 1024 ).toFixed( 1 ) );
        log( '- %s heap usage is %d KBytes', n, ( ( e.heapUsed - s.heapUsed ) / 1024 ).toFixed( 1 ) );
    };

output( '<bc>', emem1, emem0, bc.length );
output( '<suff>', emem2, emem1, suff.length );
output( '<gs>', emem3, emem2, gs.length );
