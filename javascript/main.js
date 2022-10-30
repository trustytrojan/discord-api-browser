const { inspect } = require('util');
const { input } = require('./input');
const authorization = require('./token.json');

async function main() {
  let curr_path = `https://discord.com/api/v9`;
  while(true) {
    const prompt = `[${curr_path}]> `;
    try {
      const [ cmd, ...args ] = (await input(prompt)).split(' ');
      let init_obj;
      switch(cmd) {
        case 'get':
          init_obj = {
            method: 'GET',
            headers: { authorization }
          };
          break;
        case 'post':
          init_obj = {
            method: 'POST',
            headers: { authorization, 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ content: args[0] })
          };
          break;
        case 'cd':
          switch(args[0]) {
            case '..': curr_path = curr_path.substring(0, curr_path.lastIndexOf('/')); break
            default: curr_path += `/${args[0]}`
          }
        default:
          continue;
      }
      const resp = await fetch(curr_path, init_obj);
      try { console.log(inspect(await resp.json(), { depth: 10 })); }
      catch(err) { console.log(resp.body); }
    } catch(err) {
      console.error(err);
    }
  }
}

require('./ignore-ExperimentalWarning');

main();
