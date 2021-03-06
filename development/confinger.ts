'use strict';
/// <reference path="typings/tds.d.ts"/>

import _ = require('lodash');

interface Options {
  emitError: boolean;
}

class Confinger {
  private opts: Options;
  private _props: Object;

  constructor(opts = {}) {
    /** Default options */
    this.opts = _.merge({
      // Выкидывать ошибку, если такого параметра не найдено
      emitError: false
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
    const prop = _.get(this._props, path);

    if (this.opts.emitError && prop === undefined) {
      throw new Error(`The configuration hasn't "${path}"`);
    } else {
      return prop;
    }
  }

  /**
   * Get all props of config
   * 
   * @return {any}
   */
  getAll(): any {
    return this._props;
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
   * Delete prop in config
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

  /**
   * Delete all props in config
   * 
   * @return {Confinger}
   */
  delAll(): Confinger {
    this._props = {};

    return this;
  }
}

export = Confinger;