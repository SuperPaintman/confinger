# Confinger
A simple way to store application configuration

## Installation
```sh
npm install confinger --save
```

--------------------------------------------------------------------------------

## Usage
```js
const Confinger = require("confinger");
const fileConfig = require("./configs.json");

let configs = new Confinger();

configs
    // Let, add default props
    .add({
        server: {
            port:   80,
            ip:     '127.0.0.1'
        },

        db: {
            "host": "localhost",
            "port": 27017,
            "name": "blog"
        }
    })
    // configs from file
    .add(fileConfig)
    // also process env
    .add({
        db: {
            "name": process.env.DB_NAME
        }
    })
    // And of course, arguments
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
    * **emit_error** {`Boolean`} - is needs to throw an error if no such property. *default*: `false`

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
Gets the value at path of config. If the resolved value is undefined then returns `undefined`. If instance *emit_error* options set by `true`, then throws error.

**Arguments**
* **path** {`String`} - path to value in config object

**Returns**
* {`Any|Undefined`} value of path

**Example**

Without throw error

```js
let configs = new Confinger();
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.get("server.port"); // <- 80
configs.get("db.port"); // <- Undefined
```

and without throw error. This is useful if the props is necessary to app work, like `db password` or `password secret`

```js
let configs = new Confinger({
    emit_error: true
});
configs.add({
    server: {
        port:   80,
        ip:     '127.0.0.1'
    }
});

configs.get("server.port"); // <- 80
configs.get("db.port"); // <- throw Error: `The configuration hasn't "db.port"`
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
configs.set("db.password", "toor");
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

configs.has("server.port"); // <- true
configs.has("db.password"); // <- false
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

configs.del("server.port"); // <- true
configs.del("db.password"); // <- false
```

--------------------------------------------------------------------------------

## Changelog
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