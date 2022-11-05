module.exports = class DataManager {
  static base_url = 'https://discord.com/api/v10';

  /** @type {Client} */ client;
  /** @type {Map<string,any>} */ cache;

  /**
   * @param {Client} client 
   */
  constructor(client) {
    this.client = client;
    this.cache = new Map();
  }

  async checkCached(id) {
    const cached = this.cache.get(id);
    if(cached) return cached;
  }

  /**
   * Returns the raw JSON object received by the Discord API at the desired path.
   * @param {string} api_path Should take the form of `/path/id`
   * @returns {any}
   */
  async fetch(api_path) {
    const url = `${DataManager.base_url}${api_path}`;
    console.log(`Fetching ${url}`);

    const resp = await fetch(url, { headers: { authorization: this.client.token } });
    const obj = await resp.json();

    // discord responds with a `message` property to indicate an error
    if(obj.message) throw obj;

    return obj;
  }
};