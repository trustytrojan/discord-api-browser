const Base = require('./Base');

module.exports = class Guild extends Base {
  /** @type {string} */ name;
  /** @type {string} */ icon;
  /** @type {string} */ description;
  /** @type {number} */ memberCount;
  /** @type {string[]} */ features;
  /** @type {string} */ nameAcronym;
  /** @type {boolean} */ partnered;
  /** @type {boolean} */ verified;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
  }
};