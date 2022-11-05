const Client = require('./classes/Client');
const { writeFileSync, readFileSync, readdirSync } = require('fs');

const save_filename = './save.json';

/**
 * @param {Client} client
 */
async function readSave(client) {
  const log = (x) => console.log(`readSave: ${x}`);
  log('Attempting to read save file...');
  let token;
  try { ({ token } = require('./save.json')); } 
  catch(err) {
    log('No save file found');
    return false;
  }
  try { await client.login(token); }
  catch(err) {
    log('Could not login with token!');
    console.error(err);
    return false;
  }
  log(`Save file read, client is logged in as ${client.user.tag}`);
  return true;
}

/**
 * @param {Client} client 
 */
function writeSave(client) {
  const log = (x) => console.log(`writeData: ${x}`);
  log(`Writing save data to ${save_filename}...`);
  const save = {
    token: client.token,
    guilds: Array.from(client.guilds.cache.keys()),
    //users: Array.from(client.users.cache.keys()),
    channels: Array.from(client.channels.cache.keys())
  };
  writeFileSync(save_filename, JSON.stringify(save, null, '  '));
  log('Done');
}

/**
 * @param {Map<string,string>} html_files
 */
function readHtmlFiles(html_files) {
  const log = (x) => console.log(`readHtmlFiles: ${x}`);
  log('Reading all HTML files into memory...');
  for(const file of readdirSync('./html')) {
    if(!file.endsWith('.html')) continue;
    html_files.set(file.replaceAll('.html', ''), readFileSync(`./html/${file}`).toString());
  }
  log('Done');
}

/**
 * @param {Map<string,string>} html_files 
 * @param {Client} client 
 */
function insertClientInfoIntoHtml(html_files, client) {
  const log = (x) => console.log(`insertClientInfoIntoHtml: ${x}`);
  log('Inserting client information into html...');
  for(const [k,v] of html_files)
    html_files.set(k, v.replace('${client.user.id}', client.user.id).replace('${client.user.tag}', client.user.tag));
  log('Done');
}

module.exports = {
  get readSave() { return readSave; },
  get writeSave() { return writeSave; },
  get readHtmlFiles() { return readHtmlFiles; },
  get insertClientInfoIntoHtml() { return insertClientInfoIntoHtml; }
};