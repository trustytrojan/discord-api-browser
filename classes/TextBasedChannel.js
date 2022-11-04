const BaseChannel = require('./BaseChannel');

module.exports = class TextBasedChannel extends BaseChannel {
  /** @type {string} */ last_message_id;
  /** @type {Date} */ last_pin_timestamp;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
    this.last_pin_timestamp = new Date(this.last_pin_timestamp);
  }
} 