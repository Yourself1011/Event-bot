const main = require("../index.js"),
  client = main.client,
  login = main.login,
  env = require("dotenv").config({ path: "./.env" }).parsed;

module.exports = {
  name: "create",
  cooldown: 30,
  description: "create an event",
  args: true,
  guildOnly: false
};

module.exports.execute = login.then(() => {
  return (message, args) => {
    if (args[0] === "fourcorners") {
      console.log(env, env.RULES_CHANNEL);
      client.channels
        .get(env.RULES_CHANNEL)
        .send(
          `@everyone \n **Rules:** \n There aren't many rules for this game, but here they are: \n **1.** Every round, react to the message. \n **2.** Every round, one colour will be eliminated. Don't be the one! \n **3.** Listen to the <@${env.HOST}>!`
        );
      client.channels
        .get(env.EVENT_CHANNEL)
        .send(
          `We are starting in 1 minute! Make sure you read the rules at <#${env.RULES_CHANNEL}>`
        );
      setTimeout(function() {
        client.channels.get(env.EVENT_CHANNEL).send("We're starting now!");
        client.channels
          .get(env.EVENT_CHANNEL)
          .send(
            "React to a colour! (The first colour you react to will be your colour)"
          )
          .then(sentMessage => {
            sentMessage.react("🔴");
            sentMessage.react("🔵");
            sentMessage.react("🟢");
            sentMessage.react("🟡");
          });
      }, 60000);
    }
  };
});
