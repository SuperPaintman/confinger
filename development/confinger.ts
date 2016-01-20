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
     * @param  {string} name
     * 
     * @return {any}
     */
    get(key: string): any {
        var prop = _.get(this._props, key);

        if (this.opts.emit_error && !prop) {
            throw new Error(`The configuration hasn't "${key}"`);
        } else {
            return prop;
        }
    }

    /**
     * Set prop into config
     * @param  {string} key
     * @param  {any}    value
     * 
     * @return {Confinger}
     */
    set(key: string, value: any): Confinger {
        _.set(this._props, key, value);

        return this;
    }

    /**
     * Checks if prop in config
     * @param  {string}  key
     * 
     * @return {boolean}
     */
    has(key: string): boolean {
        return _.has(this._props, key);
    }

    /**
     * Delete prop in confog
     * @param  {string}  key
     * 
     * @return {boolean}
     */
    del(key: string): boolean {
        if (this.has(key)) {
            return _.unset(this._props, key);
        } else {
            return false;
        }
    }
}

export = Confinger;