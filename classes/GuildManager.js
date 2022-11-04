const Guild = require('./Guild');

module.exports = class GuildManager extends require('./DataManager') {
  /**
   * @param {Client} client 
   */
  constructor(client) {
    super(client, Guild);
    /** @type {Map<string,Guild>} */ this.cache;
  }

  /**
   * @param {string} id 
   * @returns {Promise<Guild>}
   */
  async fetch(id) {
    return await super.fetch(`/guilds/${id}`);
  }
}