const Base = require('./Base');
const cdn = require('../cdn-utils');

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
   * @param {cdn.ImageURLOptions} options
   * @returns {string}
   */
  avatarURL(options) {
    return cdn.avatar(this.id, this.avatar, options);
  }

  get htmlTableRows() {
    const { th, td, tr, a, img } = require('../html/html-utils');
    let links;
    {
      const avatars = [];
      for(const size of cdn.allowed_sizes) {
        const url = this.avatarURL({ size });
        avatars.push(a(url, size));
      }
      links = avatars.join(' ');
      const url = this.avatarURL({ size: 256 });
      links += '<br>';
      links += a(url, img(url));
    }

    return [
      super.htmlTableRows,
      tr(th('username'), td(this.username)),
      tr(th('discriminator'), td(this.discriminator)),
      tr(th('avatar'), td(links)),
    ].join('');
  }
};