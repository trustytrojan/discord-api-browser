const TextBasedChannel = require("./TextBasedChannel");

module.exports = class DMChannel extends TextBasedChannel {
  /** @type {User[]} */ recipients;

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
  }
}
