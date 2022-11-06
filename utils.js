const Client = require('./classes/Client');
const { readdirSync, readFileSync } = require('fs');

/**
 * @return {Map<string,string>}
 */
function readHtmlFiles() {
  const html_files = new Map();
  for(const file of readdirSync('./html')) {
    if(!file.endsWith('.html')) continue;
    html_files.set(file.replaceAll('.html', ''), readFileSync(`./html/${file}`).toString());
  }
  return html_files;
}

/**
 * @param {Map<string,string>} html_files 
 * @param {Client} client 
 */
function insertClientInfoIntoHtml(html_files, client) {
  for(const [k,v] of html_files)
    html_files.set(k, v.replace('${client.user.id}', client.user.id).replace('${client.user.tag}', client.user.tag));
}

module.exports = {
  get readHtmlFiles() { return readHtmlFiles; },
  get insertClientInfoIntoHtml() { return insertClientInfoIntoHtml; }
};