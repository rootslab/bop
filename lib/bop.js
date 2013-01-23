/*
 * Bop is a very fast Boyer-Moore parser/matcher for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 bytes;
 * for example, it is ideal for parsing multipart/form-data streams, that have a
 * pattern / boundary length < ~70 bytes.
 *
 * Copyright(c) 2011 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

// require( 'buffer' ).INSPECT_MAX_BYTES = -1;
exports.version = require( '../package' ).version;
exports.Bop = exports.BoyerParser = ( function () {
    // 'use strict';
    var log = console.log,
        // suffix table
        suffixes = function ( p ) {
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
                    }
                }
            }
            return suff;
        },
        // good suffixes table
        gsTable = function ( suff ) {
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
            }
            offset = m - 1;
            for ( i = 0; i < offset; ++i ) {
                gsuff[ offset - suff[ i ] ] = offset - i;
            }
            return gsuff;
        },
        // bad char table
        bcTable = function ( p ) {
            var m = p.length,
                bc = ( m > 255 ) ? [] : new Buffer( 256 ),
                i = 0,
                blen = bc.length || m;
            for ( ; i < blen; bc[ i++ ] = m );
            for ( i = 0; i < m - 1; ++i ) {
                bc[ p[ i ] ] = m - i - 1;
            }
            return bc;
        },
        // err msg
        etmsg = 'the argument type should be Buffer or String, now it\'s ',
        // Bop
        BoyerParser = function ( pattern ) {
            var me = this;
            if ( ! ( me instanceof BoyerParser ) ) {
                return new BoyerParser( pattern );
            }
            me.setPattern = function ( p ) {
                if ( ! Buffer.isBuffer( p ) ) {
                    var ptype = ( typeof p );
                    if ( ptype === 'string' ) {
                        p = new Buffer( p );
                    } else {
                        throw new Error( etmsg + '"' + ptype +'"' );
                        // or p.toString();
                    }
                }
                me.p = p;
                me.bc = bcTable( p );
                me.gs = gsTable( suffixes( p ) );
                return p;
            };
            me.setPattern( pattern );
        },
        // prototype shortcut
        bproto = BoyerParser.prototype;
    // parse method
    bproto.parse = function ( data, start, rlimit, array ) {
        var me = this;
        if ( ! Buffer.isBuffer( data ) ) {
            var dtype = ( typeof data );
            if ( dtype === 'string' ) {
                // obviously it's slow
                data = new Buffer( data );
            } else {
                throw new Error( etmsg + '"' + dtype +'"' );
                // or data.toString();
            }
        }
        var x = me.p,
            y = data,
            m = x.length,
            n = y.length,
            i = 0,
            j = start || 0,
            l = rlimit || Infinity,
            gs = me.gs,
            bc = me.bc,
            end = n - m,
            indexes = Array.isArray( array ) ? array : [];
        // search
        while ( j <= end ) {
            for ( i = m - 1; ( i >= 0 ) && ( x[ i ] === y[ i + j ] ); --i );
            if ( i < 0 ) {
                if ( indexes.push( j ) >= l ) {
                    break;
                }
                j += gs[ 0 ];
            } else {
                j += Math.max( gs[ i ], bc[ y[ i + j ] ] - m + 1 + i );
            }
        }
        return indexes;
    };
    return BoyerParser;
} )();