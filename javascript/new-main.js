const input = require('./input');
const { Client } = require('./classes');
const { inspect } = require('util');
const { get_token, would_you_like_to_continue } = require('./utils');
const { exit } = process;
const { writeFileSync, readFileSync } = require('fs');
const user_choice = require('cli-choice-menu');

function save_and_exit() {
  exit();
}

function menu_loop() {
  while(true) {

  }
}

async function main() {
  const token = await get_token();
  const client = await (new Client(token)).login();
  console.log(client);
  console.log(`This token belongs to ${client.user.tag}.`);
  await would_you_like_to_continue();
  console.log(`Logged in as ${client.user.tag}\n`);
  save_and_exit();
}
