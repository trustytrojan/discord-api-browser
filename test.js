const { base_url } = require('./classes/managers/DataManager');
const { token } = require('./save.json');

/**
 * Returns the raw JSON object received by the Discord API at the desired path.
 * @param {string} api_path Should take the form of `/path/id`
 * @returns {any}
 */
async function discord_fetch(api_path) {
  const url = `${base_url}${api_path}`;
  console.log(`Fetching ${url}`);

  const resp = await fetch(url, { headers: { authorization: token } });
  const obj = await resp.json();

  // discord responds with a `message` property to indicate an error
  if(obj.message) throw obj;

  return obj;
}

async function main() {
  //console.log(await discord_fetch('/users/@me/relationships'));
  //console.log(await discord_fetch('/users/@me/billing/payment-sources'));
  console.log(await discord_fetch('/users/@me/billing/payment-sources'));
}

main().catch(console.error);