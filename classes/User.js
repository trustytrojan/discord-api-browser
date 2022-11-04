const Base = require('./Base');

module.exports = class User extends Base {
  /** @type {string} */ username;
  /** @type {string} */ avatar;
  avatar_decoration;
  /** @type {string} */ discriminator;
  /** @type {number} */ public_flags;
  /** @type {number} */ flags;
  banner;
  /** @type {string} */ banner_color;
  /** @type {number} */ accent_color;
  /** @type {string} */ tag;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
    this.tag = `${this.username}#${this.discriminator}`;
    //this.avatar = 
  }
}