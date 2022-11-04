module.exports = class Channel extends require('./Base') {
  /** @type {number} */ type;
  /** @type {string} */ name;
  /** @type {string} */ last_message_id;
  /** @type {Date} */ last_pin_timestamp;
  /** @type {User[]} */ recipients;
  /** @type {string} */ owner_id;
  /** @type {string} */ icon;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
    
  }
}