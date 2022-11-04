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

class Channel {
  /** @type {string} */ id;
  /** @type {string} */ name;

  constructor(o) {
    for(const k in this) {
      this[k] = o[k];
    }
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

class DataManager {
  /** @type {Client} */ client;
  /** @type {() => any} */ dataConstructor;
  /** @type {Map<string,any>} */ cache;

  /**
   * @param {Client} client 
   * @param {() => any} dataConstructor 
   */
  constructor(client, dataConstructor) {
    this.client = client;
    this.dataConstructor = dataConstructor;
    this.cache = new Map();
  }

  /**
   * @param {string} api_path Should take the form of `/path/id`
   * @returns {any}
   */
  async fetch(api_path) {
    const url = base_url+api_path;
    console.log(`Fetching ${this.dataConstructor.name} from ${url}`)
    const id = api_path.substring(1+api_path.lastIndexOf('/'));
    {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }
    const resp = await fetch(url, { headers: { authorization: this.client.token } });
    const obj = await resp.json();
    // discord responds with a `message` property to indicate an error
    if(obj.message) throw obj;
    this.cache.set(id, new this.dataConstructor(obj));
    return this.cache.get(id);
  }
}

class UserManager extends DataManager {
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
    const url = `${base_url}/users/@me`;
    const resp = await fetch(url, { headers: { authorization: this.client.token } });
    const obj = await resp.json();
    if(obj.message) throw obj;
    this.cache.set(obj.id, new ClientUser(obj));
    return this.cache.get(obj.id);
  }
}

class ChannelManager extends DataManager {
  /**
   * @param {Client} client 
   */
  constructor(client) {
    super(client, Channel);
    /** @type {Map<string,Channel>} */ this.cache;
  }

  /**
   * @param {string} id 
   * @returns {Promise<Channel>}
   */
  async fetch(id) {
    return await super.fetch(`/channels/${id}`);
  }
}

class GuildManager extends DataManager {
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

class Client {
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
}

module.exports = { Guild, GuildManager, ClientUser, User, UserManager, Client };
