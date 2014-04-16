module.exports = {
    // bad char table
    bcTable : function ( p ) {
        var m = p.length,
            bc = ( m > 255 ) ? [] : new Buffer( 256 ),
            i = 0,
            blen = bc.length || m;
        for ( ; i < blen; bc[ i++ ] = m );
        for ( i = 0; i < m - 1; ++i ) {
            bc[ p[ i ] ] = m - i - 1;
        };
        return bc;
    }
    // suffixes table
    , suffixes : function ( p ) {
        var m = p.length,
            g = m - 1,
            suff = ( m > 255 ) ? [] : new Buffer( m ),
            f = 0,
            i = 0,
            offset = 0;

        for ( ; i < m - 1; suff[ i++ ] = 0 );
        suff[ i ] = m;
        offset = m - 1 - f;
        // let i => m - 2
        for ( --i; i >= 0; --i ) {
            if ( ( i > g ) && ( suff[ i + offset ] !== ( i - g ) ) ) {
                suff[ i ] = Math.min( suff[ i + offset ], i - g );
            } else {
                g = Math.min( g, i );
                f = i;
                offset = m - 1 - f;
                while ( ( g >= 0 ) && ( p[ g ] === p[ g + offset ] ) ) {
                    --g;
                    suff[ i ] = f - g;
                };
            }
        };
        return suff;
    }
    // good suffixes table
    , gsTable : function ( suff ) {
        var m = suff.length,
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
        };
        offset = m - 1;
        for ( i = 0; i < offset; ++i ) {
            gsuff[ offset - suff[ i ] ] = offset - i;
        };
        return gsuff;
    }
};