const { Client } = require('./classes');
const { writeFileSync, readFileSync } = require('fs');
const { createServer } = require('http');

const port = 8080;

const client = new Client();

createServer(async (req, res) => {
  const url = new URL(`http://${req.headers.host}${req.url}`);
  const redirect = (x) => res.writeHead(302, { location: `${url.origin}${x}` }).end();
  const sendHtml = (x) => { res.write(readFileSync(x ?? `.${url.pathname}`)); res.end(); };
  switch(url.pathname) {

    case '/': {
      const redirect_path = ((client.user) ? '/logged-in' : '/login')+'.html';
      redirect(redirect_path);
    } break;

    case '/login': {
      if(!url.searchParams.has('token')) redirect('/login.html');
      const token = url.searchParams.get('token');
      await client.login(token);
      redirect('/main-menu.html');
    } break;

    case '/login.html': sendHtml(); break;

    case '/main-menu.html': {
      if(!client.user) { redirect('/login.html'); break; }
      const html = readFileSync('./main-menu.html').toString()
        .replace('${tag}', client.user.tag)
        .replace('${id}', client.user.id);
      res.write(html);
      res.end();
    } break;

    case '/guilds.html': {
      
    }

    default: {
      res.writeHead(404);
      sendHtml('./page-not-found.html');
    }
  }
}).listen(port);
