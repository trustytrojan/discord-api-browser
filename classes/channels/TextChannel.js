const TextBasedChannel = require("./TextBasedChannel");

module.exports = class TextChannel extends TextBasedChannel {

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
  }
};