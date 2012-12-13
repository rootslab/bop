module.exports = {
    // bad char table
    bcTable : function ( x ) {
        var m = x.length,
            bc = ( m > 255 ) ? [] : new Buffer( 256 ),
            i = 0,
            blen = bc.length || m;
        for ( ; i < blen; bc[ i++ ] = m );
        for ( i = 0; i < m - 1; ++i ) {
            bc[ x[ i ] ] = m - i - 1;
        }
        return bc;
    },
    // suffixes table
    suffixes : function ( x ) {
        var m = x.length,
            g = m - 1,
            suff = ( m > 255 ) ? [] : new Buffer( m ),
            f = 0,
            i = 0,
            offset = 0,
            point = 0,
            curr = 0,
            val = 0;
        for ( ; i < m - 1; suff[ i++ ] = 0 );
        suff[ i ] = m;
        offset = m - 1 - f;
        // let i => m - 2
        for ( --i; i >= 0; --i ) {
            point = i - g;
            curr = i + offset;
            val = suff[ curr ];
            if ( ( point !== val ) && ( point > 0 ) ) {
                suff[ i ] = Math.min( val, point );
            } else {
                g = Math.min( g, i );
                f = i;
                offset = m - 1 - f;
                while ( ( g >= 0 ) && ( x[ g ] === x [ g + offset ] ) ) {
                    --g;
                    suff[ i ] = f - g;
                }
            }
        }
        return suff;
    },
    // good suffixes table
    gsTable : function ( x, suff ) {
        var m = x.length,
            gsuff = ( m > 255 ) ? [] : new Buffer( m ),
            i = m - 2,
            j = 0,
            offset = 0;

        for ( ; i >= -1; --i ) {
            if ( ( i === -1 ) || ( suff[ i ] === ( i + 1 ) ) ) {
                offset = m - 1 - i;
                while ( j < offset ) {
                    gsuff[ j++ ] = offset;
                }
            }
        }
        offset = m - 1;
        for ( i = 0; i < offset; ++i ) {
            gsuff[ offset - suff[ i ] ] = offset - i;
        }
        return gsuff;
    }
};