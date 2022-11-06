const { insertClientInfoIntoHtml, readHtmlFiles } = require('./utils');

require('./ignore-ExperimentalWarning');
require('./prototypes');

const port = 8080;
const client = new (require('./classes/Client'))();
const html_files = readHtmlFiles();

// NEXT: SAVE TOKEN, USER ID, AND GUILD IDS TO A JSON FILE
// THEN CHANNEL IDS FOR ONLY DM CHANNELS

//process.on('uncaughtException', (err) => { console.error(err); kill(); });
//process.on('SIGINT', kill);
//process.on('SIGTERM', kill);

async function main() {
  let token;
  try { token = require('./token.json'); }
  catch(err) { console.error('No `token.json` file found!'); }

  if(token) try {
    await client.login(token);
    insertClientInfoIntoHtml(html_files, client);
  } catch(err) { console.error('Invalid user token!'); }

  require('http').createServer(require('./server')(html_files, client)).listen(port);
  console.log(`Listening on for requests on http://localhost:8080`);
}

main();
