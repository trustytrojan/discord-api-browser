const { once } = require('events');
const { writeFileSync, readFileSync, readdirSync } = require('fs');
const { Client } = require('./classes');

const port = 8080;
const client = new Client();

/** @type {Map<string,string>} */
const html_files = new Map();

let current_error;

for(const file of readdirSync('.')) {
  if(!file.endsWith('.html')) continue;
  html_files.set(file, readFileSync(file).toString());
}

require('http').createServer(async (req, res) => {
  const { origin, pathname, searchParams } = new URL(`http://${req.headers.host}${req.url}`);

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

  switch(path_split[0]) {

    // add logout button to every page

    case '/': redirect(`${client.user ? '/main-menu' : '/login'}.html`); break;

    case '/login': {
      if(!searchParams.has('token')) redirect('/login.html');
      const token = searchParams.get('token');
      try { await client.login(token); }
      catch(err) {
        current_error = err;
        redirect('/login-error.html');
        break;
      }
      for(const [k,v] of html_files)
        html_files.set(k, v.replace('${client.user.id}', client.user.id).replace('${client.user.tag}', client.user.tag));
      redirect('/main-menu.html');
    } break;

    // multiple tokens? worry about later
    case '/login.html': {
      try {
        await client.login(require('./token.json'));
        for(const [k,v] of html_files)
          html_files.set(k, v.replace('${client.user.id}', client.user.id).replace('${client.user.tag}', client.user.tag));
        redirect('/main-menu.html');
      } catch(err) { sendHtmlFile(); }
    } break;

    case '/main-menu.html': {
      if(!client.user) { redirect('/login.html'); break; }
      sendHtmlFile();
    } break;

    case '/guilds.html': {
      if(!client.user) { redirect('/login.html'); break; }
      let html = html_files.get('guilds.html');
      if(client.guilds.cache.size === 0)
        html = html.replace('${guilds}', 'No Saved Guilds');
      else {
        let g_str = '';
        for(const { name, id } of client.guilds.cache.values())
          g_str += `<li><a href="/guilds/${id}">${id} ${name}</a></li>`
        html = html.replace('${guilds}', g_str);
      }
      res.write(html);
      res.end();
    } break;

    case '/add-guilds.html': {
      if(!client.user) { redirect('/login.html'); break; }
      switch(req.method) {
        case 'GET': sendHtmlFile(); break;
        case 'POST': {
          let data = await get_post_data();
          data = data.replace('guilds=', '');
          const guild_ids = data.split('\r\n');
          guild_ids.remove_empty_strings(); // defined in prototypes.js
          for(const id of guild_ids)
            await client.guilds.fetch(id);
          redirect('/guilds.html');
        }
      }
    } break;

    case '/users.html': {
      if(!client.user) { redirect('/login.html'); break; }
    } break;

    case '/login-error.html': {
      const html = html_files.get('login-error.html');
      html = html.replace('${error}', current_error);
      sendHtml(html);
    } break;

    default: {
      res.writeHead(404);
      sendHtmlFile('page-not-found.html');
    }
  }
}).listen(port);
