require('./ignore-ExperimentalWarning');
require('./prototypes');

const base_url = 'https://discord.com/api/v9/';

class User {
  /** @type {string} */ id; 
  /** @type {string} */ username;
  /** @type {string} */ avatar;
  avatar_decoration;
  /** @type {string} */ discriminator;
  /** @type {number} */ public_flags;
  /** @type {number} */ flags;
  banner;
  /** @type {string} */ banner_color;
  /** @type {number} */ accent_color;
  /** @type {string} */ bio;
  /** @type {string} */ tag;

  constructor(o) {
    for(const k in this) {
      this[k] = o[k];
    }
    this.tag = `${this.username}#${this.discriminator}`;
  }
}

class ClientUser extends User {
  /** @type {number} */ purchased_flags;
  /** @type {boolean} */ mfa_enabled;
  /** @type {number} */ premium_type;
  /** @type {string} */ email;
  /** @type {boolean} */ verified;
  /** @type {string} */ phone;
  /** @type {string} */ locale;
  /** @type {boolean} */ nsfw_allowed;

  constructor(o) {
    super(o);
  }
}

class UserManager {
  /** @type {Map<string,User>} */ cache;
  /** @type {string} */ token;

  /**
   * @param {string} token 
   */
  constructor() {
    this.cache = new Map();
  }

  checkToken() {
    if(!this.token)
      throw "UserManager: I don't have a token!";
  }

  /**
   * @param {string} id 
   * @returns {Promise<User>}
   */
  async fetch(id) {
    this.checkToken();
    {
      const stored_user = this.cache.get(id);
      if(stored_user) return stored_user;
    }
    if(this.cache.has(id)) return this.cache.get(id);
    const url = `${base_url}/users/${id}`;
    const headers = { authorization: this.token };
    const init = { method: 'GET', headers };
    const resp = await fetch(url, init);
    const obj = await resp.json();
    if(obj.message)
      throw obj;
    return this.cache.ensure(id, new User(obj));
  }

  /**
   * @returns {Promise<ClientUser>}
   */
  async fetch_me() {
    this.checkToken();
    const url = `${base_url}/users/@me`;
    const headers = { authorization: this.token };
    const init = { method: 'GET', headers };
    const resp = await fetch(url, init);
    const obj = await resp.json();
    if(obj.message)
      throw obj;
    return this.cache.ensure(obj.id, new ClientUser(obj));
  }
}

class Guild {
  /** @type {string} */ id;
  /** @type {string} */ name;

  constructor(o) {
    for(const k in this) {
      this[k] = o[k];
    }
  }
}

class GuildManager {
  /** @type {Map<string,Guild>} */ cache;
  /** @type {string} */ token;

  /**
   * @param {string} token 
   */
  constructor() {
    this.cache = new Map();
  }

  /**
   * @param {string} id 
   * @returns {Promise<Guild>}
   */
  async fetch(id) {
    {
      const stored_guild = this.cache.get(id);
      if(stored_guild) return stored_guild;
    }
    const url = `${base_url}/guilds/${id}`;
    const headers = { authorization: this.token };
    const init = { method: 'GET', headers };
    const resp = await fetch(url, init);
    const obj = await resp.json();
    if(obj.message)
      throw obj;
    return this.cache.ensure(id, new Guild(obj));
  }
}

class Client {
  /** @type {string} */ token;
  /** @type {ClientUser} */ user;
  /** @type {UserManager} */ users;
  /** @type {GuildManager} */ guilds;

  constructor() {
    this.users = new UserManager();
    this.guilds = new GuildManager();
  }

  /**
   * @param {string} token 
   */
  async login(token) {
    this.token = token;
    this.users.token = token;
    this.guilds.token = token;
    this.user = await this.users.fetch_me();
  }
}

module.exports = { Guild, GuildManager, ClientUser, User, UserManager, Client };
