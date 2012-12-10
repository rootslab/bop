/*
 * Bop is a very fast Boyer-Moore parser for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 chars/bytes;
 * for example, it is ideal for parsing multipart/form-data streams, that have a
 * pattern / boundary length < ~70 bytes.
 * Copyright(c) 2011 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */
require( 'buffer' ).INSPECT_MAX_BYTES = -1;
exports.version = require( '../package' ).version;
exports.Bop = exports.BoyerParser = ( function () {
    'use strict';
    var log = console.log,
        // methods for building shift tables
        suffixes = function ( x ) {
            var stime = Date.now();
            var m = x.length,
                g = m - 1,
                suff = ( m > 255 ) ? [] : new Buffer( m ),
                f = 0,
                i = 0;
            for ( ; i < m - 1; suff[ i++ ] = 0 );
            // i => m - 1
            suff[ i ] = m;
            // i => m - 2
            for ( --i; i >= 0; --i ) {
                if ( ( i > g ) && ( suff[ i + m - 1 - f ] != ( i - g ) ) ) {
                    suff[ i ] = Math.min( suff[ i + m - 1 - f ], i - g )
                } else {
                    g = Math.min( g, i );
                    f = i;
                    while ( ( g >= 0 ) && ( x[ g ] === x [ g + m - 1 - f ] ) ) {
                        --g;
                        suff[ i ] = f - g;
                    }
                }
            }
            log( 'suff', ( Date.now() - stime ) / 1000 );
            return suff;
        },
        gsTable = function ( x, suff ) {
            var m = x.length,
                j = 0,
                i = m - 2,
                gsuff = ( m > 255 ) ? [] : new Buffer( m );
            for ( ; i >= -1; --i ) {
                if ( ( i === -1 ) || ( suff[ i ] === i + 1 ) ) {
                    while ( j < m - 1 - i ) {
                        gsuff[ j ] = m - 1 - i;
                        ++j;
                    }
                }
            }
            for ( i = 0; i <= ( m - 2 ); ++i ) {
                gsuff[ m - 1 - suff[ i ] ] = m - 1 - i;
            }
            return gsuff;
        },
        bcTable = function ( x ) {
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
        // err msg
        etmsg = 'the argument type should be Buffer or String, now it\'s ',
        // parser
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
                var stime = Date.now();
                me.gs = gsTable( me.p, suffixes( me.p ) );
                log( 'gs', ( Date.now() - stime ) / 1000 );
                stime = Date.now();
                me.bc = bcTable( me.p );
                log( 'bc:', ( Date.now() - stime ) / 1000);

            };
            me.setPattern( pattern );
        },
        bproto = BoyerParser.prototype;

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