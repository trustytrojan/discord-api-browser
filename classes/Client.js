const UserManager = require('./managers/UserManager');
const ClientUser = require('./ClientUser');
const ChannelManager = require('./managers/ChannelManager');
const GuildManager = require('./managers/GuildManager');

module.exports = class Client {
  /** @type {string} */ token;
  /** @type {ClientUser} */ user;
  /** @type {UserManager} */ users;
  /** @type {ChannelManager} */ channels;
  /** @type {GuildManager} */ guilds;

  constructor() {
    this.users = new UserManager(this);
    this.channels = new ChannelManager(this);
    this.guilds = new GuildManager(this);
  }

  /**
   * @param {string} token 
   */
  async login(token) {
    this.token = token;
    this.user = await this.users.fetch_me();
  }
};