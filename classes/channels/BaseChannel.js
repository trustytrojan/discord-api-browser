const Base = require('../Base');

module.exports = class BaseChannel extends Base {
  /** @type {number} */ type;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
  }
};