const TextBasedChannel = require('./TextBasedChannel');

module.exports = class DMChannel extends TextBasedChannel {
  /** @type {User[]} */ recipients;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
    this.recipient = data.recipients[0].id;
  }
};