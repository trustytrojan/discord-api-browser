const User = require('./User');

module.exports = class DMChannel extends require('./Channel') {
  

  constructor(o) {
    super(o);
    for(const k in this)
      this[k] = o[k];
    this.last_pin_timestamp = new Date(o.last_pin_timestamp);
  }
}