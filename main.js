const { input } = require('./input')

const authorization = require('./token.json').token

async function main() {
  let curr_path = `https://discord.com/api/v9`
  while(true) {
    let prompt = `[${curr_path}]> `
    try {
      const [ cmd, ...args ] = (await input(prompt)).split(' ')
      let x
      switch(cmd) {
        case 'get':
          x = await (await fetch(curr_path, {
            method: 'GET',
            headers: { authorization }
          })).json()
          break
        case 'post':
          x = await (await fetch(curr_path, {
            method: 'POST',
            headers: { authorization, 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ content: args[0] })
          })).json()
          break
        case 'cd':
          switch(args[0]) {
            case '..': curr_path = curr_path.substring(0, curr_path.lastIndexOf('/')); break
            default: curr_path += `/${args[0]}`
          }
      }
      if(x) console.log(x)
    } catch(err) {
      console.error(err)
    }
  }
}

const { emitWarning } = process

process.emitWarning = function(warning, ...args) {
  if(args[0] === 'ExperimentalWarning' || args[0]?.type === 'ExperimentalWarning')
    return
  return emitWarning(warning, ...args)
}

main()
