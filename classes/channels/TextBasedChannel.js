const BaseChannel = require('./BaseChannel');

module.exports = class TextBasedChannel extends BaseChannel {
  /** @type {string} */ last_message_id;
  /** @type {Date} */ last_pin_timestamp;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
    this.last_pin_timestamp = new Date(this.last_pin_timestamp);
  }
};