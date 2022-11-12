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
    const { th, td, tr, color_square } = require('../html/html-utils');
    const avatars = require('../utils').allImageSizes(this, this.avatarURL);
    //const banners = require('../utils').allImageSizes(this, this.bannerURL);
    console.log(this.accent_color, this.banner_color)
    return [
      super.htmlTableRows,
      tr(th('username'), td(this.username)),
      tr(th('discriminator'), td(this.discriminator)),
      tr(th('bot'), td(this.bot)),
      tr(th('accent_color'), td(color_square(this.accent_color))),
      tr(th('banner_color'), td(color_square(this.banner_color))),
      //tr(th('banner'), td(banners)),
      tr(th('avatar'), td(avatars)),
    ].join('');
  }
};