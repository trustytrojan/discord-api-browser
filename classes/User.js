const Base = require('./Base');
const { avatar } = require('../cdn-utils');
const { th, td, tr, img } = require('../html/html-utils');

module.exports = class User extends Base {
  /** @type {string} */ username;
  /** @type {string} */ discriminator;
  /** @type {string} */ avatar;
  /** @type {boolean} */ bot;
  /** @type {string} */ banner;
  /** @type {number} */ accent_color;
  avatar_decoration;
  /** @type {number} */ public_flags;
  /** @type {number} */ flags;
  /** @type {string} */ banner_color;
  /** @type {number} */ accent_color;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
  }

  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  /**
   * @param {number} size
   * @returns {string}
   */
  avatarURL(size) {
    return avatar(this.id, this.avatar, size);
  }

  htmlTableRows() {
    const rows = [
      tr(th('id'), td(this.id)),
      tr(th('username'), td(this.username)),
      tr(th('discriminator'), td(this.discriminator)),
      tr(th('avatar'), td(img(this.avatarURL(4096)))),
    ]
    return rows.join('');
  }
};