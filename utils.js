const input = require('./input');

module.exports = {

  /**
   * @returns {Promise<string>}
   */
  async get_token() {
    const token_file = './token.json'
    console.log('Reading token from disk...');
    try { return require(token_file); }
    catch(err) { console.log('token file not found.'); }
    // const token = await input('Enter your Discord user token: ');
    // switch(await input('Do you want to save your token? (Yes/No) ')) {
    //   case 'yes':
    //   case 'y':
    //     writeFileSync(token_file, JSON.stringify(token));
    // }
    return token;
  }

};
