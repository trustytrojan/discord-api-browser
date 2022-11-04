const Base = require('./Base');

module.exports = class Guild extends Base {
  /** @type {string} */ name;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
  }
};