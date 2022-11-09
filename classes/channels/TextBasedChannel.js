const { td, tr, th } = require('../../html/html-utils');
const BaseChannel = require('./BaseChannel');

module.exports = class TextBasedChannel extends BaseChannel {
  /** @type {string} */ last_message_id;
  /** @type {string} */ last_pin_timestamp;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
  }

  get last_pin_at() {
    return new Date(this.last_pin_timestamp);
  }

  get htmlTableRows() {
    const last_pin = (this.last_pin_timestamp) ? this.last_pin_at : 'messages were never pinned in this channel';
    return [
      super.htmlTableRows,
      tr(th('last_message_id'), td(this.last_message_id)),
      tr(th('last_pin_timestamp'), td(last_pin))
    ].join('');
  }
};