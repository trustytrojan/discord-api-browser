const TextBasedChannel = require('./TextBasedChannel');

module.exports = class GroupDMChannel extends TextBasedChannel {
  /** @type {string} */ name;
  /** @type {string} */ owner_id;
  /** @type {User} */ owner;
  /** @type {string} */ icon;
  /** @type {Map<string,User>} */ recipients;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
    this.fetchOwner();
  }

  async fetchOwner() {
    return this.owner = await this.client.users.fetch(this.owner_id);
  }

  async fetchRecipients() {
    this.rec
  }
};