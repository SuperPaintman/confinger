# Confinger

[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![NPM version][npm-v-image]][npm-url]
[![NPM Downloads][npm-dm-image]][npm-url]
[![Test Coverage][coveralls-image]][coveralls-url]


A simple way to store application configuration

## Installation
```sh
npm install confinger --save
```

--------------------------------------------------------------------------------

## Usage
```js
const Confinger = require('confinger');
const fileConfig = require('./configs.json');

const configs = new Confinger();
configs
    // Let's, add default props
    .add({
        server: {
            port:   80,
            ip:     '127.0.0.1'
        },

        db: {
            host: 'localhost',
            port: 27017,
            name: 'blog'
        }
    })
    // configs from file
    .add(fileConfig)
    // also process env
    .add({
        db: {
            name: process.env.DB_NAME
        }
    })
    // and of course, arguments
    .add({
        port: process.argv[3]
    });
    
// Now, we can get any props
const port = configs.get('server.port');
```

--------------------------------------------------------------------------------

## API
### Confinger
**Arguments**
* **opts** {`Object`}
    * **emitError** {`Boolean`} - is needs to throw an error if no such property. *default*: `false`

### Confinger\#add
Loads the properties of the configuration.

**Arguments**
* **props** {`Object`}

**Returns**
* current config instance

**Example**

```js
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});
```

### Confinger\#get
Gets the value at path of config. If the resolved value is undefined then returns `undefined`. If instance *emitError* options set by `true`, then throws error.

**Arguments**
* **path** {`String`} - path to value in config object

**Returns**
* {`Any|Undefined`} value of path

**Example**

Without throw error

```js
const configs = new Confinger();
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.get('server.port'); // <- 80
configs.get('db.port'); // <- Undefined
```

and without throw error. This is useful if the props is necessary to app work, like `db password` or `password secret`

```js
const configs = new Confinger({
    emitError: true
});
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.get('server.port'); // <- 80
configs.get('db.port'); // <- throw Error: `The configuration hasn't "db.port"`
```

### Confinger\#getAll
Get the all value of config.

**Returns**
* {`Object`} all values

**Example**

```js
const configs = new Confinger();
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.getAll();
/**
 * {
 *     server: {
 *         port:   80,
 *         ip:     '127.0.0.1'
 *     }
 * }
 */
```

### Confinger\#set
Sets single property into config.

**Arguments**
* **path** {`String`} - path to value in config object
* **value** {`Any`} - value of path

**Returns**
* current config instance

**Example**

```js
configs.set('db.password', 'toor');
```

### Confinger\#has
Checks if prop of config instance.

**Arguments**
* **path** {`String`} - path to value in config object

**Returns**
* {`Boolean`} returns *true* if path exists, else *false*

**Example**

```js
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.has('server.port'); // <- true
configs.has('db.password'); // <- false
```

### Confinger\#del
Removes the property at path of config instance.

**Arguments**
* **path** {`String`} - path to value in config object

**Returns**
* {`Boolean`} returns *true* if the property is deleted, else *false*.

**Example**

```js
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.del('server.port'); // <- true
configs.del('db.password'); // <- false
```

### Confinger\#delAll
Removes the all property of config instance.

**Returns**
* current config instance

**Example**

```js
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.delAll();

configs.getAll(); // <- {}
```

--------------------------------------------------------------------------------

## Changelog
### 2.0.0 [`Stable`]
```diff
+ Fixed throwing error if property is undefined
+ Renamed `emit_error` -> `emitError`
```

### 1.2.0 [`Stable`]
```diff
+ Added `Confinger#delAll` method
```

### 1.1.0 [`Stable`]
```diff
+ Added `Confinger#getAll` method
```

### 1.0.0 [`Stable`]
```diff
+ First realise
```

--------------------------------------------------------------------------------

## License
Copyright (c)  2016 [Alexander Krivoshhekov](http://github.com/SuperPaintman)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-url]: https://www.npmjs.com/package/confinger
[npm-v-image]: https://img.shields.io/npm/v/confinger.svg
[npm-dm-image]: https://img.shields.io/npm/dm/confinger.svg
[travis-image]: https://img.shields.io/travis/SuperPaintman/confinger/master.svg?label=linux
[travis-url]: https://travis-ci.org/SuperPaintman/confinger
[appveyor-image]: https://img.shields.io/appveyor/ci/SuperPaintman/confinger/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/SuperPaintman/confinger
[coveralls-image]: https://img.shields.io/coveralls/SuperPaintman/confinger/master.svg
[coveralls-url]: https://coveralls.io/r/SuperPaintman/confinger?branch=master
