/**
 * @return {Map<string,string>}
 */
function readHtmlFiles() {
  const { readdirSync, readFileSync } = require('fs');
  const html_files = new Map();
  for(const file of readdirSync('./html')) {
    if(!file.endsWith('.html')) continue;
    html_files.set(file.replaceAll('.html', ''), readFileSync(`./html/${file}`).toString());
  }
  return html_files;
}

/**
 * @param {Map<string,string>} html_files 
 * @param {import('./classes/Client')} client 
 */
function insertClientInfoIntoHtml(html_files, client) {
  for(const [k,v] of html_files)
    html_files.set(k, v.replace('${client.user.id}', client.user.id).replace('${client.user.tag}', client.user.tag));
}

/**
 * 
 * @param {*} obj 
 * @param {Function} img_func 
 * @returns 
 */
function allImageSizes(obj, img_func) {
  const { img, a } = require('./html/html-utils');
  const { allowed_sizes } = require('./cdn-utils');
  let links; {
    const icons = [];
    for(const size of allowed_sizes) {
      const url = img_func.call(obj, { size });
      icons.push(a(url, size));
    }
    links = icons.join(' ');
  }
  const url = img_func.call(obj, { size: 256 });
  links += '<br>';
  links += a(url, img(url));
  return links;
}

module.exports = {
  get readHtmlFiles() { return readHtmlFiles; },
  get insertClientInfoIntoHtml() { return insertClientInfoIntoHtml; },
  get allImageSizes() { return allImageSizes; }
};