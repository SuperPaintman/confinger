'use strict';
/// <reference path="typings/tds.d.ts"/>
var _ = require("lodash");
var Confinger = (function () {
    function Confinger(opts) {
        if (opts === void 0) { opts = {}; }
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
    Confinger.prototype.add = function (props) {
        _.merge(this._props, props);
        return this;
    };
    /**
     * Get prop of config
     * @param  {string} name
     *
     * @return {any}
     */
    Confinger.prototype.get = function (key) {
        var prop = _.get(this._props, key);
        if (this.opts.emit_error && !prop) {
            throw new Error("The configuration hasn't \"" + key + "\"");
        }
        else {
            return prop;
        }
    };
    /**
     * Set prop into config
     * @param  {string} key
     * @param  {any}    value
     *
     * @return {Confinger}
     */
    Confinger.prototype.set = function (key, value) {
        _.set(this._props, key, value);
        return this;
    };
    /**
     * Checks if prop in config
     * @param  {string}  key
     *
     * @return {boolean}
     */
    Confinger.prototype.has = function (key) {
        return _.has(this._props, key);
    };
    /**
     * Delete prop in confog
     * @param  {string}  key
     *
     * @return {boolean}
     */
    Confinger.prototype.del = function (key) {
        if (this.has(key)) {
            return _.unset(this._props, key);
        }
        else {
            return false;
        }
    };
    return Confinger;
})();
module.exports = Confinger;
