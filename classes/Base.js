const { DiscordSnowflake: { timestampFrom } } = require('@sapphire/snowflake');

module.exports = class Base {
  /** @type {string} */ id;
  /** @type {Date} */ createdAt;
  /** @type {number} */ createdTimestamp;
  
  constructor({ id }) {
    this.id = id;
    this.createdTimestamp = timestampFrom(this.id);
    this.createdAt = new Date(this.createdTimestamp);
  }
};