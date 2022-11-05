const Client = require("./Client");

const discord_epoch = 1420070400000n;

/**
 * Retrieves the timestamp field's value from a snowflake.
 * @param {string|bigint} id The snowflake to get the timestamp value from.
 * @returns {number} The UNIX timestamp that is stored in `id`.
 */
const timestampFrom = (id) => Number((BigInt(id) >> 22n) + discord_epoch);

module.exports = class Base {
  /** @type {Client} */ client;
  /** @type {string} */ id;
  /** @type {Date} */ created_at;
  
  constructor({ id }, client) {
    this.client = client;
    this.id = id;
    this.created_at = new Date(timestampFrom(this.id));
  }
};