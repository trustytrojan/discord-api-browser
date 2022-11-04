const { GuildText, DM } = require('../channels/channel-types');
const BaseChannel = require('../channels/BaseChannel');
const DataManager = require('./DataManager');
const DMChannel = require('../channels/DMChannel');

module.exports = class ChannelManager extends DataManager {
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
    const data = await super.fetch(`/channels/${id}`);
    let channel;
    switch(data.type) {
      case GuildText: break;
      case DM: channel = new DMChannel(data); break;
    }
    return this.cache.set(id, channel).get(id);
  }
};