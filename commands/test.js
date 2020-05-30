module.exports = {
  name: "test",
  description: "See if the bot is working",
  args: false,
  guildOnly: false,
  execute(message) {
    message.reply("it's working");
  }
};
