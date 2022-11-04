const BaseChannel = require('./Channel');

module.exports = class ChannelManager extends require('./DataManager') {
  /**
   * @param {Client} client 
   */
  constructor(client) {
    super(client, BaseChannel);
    /** @type {Map<string,BaseChannel>} */ this.cache;
  }

  /**
   * @param {string} id 
   * @returns {Promise<BaseChannel>}
   */
  async fetch(id) {
    return await super.fetch(`/channels/${id}`);
  }
}