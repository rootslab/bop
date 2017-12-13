/*
 * Bop is a very fast Boyer-Moore parser/matcher for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 bytes;
 * for example, it is ideal for parsing multipart/form-data streams, that have a
 * pattern / boundary length < ~70 bytes.
 *
 * Copyright(c) 2013-present Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

// require( 'buffer' ).INSPECT_MAX_BYTES = -1;

exports.Bop = ( function () {
    var isArray = Array.isArray
        , isBuffer = Buffer.isBuffer
        , min = Math.min
        , max = Math.max
        // suffix table
        , suffixes = function ( p ) {
            var m = p.length
                , g = m - 1
                , suff = ( m > 255 ) ? [] : new Buffer( m )
                , f = 0
                , i = 0
                , offset = 0
                ;

            for ( ; i < m - 1; suff[ i++ ] = 0 );
            suff[ i ] = m;
            offset = m - 1 - f;
            // let i => m - 2
            for ( --i; i >= 0; --i ) {
                if ( ( i > g ) && ( suff[ i + offset ] !== ( i - g ) ) )
                    suff[ i ] = min( suff[ i + offset ], i - g );
                else {
                    g = min( g, i );
                    f = i;
                    offset = m - 1 - f;
                    while ( ( g >= 0 ) && ( p[ g ] === p[ g + offset ] ) ) suff[ i ] = f - --g;
                }
            }
            return suff;
        }
        // good suffixes table
        , gsTable = function ( suff ) {
            var m = suff.length
                , gsuff = ( m > 255 ) ? [] : new Buffer( m )
                , i = m - 2
                , j = 0
                , offset = 0
                ;
            for ( ; i >= -1; --i ) {
                if ( ( i === -1 ) || ( suff[ i ] === ( i + 1 ) ) ) {
                    offset = m - 1 - i;
                    while ( j < offset ) gsuff[ j++ ] = offset;
                }
            }
            offset = m - 1;
            for ( i = 0; i < offset; ++i ) gsuff[ offset - suff[ i ] ] = offset - i;
            return gsuff;
        }
        // bad char table
        , bcTable = function ( p ) {
            var m = p.length
                , bc = ( m > 255 ) ? [] : new Buffer( 256 )
                , i = 0
                , blen = bc.length || m
                ;
            for ( ; i < blen; bc[ i++ ] = m );
            for ( i = 0; i < m - 1; ++i ) bc[ p[ i ] ] = m - i - 1;
            return bc;
        }
        // convert String to Buffer
        , convert = function ( data ) {
            if ( ! isBuffer( data ) ) {
                // obviously, string conversion is slow
                if ( typeof data  === 'string' ) return new Buffer( data );
                else throw new TypeError( 'the argument type should be Buffer or String' );
            }
            return data;
        }
        , set = function ( pattern ) {
            var me = this
                ;
            me.p = convert( pattern );
            me.bc = bcTable( me.p );
            me.gs = gsTable( suffixes( me.p ) );
            return me.p;
        }
        // Bop, a Boyer-Moore Parser
        , Bop = function ( pattern ) {
            var me = this
                , is = me instanceof Bop
                ;
            if ( ! is ) return new Bop( pattern );
            set.call( me, pattern );
        }
        , bproto = Bop.prototype
        ;

    bproto.set = set;

    bproto.parse = function ( data, start, rlimit, array ) {
        var me = this
            , d = convert( data )
            , p = me.p
            , m = p.length
            , n = d.length
            , i = 0
            , j = start || 0
            , l = rlimit || Infinity
            , gs = me.gs
            , bc = me.bc
            , end = n - m
            , ixs = isArray( array ) ? array : []
            ;
        // search
        while ( j <= end ) {
            for ( i = m - 1; ( i >= 0 ) && ( p[ i ] === d[ i + j ] ); --i );
            if ( i < 0 ) {
                if ( ixs.push( j ) >= l ) break;
                j += gs[ 0 ];
            } else j += max( gs[ i ], bc[ d[ i + j ] ] - m + 1 + i );
        }
        return ixs;
    };

    bproto.sparse = function ( data, start, rlimit, array ) {
        var me = this
            , d = convert( data )
            , p = me.p
            , m = p.length
            , n = d.length
            , i = 0
            , j = start || 0
            , l = rlimit || Infinity
            , gs = me.gs
            , bc = me.bc
            , end = n - m
            , ixs = isArray( array ) ? array : []
            , ilen = 0
            ;
        // search
        while ( j <= end ) {
            for ( i = m - 1; ( i >= 0 ) && ( p[ i ] === d[ i + j ] ); --i );
            if ( i < 0 ) {
                // don't collect overlapping patterns
                if ( ( ilen = ixs.length ) && ( j < ixs[ ilen - 1 ] + m ) && ( j += gs[ 0 ] ) ) continue;
                if ( ixs.push( j ) >= l ) break;
                j += gs[ 0 ];
            } else j += max( gs[ i ], bc[ d[ i + j ] ] - m + 1 + i );
        }
        return ixs;
    };

    return Bop;

} )();