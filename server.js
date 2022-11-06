const { ServerResponse, IncomingMessage } = require('http');
const Client = require('./classes/Client');
const DMChannel = require('./classes/channels/DMChannel');
const GroupDMChannel = require('./classes/channels/GroupDMChannel');
const { tr, td, a } = require('./html/html-utils');
const { insertClientInfoIntoHtml } = require('./utils');

/**
 * This should be called by main.js to generate a server function.
 * @param {Map<string,string>} html_files 
 * @param {Client} client 
 * @returns 
 */
module.exports = function(html_files, client) {

  /**
   * @param {IncomingMessage} req 
   * @param {ServerResponse<IncomingMessage> & { req: IncomingMessage; }} res 
   */
  return async function(req, res) {
    
    console.log(`Incoming request from address [${req.socket.remoteAddress}:${req.socket.remotePort}]`);
  
    const { origin, pathname } = new URL(`http://${req.headers.host}${req.url}`);
  
    /** @param {string} new_path */
    const redirect = (new_path) => res.writeHead(302, { location: `${origin}${new_path}` }).end();
  
    /** @param {string} filename */
    const sendHtmlFile = (filename) => res.end(html_files.get(filename));
  
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
  
    const route = pathname.split('/');
    route.shift();
    try { switch(route[0]) {

      // this is the root path
      case '': sendHtmlFile('main-menu'); break;
  
      // multiple tokens? worry about later
      case 'login': {
        switch(req.method) {
          case 'GET': {
            if(client.user) { break; }
            sendHtmlFile('login');
          } break;
          case 'POST': {
            const token = (await get_post_data()).eraseAll(['token=', '\r\n']);
            try { await client.login(token); }
            catch(err) { current_error = err; redirect('/error'); break; }
            insertClientInfoIntoHtml(html_files, client);
          }
        }
        redirect('/');
      } break;
  
      case 'guilds': {
        let html;
        if(client.guilds.busy) {
          res.end(html_files.get('busy-fetching').replace('${something}', 'guilds'));
          break;
        }
        switch(route[1]) {
          case undefined: {
            let replace_with = '';
            if(client.guilds.cache.size === 0)
              replace_with = '<td colspan="2" style="color:gray;padding:5px">guild cache is empty</td>';
            else
              for(const { name, id } of client.guilds.cache.values()) {
                const link = `/guilds/${id}`;
                replace_with += tr(td(a(link, id)), td(a(link, name)));
              }
            html = html_files.get('guilds').replace('${guilds}', replace_with);
          } break;
          case 'fetch': {
            await client.guilds.fetchAll();
            redirect('/guilds');
          } break;
          default: {
            const guild = await client.guilds.fetch(route[1]);
            html = html_files.get('guild-view')
              .replace('${guild.name}', guild.name)
              .replace('${guild.id}', guild.id)
              .replace('${table_rows}', guild.htmlTableRows());
          }
        }
        res.end(html);
      } break;
  
      // case 'channels': {
        
      // } break;
  
      case 'users': {
        let html;
        if(client.guilds.busy) {
          res.end(html_files.get('busy-fetching').replace('${something}', 'users'));
          break;
        }
        switch(route[1]) {
          case undefined: {
            let replace_with = '';
            if(client.users.cache.size === 0)
              replace_with = 'No Saved Users';
            else
              for(const { id, tag } of client.users.cache.values()) {
                const td = (x) => `<td><a href="/users/${id}">${x}</a></td>`;
                replace_with += `<tr>${td(id)}${td(tag)}</tr>`;
              }
            html = html_files.get('users').replace('${users}', replace_with);
          } break;
          default: {
            const user = await client.users.fetch(route[1]);
            html = html_files.get('user-view')
              .replace('${user.tag}', user.tag)
              .replace('${user.id}', user.id)
              .replace('${table_rows}', user.htmlTableRows());
          }
        }
        res.end(html);
      } break;
  
      default: {
        res.writeHead(404);
        sendHtmlFile('page-not-found');
      } break;
  
    } } catch(err) { console.error(err); sendError(err); }
  }
};