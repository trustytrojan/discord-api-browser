const DataManager = require('./DataManager');
const User = require('./User');
const ClientUser = require('./ClientUser');

module.exports = class UserManager extends DataManager {
  /**
   * @param {Client} client The client that instantiated this
   */
  constructor(client) {
    super(client, User);
    /** @type {Map<string,User>} */ this.cache;
  }

  /**
   * @param {string} id 
   * @returns {Promise<User>}
   */
  async fetch(id) {
    return await super.fetch(`/users/${id}`);
  }

  /**
   * Should only be used by the Client class for fetching the user associated with its token.
   * @returns {Promise<ClientUser>}
   */
  async fetch_me() {
    const url = `${DataManager.base_url}/users/@me`;
    const resp = await fetch(url, { headers: { authorization: this.client.token } });
    const obj = await resp.json();
    if(obj.message) throw obj;
    this.cache.set(obj.id, new ClientUser(obj));
    return this.cache.get(obj.id);
  }
}