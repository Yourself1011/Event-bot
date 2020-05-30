/**
 * Event bot
 * Copyright (c) 2020 Daniel ZHang | MIT License
 */

const fs = require("fs");
const Discord = require("discord.js");
const env = require("dotenv").config({ path: "./.env" }).parsed;
const prefix = env.PREFIX

const client = new Discord.Client();
exports.client = client;
client.commands = new Discord.Collection();

client.once("ready", () => {
  console.log("Ready!");
});

exports.login = client.login(env.LOGIN_TOKEN);

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (command) {
    if (command.guildOnly && message.channel.type !== "text") {
      return message.reply("get in a server.");
    }
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;

      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
          command.usage
        }\``;
      }
      return message.channel.send(reply);
    }
    try {
      Promise.resolve(command.execute)
        .then(callback => {
          callback(message, args);
        })
        .catch(error => {
          console.error(error);
          message.reply(
            "There was a problem running that command.\n Please try again"
          );
        });
    } catch (error) {
      console.error(error);
      message.reply(
        "There was a problem running that command.\n Please try again"
      );
    }
  } else {
    message.reply(`${commandName} is not a command.`);
  }
});
