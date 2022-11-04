const { once } = require('events');
const { ServerResponse, IncomingMessage, createServer } = require('http');
const { readSave, insertClientInfoIntoHtml, readHtmlFiles, writeData } = require('./utils');
const Client = require('./classes/Client');
require('./ignore-ExperimentalWarning');
require('./prototypes');

const port = 8080;
const client = new Client();

/** @type {Map<string,string>} */
const html_files = new Map();

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
  else
    process.exit(1);
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

  /** @param {string} filename */
  const sendHtmlFile = (filename) => res.end(html_files.get(filename ?? pathname.replace('/', '')));

  /** @param {Error} err */
  const sendError = (err) => res.end(html_files.get('error').replace('${error}', JSON.stringify(err, null, '  ')));

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
  try { switch(path_split[0]) {

    // this is the root path
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
          let replace_with = '';
          if(client.guilds.cache.size === 0)
            replace_with = 'No Saved guilds';
          else
            for(const { name, id } of client.guilds.cache.values()) {
              const td = (x) => `<td><a href="/guilds/${id}">${x}</a></td>`;
              replace_with += `<tr>${td(id)}${td(name)}</tr>`;
            }
          html = html_files.get('guilds').replace('${guilds}', replace_with);
        } break;
        default: {
          const guild = await client.guilds.fetch(path_split[1]);
          let guilds_table = '';
          for(const k in guild)
            guilds_table += `<tr><th>${k}</th><td>${guild[k]}</td></tr>`;
          html = html_files.get('guild-view')
            .replace('${guild.id}', guild.id)
            .replace('${guild.name}', guild.name)
            .replace('${guild}', guilds_table);
        }
      }
      res.end(html);
    } break;

    case 'add-guilds': switch(req.method) {
      case 'GET': sendHtmlFile(); break;
      case 'POST': {
        const ids = (await get_post_data()).eraseAll(['guilds=']).split('\r\n');
        ids.remove_empty_strings(); // defined in prototypes.js
        for(const id of ids)
          await client.guilds.fetch(id);
        redirect('/guilds');
      }
    } break;

    case 'channels': {
      let html;
      switch(path_split[1]) {
        case undefined: {
          console.log(client.channels.cache);
          let replace_with = '';
          if(client.channels.cache.size === 0)
            replace_with = 'No Saved Channels';
          else
            for(const { name, id } of client.channels.cache.values()) {
              const td = (x) => `<td><a href="/channels/${id}">${x}</a></td>`;
              replace_with += `<tr>${td(id)}${td(name)}</tr>`;
            }
          html = html_files.get('channels').replace('${channels}', replace_with);
        } break;
        default: {
          const channel = await client.channels.fetch(path_split[1]);
          let channels_table = '';
          for(const k in channel)
            channels_table += `<tr><th>${k}</th><td>${channel[k]}</td></tr>`;
          html = html_files.get('channel-view')
            .replace('${channel.id}', channel.id)
            .replace('${channel.name}', channel.name)
            .replace('${channel}', channels_table);
        }
      }
      res.end(html);
    } break;

    case 'add-channels': switch(req.method) {
      case 'GET': sendHtmlFile(); break;
      case 'POST': {
        const ids = (await get_post_data()).eraseAll(['channels=']).split('\r\n');
        ids.remove_empty_strings(); // defined in prototypes.js
        for(const id of ids)
          await client.channels.fetch(id);
        redirect('/channels');
      }
    } break;

    default: {
      res.writeHead(404);
      sendHtmlFile('page-not-found');
    } break;

  } } catch(err) { console.error(err); sendError(err); }
}

main();
