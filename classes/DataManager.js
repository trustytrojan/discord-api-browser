module.exports = class DataManager {
  static base_url = 'https://discord.com/api/v9';

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
    const url = DataManager.base_url+api_path;
    console.log(`Fetching ${url}`)
    const id = api_path.substring(1+api_path.lastIndexOf('/'));
    {
      const cached = this.cache.get(id);
      if(cached) return cached;
    }
    const resp = await fetch(url, { headers: { authorization: this.client.token } });
    const obj = await resp.json();
    // discord responds with a `message` property to indicate an error
    if(obj.message) throw obj;
    return this.cache.set(id, new this.dataConstructor(obj)).get(id);
  }
}