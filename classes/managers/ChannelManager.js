const { GuildText, DM, GuildVoice, GroupDM } = require('../channels/channel-types');
const BaseChannel = require('../channels/BaseChannel');
const DataManager = require('./DataManager');

function create_correct_channel(data, client) {
  const DMChannel = require('../channels/DMChannel');
  const GroupDMChannel = require('../channels/GroupDMChannel');
  switch(data.type) {
    case GuildText: return;
    case DM: return new DMChannel(data, client);
    case GuildVoice: return;
    case GroupDM: return new GroupDMChannel(data, client);
    default: return new BaseChannel(data, client);
  }
}

module.exports = class ChannelManager extends DataManager {
  /**
   * @param {Client} client 
   */
  constructor(client) {
    super(client, BaseChannel);
    /** @type {Map<string,BaseChannel>} */ this.cache;
  }

  /**
   * Fetches and, if not already cached, caches the desired Channel object from Discord.
   * @param {string} id 
   * @returns {Promise<BaseChannel>}
   */
  async fetch(id) {
    {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }
    const data = await super.fetch(`/channels/${id}`);
    const channel = create_correct_channel(data, this.client);
    return this.cache.set(id, channel).get(id);
  }
};