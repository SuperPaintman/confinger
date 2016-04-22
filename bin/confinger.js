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
     * @param  {string} path
     *
     * @return {any}
     */
    Confinger.prototype.get = function (path) {
        var prop = _.get(this._props, path);
        if (this.opts.emit_error && !prop) {
            throw new Error("The configuration hasn't \"" + path + "\"");
        }
        else {
            return prop;
        }
    };
    /**
     * Get all props of config
     *
     * @return {any}
     */
    Confinger.prototype.getAll = function () {
        return this._props;
    };
    /**
     * Set prop into config
     * @param  {string} path
     * @param  {any}    value
     *
     * @return {Confinger}
     */
    Confinger.prototype.set = function (path, value) {
        _.set(this._props, path, value);
        return this;
    };
    /**
     * Checks if prop in config
     * @param  {string}  path
     *
     * @return {boolean}
     */
    Confinger.prototype.has = function (path) {
        return _.has(this._props, path);
    };
    /**
     * Delete prop in config
     * @param  {string}  path
     *
     * @return {boolean}
     */
    Confinger.prototype.del = function (path) {
        if (this.has(path)) {
            return _.unset(this._props, path);
        }
        else {
            return false;
        }
    };
    /**
     * Delete all props in config
     *
     * @return {Confinger}
     */
    Confinger.prototype.delAll = function () {
        this._props = {};
        return this;
    };
    return Confinger;
}());
module.exports = Confinger;
