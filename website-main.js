const { once } = require('events');
const { writeFileSync, readFileSync, readdirSync } = require('fs');
const { Client } = require('./classes');
const { string_erase_all } = require('./utils')

const port = 8080;
const client = new Client();

/** @type {Map<string,string>} */
const html_files = new Map();

let current_error;

for(let file of readdirSync('.')) {
  if(!file.endsWith('.html')) continue;
  html_files.set(file.replaceAll('.html', ''), readFileSync(file).toString());
}

// NEXT: SAVE TOKEN, USER ID, AND GUILD IDS TO A JSON FILE

//console.log(html_files);
//process.exit();

require('http').createServer(async (req, res) => {
  const { origin, pathname } = new URL(`http://${req.headers.host}${req.url}`);

  /** @param {string} new_path */
  const redirect = (new_path) => res.writeHead(302, { location: `${origin}${new_path}` }).end();

  /** @param {string} html */
  const sendHtml = (html) => res.end(html);

  /** @param {string} filename */
  const sendHtmlFile = (filename) => res.end(html_files.get(filename ?? pathname.replace('/', '')));

  async function get_post_data() {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    await once(req, 'end');
    return data;
  }

  // if not logged in, force user to log in
  if(!client.user && pathname !== '/login') {
    redirect('/login');
    return;
  }

  switch(pathname) {

    // add logout button to every page

    case '/': sendHtmlFile('main-menu'); break;

    // multiple tokens? worry about later
    case '/login': {
      switch(req.method) {
        case 'GET': {
          try { await client.login(require('./token.json')); }
          catch(err) { sendHtmlFile(); }
        } break;
        case 'POST': {
          const token = string_erase_all(await get_post_data(), ['token=', '\r\n']);
          try { await client.login(token); }
          catch(err) { current_error = err; redirect('/login-error'); break; }
        }
      }
      for(const [k,v] of html_files)
        html_files.set(k, v.replace('${client.user.id}', client.user.id).replace('${client.user.tag}', client.user.tag));
      redirect('/');
    } break;

    case '/guilds': {
      let html = html_files.get('guilds');
      if(client.guilds.cache.size === 0)
        html = html.replace('${guilds}', 'No Saved Guilds');
      else {
        let g_str = '';
        for(const { name, id } of client.guilds.cache.values())
          g_str += `<tr><td><a href="/guilds/${id}">${id}</a></td><td><a href="/guilds/${id}">${name}</a></td></tr>`;
        html = html.replace('${guilds}', g_str);
      }
      res.write(html);
      res.end();
    } break;

    case '/add-guilds': switch(req.method) {
      case 'GET': sendHtmlFile(); break;
      case 'POST': {
        const guild_ids = string_erase_all(await get_post_data(), ['guilds=']).split('\r\n');
        guild_ids.remove_empty_strings(); // defined in prototypes.js
        for(const id of guild_ids)
          await client.guilds.fetch(id);
        redirect('/guilds');
      }
    } break;

    case '/users': {

    } break;

    case '/login-error': {
      const html = html_files.get('login-error');
      html = html.replace('${error}', current_error);
      sendHtml(html);
    } break;

    default: {
      res.writeHead(404);
      sendHtmlFile('page-not-found');
    }
  }
}).listen(port);
