const { once } = require('events');
const { ServerResponse, IncomingMessage, createServer } = require('http');
const { Client } = require('./classes');
const { readSave, insertClientInfoIntoHtml, readHtmlFiles, writeData } = require('./utils');

const port = 8080;
const client = new Client();

/** @type {Map<string,string>} */
const html_files = new Map();

let current_error;

readHtmlFiles(html_files);

// NEXT: SAVE TOKEN, USER ID, AND GUILD IDS TO A JSON FILE
// THEN CHANNEL IDS FOR ONLY DM CHANNELS

function kill() {
  const log = (x) => console.log(`kill: ${x}`);
  log('Process is being killed');
  writeData(client);
  log('Now exiting');
  process.exit();
}

process.on('uncaughtException', (err) => { console.error(err); kill(); });
process.on('SIGINT', kill);
process.on('SIGTERM', kill);

async function main() {
  if(await readSave(client))
    insertClientInfoIntoHtml(html_files, client);
  createServer(server).listen(port);
  console.log(`Listening on port ${port}`);
}

/**
 * @param {IncomingMessage} req 
 * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage; }} res 
 */
async function server(req, res) {
  
  const log = (x) => console.log(`server: ${x}`);

  log(`Incoming request from address [${req.socket.remoteAddress}:${req.socket.remotePort}]`);

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

  const path_split = pathname.split('/');
  path_split.shift();
  switch(path_split[0]) {

    // add logout button to every page

    case '': sendHtmlFile('main-menu'); break;

    // multiple tokens? worry about later
    case 'login': {
      switch(req.method) {
        case 'GET': {
          if(client.user) { break; }
          sendHtmlFile();
        } break;
        case 'POST': {
          const token = (await get_post_data()).eraseAll(['token=', '\r\n']);
          try { await client.login(token); }
          catch(err) { current_error = err; redirect('/login-error'); break; }
          insertClientInfoIntoHtml(html_files, client);
        }
      }
      redirect('/');
    } break;

    case 'guilds': {
      let html;
      switch(path_split[1]) {
        case undefined: {
          html = html_files.get('guilds');
          if(client.guilds.cache.size === 0)
            html = html.replace('${guilds}', 'No Saved Guilds');
          else {
            let g_str = '';
            for(const { name, id } of client.guilds.cache.values())
              g_str += `<tr><td><a href="/guilds/${id}">${id}</a></td><td><a href="/guilds/${id}">${name}</a></td></tr>`;
            html = html.replace('${guilds}', g_str);
          }
        } break;
        default: {
          const guild = await client.guilds.fetch(path_split[1]);
          html = html_files.get('guild-view');
          let g_str = '';
          for(const k in guild)
            g_str += `<tr><th>${k}</th><td>${guild[k]}</td></tr>`;
          html = html.replace('${guild}', g_str);
        }
      }
      res.write(html);
      res.end();
    } break;

    case 'add-guilds': switch(req.method) {
      case 'GET': sendHtmlFile(); break;
      case 'POST': {
        const guild_ids = (await get_post_data()).eraseAll(['guilds=']).split('\r\n');
        guild_ids.remove_empty_strings(); // defined in prototypes.js
        for(const id of guild_ids)
          await client.guilds.fetch(id);
        redirect('/guilds');
      }
    } break;

    case 'users': {

    } break;

    case 'login-error': {
      let html = html_files.get('login-error').replace('${error}', current_error);
      sendHtml(html);
    } break;

    default: {
      res.writeHead(404);
      sendHtmlFile('page-not-found');
    }
  }
}

main();
