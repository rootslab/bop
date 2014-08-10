###Bop, a Boyer Moore Parser

[![CODECLIMATE](http://img.shields.io/codeclimate/github/rootslab/bop.svg?style=flat)](https://codeclimate.com/github/rootslab/bop)
[![CODECLIMATE-TEST-COVERAGE](http://img.shields.io/codeclimate/coverage/github/rootslab/bop.svg?style=flat)](https://codeclimate.com/github/rootslab/bop)

[![LICENSE](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/rootslab/bop#mit-license)
[![GITTIP](http://img.shields.io/gittip/rootslab.svg?style=flat)](https://www.gittip.com/rootslab/)
[![NPM DOWNLOADS](http://img.shields.io/npm/dm/bop.svg?style=flat)](http://npm-stat.com/charts.html?package=bop)

[![NPM VERSION](http://img.shields.io/npm/v/bop.svg?style=flat)](https://www.npmjs.org/package/bop)
[![TRAVIS CI BUILD](http://img.shields.io/travis/rootslab/bop.svg?style=flat)](http://travis-ci.org/rootslab/bop)
[![BUILD STATUS](http://img.shields.io/david/rootslab/bop.svg?style=flat)](https://david-dm.org/rootslab/bop)
[![DEVDEPENDENCY STATUS](http://img.shields.io/david/dev/rootslab/bop.svg?style=flat)](https://david-dm.org/rootslab/bop#info=devDependencies)

[![NPM GRAPH1](https://nodei.co/npm-dl/bop.png)](https://nodei.co/npm/bop/)

[![NPM GRAPH2](https://nodei.co/npm/bop.png?downloads=true&stars=true)](https://nodei.co/npm/bop/)

 * Bop is a __very fast__ Boyer-Moore parser for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 bytes.
 * It is __ideal__ for parsing __multipart/form-data__ streams, that have a pattern / boundary length < ~70 bytes.

###Main features

> Given a m-length pattern and n-length data, and σ-length alphabet ( σ = 256 ):

- it performs the comparisons from right to left.
- preprocessing phase in __O(m+σ)__ time and space complexity.
- searching phase in __O(m*n)__ time complexity.
- __3*n__ text character comparisons in the worst case when searching for a non periodic pattern.
- __O(n/m)__ best performance.

> See __[Lecroq](http://www-igm.univ-mlv.fr/~lecroq/string/node14.html)__ for reference and also __[Qap](https://github.com/rootslab/qap)__, a QuickSearch parser.

###Install
```bash
$ npm install bop [-g]
```

> __require__:

```javascript
var Bop = require( 'bop' );
```

###Run Tests

```javascript
$cd bop/
$npm test
```

###Run Benchmarks

```bash
$ cd bop/
$ npm run-script bench
```

###Constructor

> Create an instance with a Buffer or String pattern. 

```javascript
Bop( Buffer || String pattern )
// or
new Bop( Buffer | String pattern )
```

### Methods

> List all pattern occurrences into a String or Buffer data.
> It returns a new array of indexes, or populates an array passed as the last argument to parse method.

```javascript
// slower with String
Bop#parse( String data [, Number startFromIndex [, Number limitResultsTo [, Array array ] ] ] ) : Array

// faster with Buffer
Bop#parse( Buffer data [, Number startFromIndex [, Number limitResultsTo [, Array array ] ] ] ) : Array
```

> Change the pattern :

```javascript
Bop#set( Buffer || String pattern ) : Buffer
```

###Usage Example

```javascript
var assert = require( 'assert' )
    , Bop = require( './bop' )
    , pattern = 'hellofolks\r\n\r\n'
    , text = 'hehe' + pattern +'loremipsumhellofolks\r\n' + pattern
	// create a Bop instance that parses the pattern
	, bop = Bop( pattern )
	// parse data from beginning
	, results = bop.parse( text )
	;

// change pattern
bop.set( new Buffer( pattern ) );

// re-parse data passing a Buffer instead of a String
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

See __[bench](./bench)__ dir.


### MIT License

> Copyright (c) 2012 &lt; Guglielmo Ferri : 44gatti@gmail.com &gt;

> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> 'Software'), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:

> __The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.__

> THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
