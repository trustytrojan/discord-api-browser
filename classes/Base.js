module.exports = class Base {
  /** @type {string} */ id;

  constructor(o) {
    for(const k in this)
      this[k] = o[k];
  }
}