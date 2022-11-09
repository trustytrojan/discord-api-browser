
/**
 * @param {number} x discord channel type represnted as integer
 * @returns {string} normal-person readable channel type
 */
const to_string = (x) => ({
  0: 'Text Channel',
  1: 'DM Channel',
  2: 'Voice Channel',
  3: 'Group DM Channel',
  4: 'Category Channel',
  5: 'Announcement Channel'
})[x];

module.exports = {
  get GuildText() { return 0; },
  get DM() { return 1; },
  get GuildVoice() { return 2; },
  get GroupDM() { return 3; },
  get GuildCategory() { return 4; },
  get GuildAnnouncement() { return 5; },
  get to_string() { return to_string; }
};