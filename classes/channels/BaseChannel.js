const { tr, th, td } = require('../../html/html-utils');
const Base = require('../Base');
const channel_types = require('./channel-types');

module.exports = class BaseChannel extends Base {
  /** @type {number} */ type;

  constructor(data, client) {
    super(data, client);
    for(const k in this)
      if(data[k] !== undefined)
        this[k] = data[k];
  }

  get typeString() {
    return channel_types.to_string(this.type);
  }

  get htmlTableRows() {
    return [
      super.htmlTableRows,
      tr(th('type'), td(`${this.type} - ${this.typeString}`))
    ].join('');
  }
};