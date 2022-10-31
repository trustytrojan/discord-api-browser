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
  /** @type {string} */ #token;

  /**
   * @param {string} token 
   */
  constructor(token) {
    this.#token = token;
    this.cache = new Map();
  }

  /**
   * @param {string} id 
   * @returns {Promise<User>}
   */
  async fetch(id) {
    if(this.cache.has(id)) return this.cache.get(id);
    const url = `${base_url}/users/${id}`;
    const headers = { authorization: this.#token };
    const init = { method: 'GET', headers };
    const resp = await fetch(url, init);
    const obj = await resp.json();
    if(obj.message)
      throw obj.message;
    return this.cache.ensure(id, new User(obj));
  }

  /**
   * @returns {Promise<ClientUser>}
   */
  async fetch_me() {
    const url = `${base_url}/users/@me`;
    const headers = { authorization: this.#token };
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
  /** @type {string} */ #token;

  /**
   * @param {string} token 
   */
  constructor(token) {
    this.#token = token;
    this.cache = new Map();
  }

  /**
   * @param {string} id 
   * @returns {Promise<Guild>}
   */
  async fetch(id) {
    if(this.cache.has(id)) return this.cache.get(id);
    const url = `${base_url}/guilds/${id}`;
    const headers = { authorization: this.#token };
    const init = { method: 'GET', headers };
    const resp = await fetch(url, init);
    const obj = await resp.json();
    if(obj.message === '401: Unauthorized')
      throw obj.message;
    if(obj.errors)
      throw obj.errors.guild_id._errors[0].message;
    return this.cache.ensure(id, new Guild(obj));
  }
}

class Client {
  /** @type {string} */ #token;
  /** @type {ClientUser} */ user;
  /** @type {UserManager} */ users;
  /** @type {GuildManager} */ guilds;

  /**
   * @param {string} token 
   */
  async login(token) {
    this.#token = token;
    this.users = new UserManager(token);
    this.guilds = new GuildManager(token);
    this.user = await this.users.fetch_me();
  }
}

module.exports = { Guild, GuildManager, ClientUser, User, UserManager, Client };
