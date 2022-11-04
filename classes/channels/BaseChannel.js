const Base = require('../Base');

module.exports = class BaseChannel extends Base {
  /** @type {number} */ type;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
  }
};