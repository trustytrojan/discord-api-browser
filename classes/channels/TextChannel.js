const TextBasedChannel = require("./TextBasedChannel");

module.exports = class TextChannel extends TextBasedChannel {

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
  }
};