require( 'buffer' ).INSPECT_MAX_BYTES = -1;

var log = console.log;

// franek jennings smyth, use KMP table
var bcTable = function ( p ) {
    var m = p.length,
        t = ( m > 255 ) ? [] : new Buffer( 256 ),
        i = 255,
        j = 0;
    for ( ; i >= 0 ; t[ i ] = 0, i-- );
    for ( ; m > 0; t[ p[ j++ ] ] = m-- );
    return t;
};

var kmpTable = function ( x ) {
    var m = x.length,
        t = [],// ( m > 255 ) ? [] : new Buffer( 256 ),
        i = 0,
        j = -1;
    t[ 0 ] = -1//0;
    while ( i < m ) {
        while ( ( j > -1 ) && ( x[ i ] !== x[ j ] ) ) {
            j = t[ j ];
        }
        // log(j,i)
        i++;
        j++;
        if ( ( i < m ) && ( x[ i ] === x[ j ] ) ) {
            t[ i ] = t[ j ];
        } else {
            t[ i ] = j;
        }
   }
   return t;
};

var search = function ( x, y ) {
    var m = x.length,
        n = y.length,
        count = 0,
        s = 0,
        i = 0,
        indexes = [];

    while ( s <= ( n - m ) ) {
        while ( ( s <= ( n - m ) ) && ( x[ m - 1 ] !== y[ s + m - 1 ] ) ) {
            // log( s, n - m, y [ s + m ], bc[ y [ s + m ] )
            s += bc[ y [ s + m ] ];
        }
        if ( s > ( n - m ) ) {
            return indexes;
        }
        log( i, s )
        while ( ( i < m ) && ( x[ i ] === y[ s + i ] ) ){
            i++;
        }
        if ( i >= m ){
            indexes.push( s );
        }
        s += ( i - kmp[ i ] );
   }
   return indexes;
};

var str = 'gcagagag';
var pattern = new Buffer( str );
var data = new Buffer( str + 'aaaasaagcaaccc' + str + 'agccggddagagaa' + str );
var kmp = kmpTable( pattern );
var bc = bcTable( pattern );
var s = search( pattern, data );

log( pattern.length, data.length );
log( kmp, kmp.length );
log( s );

/** /
// franek jennings smyth, use KMP table
var bcTable = function ( p ) {
    var m = p.length,
        t = ( m > 255 ) ? [] : new Buffer( 256 ),
        i = 255,
        j = 0;
    for ( ; i >= 0 ; t[ i ] = 0, i-- );
    for ( ; m > 0; t[ p[ j++ ] ] = m-- );
    return t;
};

var kmpTable = function ( x ) {
    var m = x.length,
        t = [],// ( m > 255 ) ? [] : new Buffer( 256 ),
        i = 0,
        j = -1;
    t[ 0 ] = -1;
    while ( i < m ) {
        while ( ( j > -1 ) && ( x[ i ] !== x[ j ] ) ) {
            j = t[ j ];
        }
        i++;
        j++;
        if ( ( i < m ) && ( x[ i ] === x[ j ] ) ) {
            t[ i ] = t[ j ];
        } else {
            t[ i ] = j;
        }
   }
   return t;
};

var pattern = new Buffer( 'gcagagag' );
var data = new Buffer( 'gcagagagaaaaaagcagagagaaagcagagag' );
var kmp = kmpTable( pattern );
var bc = bcTable( pattern );

var search = function ( x, y ) {
    var m = x.length,
        n = y.length,
        count = 0,
        s = 0;

    while ( s <= ( n - m ) ) {
        while ( ( s <= ( n - m ) ) && ( x[ m - 1 ] != y[ s + m - 1 ] ) ) {
            s += bc[ y [ s + m ] ];
        }
        if ( s > ( n - m ) ) {
            return count;
        }
        i = 0;
        while ( ( i < m ) && ( x[ i ] === y[ s + i ] ) ){
            i++;
        }
        if ( i >= m ){
            count++;
        }
        s += ( i - kmp[ i ] );
   }
   return count;
};

var s = search( pattern, data );

log( pattern.length, data.length, kmp, kmp.length );
log( s );
/**/





