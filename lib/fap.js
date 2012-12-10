require( 'buffer' ).INSPECT_MAX_BYTES = -1;

var log = console.log;

var verify = function ( y, left, x, k ) {
    var m = x.length,
        i = 0,
        j = 0,
        count = 0;

    for ( ; j < k; ++j ) {
        if ( ( m + j ) > left ){
            break;
        }
        i = 0;
        while ( ( i < m ) && ( y[ i ] === x[ i ] ) ) {
            i++;
        }
        if ( i >= m ){
            count++;
        }
        y++;
   }
   return count;
};

var search = function ( x, y ) {
    var m = x.length,
        n = y.length,
        B = [], // 256
        M = 0,
        k = 0,
        i = 0,
        j = 0,
        l = 0,
        m1 = 0,
        m2 = 0,
        rmd = 0;

    // pre-process
    M = ( 1 << 31 ) >>> 0;
    k = ( m - 1 ) / 32 + 1;
    m1 = m - 1;
    m2 = m1 - k;
    rmd = m - ( m / k ) * k;

    i = m / k;
    l = m;
    for ( ; i > 0; --i, l -= k ) {
        for ( j = k; j > 0; --j ) {
            B[ x [ l - j ] ] |= ( 1 << ( 32 - i ) ) >>> 0;
        }
    }
    log(B, M, k, m1, m2, rmd)
    // searching
    j = 0;

    var count = 0,
        D = null,
        last = 0;

    while ( j <= n - m ) {
        D = B[ y [ j + m1 ] ];
        last = ( D && M ) ? ( m - k - rmd ) : ( m - rmd );
        l = m2;
        while ( D ) {
            D = ( D << 1 ) && B[ y[ j + l ] ];
            if ( D && M ) {
                if ( l < k + rmd ) {
                    log( l, n-j )
                    count += verify( y + j, n - j, x, k );
                    break;
                }
                last = l - ( k + rmd ) + 1;
            }
            l -= k;
        }
        j += last;
    }
    return count;
};

/**/
var p = 'gcagagag';
var data = p + 'aaaasaagcaaccc' + p + 'agccggddagagaa' + p;
var bp = new Buffer( p );
var bdata = new Buffer( p + 'aaaasaagcaaccc' + p + 'agccggddagagaa' + p );

var s = search( p, data );
log( s );
log( p.length, data.length );
/**/


/** /
int search(unsigned char *x, int m, unsigned char *y, int n)
{
   unsigned int B[SIGMA] = {0};
   unsigned int M;
   int k;
   int i, j, l;
   int m1, m2, rmd;

   M = 1 << (WORD-1);
   k = (m-1)/WORD+1;
   m1 = m-1;
   m2 = m1-k;
   rmd = m-(m/k)*k;
   for (i=m/k, l=m; i>0; i--, l-=k)
      for (j=k; j>0; j--)
         B[x[l-j]] |= 1 << (WORD-i);

   int count = 0;
   j = 0;
   while (j <= n-m) {
      unsigned int D = B[y[j+m1]];
      int last = (D & M) ? m-k-rmd : m-rmd;
      l = m2;
      while (D) {
         D = (D << 1) & B[y[j+l]];
         if (D & M) {
            if (l < k+rmd) {
               count += verify(y+j, n-j, x, m, k);
               break;
            }
            last = l-(k+rmd)+1;
         }
         l -= k;
      }
      j += last;
   }
   return count;
}

int verify(unsigned char *y, int left, unsigned char *x, int m, int k) {
   int j,i;
   int count = 0;
   for (j=0; j<k; j++) {
      if (m+j > left) break;
      i = 0;
      while(i<m && y[i]==x[i]) i++;
      if(i>=m) count++;
      y++;
   }
   return count;
}




/** /
// franek jennings smyth, use KMP table
var bcTable = function ( p ) {
    var m = p.length,
        t = ( m > 0 ) ? [] : new Buffer( 256 ),
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





