const TextBasedChannel = require('./TextBasedChannel');
const User = require('../User');
const { a, tr, th, td } = require('../../html/html-utils');

module.exports = class DMChannel extends TextBasedChannel {
  /** @type {User} */ recipient;

  constructor(data, client) {
    super(data, client);
    this.recipient = data.recipients[0];
    this.fetchRecipient();
  }

  async fetchRecipient() {
    return this.recipient = await this.client.users.fetch(this.recipient.id);
  }

  get name() {
    const { tag, username, discriminator } = this.recipient;
    return `DM with ${tag ?? `${username}#${discriminator}`}`;
  }

  get htmlTableRows() {
    const { id, tag, username, discriminator } = this.recipient;
    return [
      super.htmlTableRows,
      tr(th('recipient'), td(a(`/users/${id}`, tag ?? `${username}#${discriminator}`)))
    ].join('');
  }
};