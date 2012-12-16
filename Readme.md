###BoyerParser 
[![build status](https://secure.travis-ci.org/rootslab/bop.png)](http://travis-ci.org/rootslab/bop)
 * Bop is a __very fast__ Boyer-Moore parser for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 chars/bytes.
 * It is __ideal__ for parsing __multipart/form-data__ streams, that have a pattern / boundary length < ~70 bytes.

###Main features

> Given a m-length pattern and n-length data, and σ-length alphabet ( σ = 256 ):

- it performs the comparisons from right to left.
- preprocessing phase in __O(m+σ)__ time and space complexity.
- searching phase in __O(m*n)__ time complexity.
- __3*n__ text character comparisons in the worst case when searching for a non periodic pattern.
- __O(n/m)__ best performance.

> See [Lecroq](http://www-igm.univ-mlv.fr/~lecroq/string/node14.html) for reference.


###Install
```bash
$ npm install bop [-g]
```
###Run Tests

```javascript
$cd bop/
$npm test
```
###Signatures

> Create an instance with a Buffer or String pattern. 

```javascript
Bop( String pattern )
Bop( Buffer pattern )
```

> List all pattern occurrences into a String or Buffer data.
> It returns a new array of indexes, or populates an array passed as the last argument to parse method.

```javascript
// slower with String
Bop#parse( String data, [ Number startFromIndex ], [ Number limitResultsTo ], [ Array array ] ) : []
// faster with Buffer
Bop#parse( Buffer data, [ Number startFromIndex ], [ Number limitResultsTo ], [ Array array ] ) : []
```

> Change the pattern with a Buffer or String

```javascript
Bop#setPattern( String anotherPattern )
Bop#setPattern( Buffer anotherPattern )
```

###Usage Example

```javascript
var assert = require( 'assert' ),
    BoyerParser = require( './bop' ).BoyerParser, // or Bop
    pattern = 'hellofolks\r\n\r\n',
    text = 'hehe' + pattern +'loremipsumhellofolks\r\n' + pattern;

// create a Bop instance that parses the pattern
var bop = BoyerParser( pattern ),
	// parse data from beginning
	results = bop.parse( text );

// change pattern with a buffer
bop.setPattern( new Buffer( pattern ) );

// re-parse data passing a Buffer instance instead of a String
var bresults = bop.parse( new Buffer( text ) );

// results are the same
assert.deepEqual( results, bresults );

// parser results ( starting indexes ) [ 4, 40 ]
console.log( results, bresults );
```

####Benchmark for a short pattern ( length <= 255 bytes )

> Parser uses 3 Buffers 256-bytes long to build shifting tables, then:

> - Pattern parsing / table creation space and time complexity is O(σ).
> - Very low memory footprint.
> - Ultra fast to preprocess pattern ( = tables creation ).

```bash
  $ node bench/small-pattern-data-rate
```

for default it:

> - uses a pattern string of 57 bytes/chars.
> - builds a data buffer of 700 MB in memory.
> - uses a redundancy/distance factor for pattern strings equal to 2. The bigger the value, 
the lesser are occurrences of pattern string into the text buffer.

 **Custom Usage**:

```bash
  # with [testBufferSizeInMB] [distanceFactor] [aStringPattern]
  $ node bench/small-pattern-data-rate.js 700 4 "that'sallfolks"
```

####Benchmark for a big pattern ( length > 255 bytes )

> Parser uses 3 arrays to build shifting tables for big patterns, then:

> - there will be an high memory consumption, due to the use of arrays.
> - it will take a long time to preprocess pattern ( = tables creation ).

```bash
  $ node bench/big-pattern-data-rate
```

> - it uses a very big pattern ( 20 MBytes ).
> - it builds a data buffer of 300 MBytes, copying the same pattern 12 times.

See [bench](https://github.com/rootslab/bop/tree/master/bench) dir.