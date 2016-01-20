'use strict';
/// <reference path="typings/tds.d.ts"/>

import _ = require("lodash");

interface Options {
    emit_error: boolean;
}

class Confinger {
    private opts: Options;
    private _props: Object;

    constructor(opts = {}) {
        /** Default options */
        this.opts = _.merge({
            // Выкидывать ошибку, если такого параметра не найдено
            emit_error: false
        }, opts);

        /** Props */
        this._props = {};
    }

    /**
     * Add props into config
     * @param  {Object} props
     * 
     * @return {Confinger}
     */
    add(props: Object): Confinger {
        _.merge(this._props, props);
        
        return this;
    }

    /**
     * Get prop of config
     * @param  {string} path
     * 
     * @return {any}
     */
    get(path: string): any {
        var prop = _.get(this._props, path);

        if (this.opts.emit_error && !prop) {
            throw new Error(`The configuration hasn't "${path}"`);
        } else {
            return prop;
        }
    }

    /**
     * Set prop into config
     * @param  {string} path
     * @param  {any}    value
     * 
     * @return {Confinger}
     */
    set(path: string, value: any): Confinger {
        _.set(this._props, path, value);

        return this;
    }

    /**
     * Checks if prop in config
     * @param  {string}  path
     * 
     * @return {boolean}
     */
    has(path: string): boolean {
        return _.has(this._props, path);
    }

    /**
     * Delete prop in confog
     * @param  {string}  path
     * 
     * @return {boolean}
     */
    del(path: string): boolean {
        if (this.has(path)) {
            return _.unset(this._props, path);
        } else {
            return false;
        }
    }
}

export = Confinger;