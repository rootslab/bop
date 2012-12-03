###BoyerParser 
[![build status](https://secure.travis-ci.org/rootslab/bop.png)](http://travis-ci.org/rootslab/bop)
 * Bop is a __very fast__ Boyer-Moore parser for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 chars/bytes,
 * It is ideal for parsing multipart/form-data streams, that have a pattern / boundary length < ~70 bytes.

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
Bop.parse( String data, [ Number startFromIndex ], [ Number limitResultsTo ], [ Array array ] ) : []
// faster with Buffer
Bop.parse( Buffer data, [ Number startFromIndex ], [ Number limitResultsTo ], [ Array array ] ) : []
```

> Change the pattern with a Buffer or String

```javascript
Bop.setPattern( String anotherPattern )
Bop.setPattern( Buffer anotherPattern )
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

####Benchmark for small patterns

```bash
  $ node bench/small-pattern-data-rate
```
for default :

> - uses a pattern string of 57 bytes/chars
> - builds a data buffer of 700 MB in memory
> - uses a redundancy factor for pattern strings. The bigger the value, 
the lesser are occurrences of pattern string into the text buffer. ( range: [1,5] )

 **Custom Usage**:

```bash
  // with [NumberOfMegaBytes] [GapFactor] [patternString]
  $ node bench/small-pattern-data-rate.js 700 4 "that'sallfolks"
```

####Benchmark for big patterns

```bash
  $ node bench/big-pattern-data-rate
```

> - it uses a pattern size of 2MB
> - builds a data buffer of 100MB copying pattern 25 times
