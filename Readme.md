### Bop

[![NPM VERSION](http://img.shields.io/npm/v/bop.svg?style=flat)](https://www.npmjs.org/package/bop)
[![CODACY BADGE](https://img.shields.io/codacy/b18ed7d95b0a4707a0ff7b88b30d3def.svg?style=flat)](https://www.codacy.com/public/44gatti/bop)
[![CODECLIMATE-TEST-COVERAGE](https://img.shields.io/codeclimate/coverage/github/rootslab/bop.svg?style=flat)](https://codeclimate.com/github/rootslab/bop)
[![LICENSE](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://github.com/rootslab/bop#mit-license)

![NODE VERSION](https://img.shields.io/node/v/bop.svg)
[![TRAVIS CI BUILD](http://img.shields.io/travis/rootslab/bop.svg?style=flat)](http://travis-ci.org/rootslab/bop)
[![BUILD STATUS](http://img.shields.io/david/rootslab/bop.svg?style=flat)](https://david-dm.org/rootslab/bop)
[![DEVDEPENDENCY STATUS](http://img.shields.io/david/dev/rootslab/bop.svg?style=flat)](https://david-dm.org/rootslab/bop#info=devDependencies)

[![NPM MONTHLY](http://img.shields.io/npm/dm/bop.svg?style=flat)](http://npm-stat.com/charts.html?package=bop)
![NPM YEARLY](https://img.shields.io/npm/dy/bop.svg)

[![NPM GRAPH](https://nodei.co/npm/bop.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/bop/)

 * __Bop__ is a __very fast Boyer-Moore parser__ for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 bytes.
 * It is __ideal__, for example, to parse streams like __multipart/form-data__ ones, in which pattern/boundary length < ~70 bytes).

### Main features

> Given a m-length pattern and n-length data, and σ-length alphabet ( σ = 256 ):

- it performs the comparisons from right to left.
- preprocessing phase in __O(m+σ)__ time and space complexity.
- searching phase in __O(m*n)__ time complexity.
- __3*n__ text character comparisons in the worst case when searching for a non periodic pattern.
- __O(n/m)__ best performance.

> See __[Lecroq](http://www-igm.univ-mlv.fr/~lecroq/string/node14.html)__ for reference and also __[Qap](https://github.com/rootslab/qap)__, a QuickSearch parser.

### Install
```bash
$ npm install bop [-g]
```

> __require__:

```javascript
var Bop = require( 'bop' );
```

### Run Tests

```javascript
$cd bop/
$npm test
```

> __to execute a single test file simply do__:

```bash
 $ node test/file-name.js
```

### Run Benchmarks

```bash
$ cd bop/
$ npm run bench
```

### Constructor

> Create an instance, using a pattern.

```javascript
Bop( Buffer pattern | String pattern )
// or
new Bop( Buffer pattern | String pattern )
```

### Methods

> Arguments within [] are optional.

```javascript
// Change the pattern to search.
Bop#set( Buffer pattern | String pattern ) : Buffer

/*
 * Count matches, optionally without overlapping sequences,
 * starting from a particular index (default is 0).
 * It returns an Array containing the number of matches,
 * then, if distance switch is on, it returns also the maximum
 * distance found between 2 patterns.
 * NOTE: if 0 or only 1 occurrence was found, the max distance will
 * be -1 and then the resulting array will be respectvely [0, -1]
 * and [1, -1]. 
 */
Bop#count( Buffer data [, Number start_from [, Boolean sparse [, Boolean distance ] ] ] ) : Array

/*
 * Collect all indexes of pattern occurrences.
 *
 * As options you can:
 *
 * - start parsing from a particular index,
 * - limit the number of results to parse
 * - fill your array with resulting indexes.
 *
 * NOTE: use Buffers when possible (faster).
 *
 */
Bop#parse( Buffer data | String data [, Number start_from [, Number limit_results [, Array my_array ] ] ] ) : Array

/*
 * Strict parse, it's the same as parse, without collecting
 * any overlapping sequences.
 *
 * Example with CRLF sequence:
 *
 * - bop pattern is set to: "\r\n\r\n"                 (CR LF CR LF)
 * - data to parse is:      "\r\n\r\n\r\n\r\n\r\n\r\n" (CR LF CR LF CR LF CR LF )
 * 
 * - with Bop.parse( data ) we get 3 indexes as results: [0, 2, 4]
 *
 *       0  1  2  3  4  5  6  7
 *      -----------------------
 *   p: CR LF CR LF
 *   d: CR LF CR LF CR LF CR LF
 *
 *   p: ----> CR LF CR LF
 *   d: CR LF CR LF CR LF CR LF
 *
 *   p: ----------> CR LF CR LF
 *   d: CR LF CR LF CR LF CR LF
 *
 * - with Bop.sparse( data ) we get only 2 results: [0, 4]
 *
 *       0  1  2  3  4  5  6  7
 *      -----------------------
 *   p: CR LF CR LF
 *   d: CR LF CR LF CR LF CR LF
 *
 *   p: ----------> CR LF CR LF
 *   d: CR LF CR LF CR LF CR LF
 *
 */
Bop#sparse( Buffer data | String data [, Number start_from [, Number limit_results [, Array my_array ] ] ] ) : Array
```

### Usage Example

```javascript
var Bop = require( 'bop' )
    , pattern = 'hellofolks\r\n'
    , somedata = 'hehehe' + pattern +'eheheh' + pattern
    , bop = Bop( pattern )
    // parse data from beginning
    , results = bop.parse( somedata )
    ;

```
> See __[examples](example/)__.


#### Benchmark for a short pattern ( length <= 255 bytes )

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


#### Benchmark for a big pattern ( length > 255 bytes )

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

> Copyright (c) 2013-present &lt; Guglielmo Ferri : 44gatti@gmail.com &gt;

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
