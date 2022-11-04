const DMChannel = require('./DMChannel');

module.exports = class GroupDMChannel extends DMChannel {
  /** @type {string} */ name;
  /** @type {string} */ owner_id;
  /** @type {string} */ icon;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
  }
};