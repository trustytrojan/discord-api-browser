const Base = require('./Base');

module.exports = class Guild extends Base {
  /** @type {string} */ name;
  /** @type {string} */ icon;
  /** @type {string} */ splash;
  /** @type {string} */ discovery_splash;
  /** @type {string} */ owner_id;
  /** @type {string} */ afk_channel_id;
  /** @type {number} */ afk_timeout;
  /** @type {boolean} */ widget_enabled;
  /** @type {string} */ widget_channel_id;
  /** @type {number} */ verification_level;
  /** @type {number} */ default_message_notifications;
  /** @type {number} */ explicit_content_filter;
  //** @type {RoleManager} */ roles;
  /** @type {any[]} */ roles;
  //** @type {GuildEmojiManager} */ emojis;
  /** @type {any[]} */ emojis;
  /** @type {string[]} */ features;
  /** @type {number} */ mfa_level;
  /** @type {string} */ application_id;
  /** @type {string} */ system_channel_id;
  /** @type {number} */ system_channel_flags;
  /** @type {string} */ rules_channel_id;
  /** @type {number} */ max_members;
  /** @type {string} */ vanity_url_code;
  /** @type {string} */ description;
  /** @type {string} */ banner;
  /** @type {number} */ premium_tier;
  /** @type {number} */ premium_subscription_count;
  /** @type {string} */ preferred_locale;
  /** @type {string} */ public_updates_channel_id;
  /** @type {number} */ max_video_channel_users;
  /** @type {number} */ approximate_member_count;
  /** @type {number} */ approximate_presence_count;
  //** @type {any} */ welcome_screen;
  /** @type {number} */ nsfw_level;
  /** @type {any[]} */ stickers;
  /** @type {boolean} */ premium_progress_bar_enabled;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
  }
};