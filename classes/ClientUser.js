const User = require('./User');

module.exports = class ClientUser extends User {
  /** @type {string} */ bio;
  /** @type {number} */ purchased_flags;
  /** @type {boolean} */ mfa_enabled;
  /** @type {number} */ premium_type;
  /** @type {string} */ email;
  /** @type {boolean} */ verified;
  /** @type {string} */ phone;
  /** @type {string} */ locale;
  /** @type {boolean} */ nsfw_allowed;

  constructor(o) {
    super(o);
    for(const k in this)
      if(o[k] !== undefined)
        this[k] = o[k];
  }
};