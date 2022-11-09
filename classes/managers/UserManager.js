const DataManager = require('./DataManager');
const User = require('../User');
const ClientUser = require('../ClientUser');

module.exports = class UserManager extends DataManager {
  /**
   * @param {Client} client The client that instantiated this
   */
  constructor(client) {
    super(client, User);
    /** @type {Map<string,User>} */ this.cache;
  }

  /**
   * Fetches and, if not already cached, caches the desired User object from Discord.
   * @param {string} id 
   * @returns {Promise<User>}
   */
  async fetch(id) {
    {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }
    const data = await super.fetch(`/users/${id}`);
    return this.cache.set(id, new User(data)).get(id);
  }

  /**
   * Should only be used by the Client class for fetching the user associated with its token.
   * @returns {Promise<ClientUser>}
   */
  async fetch_me() {
    const data = await super.fetch('/users/@me');
    return this.cache.set(data.id, new ClientUser(data)).get(data.id);
  }

  async fetch_friends() {
    this.busy = true;
    const data = await super.fetch(`/users/@me/relationships`);
    for(const { id } of data)
      await this.fetch(id);
    this.busy = false;
  }
};