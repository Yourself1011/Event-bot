/**
 * Event bot
 * Copyright (c) 2020 Daniel Zhang | MIT License
 */
let Msg, cornerAmount, cornerAmountStr, i;

const main = require("../index.js"),
  client = main.client,
  login = main.login,
  env = require("dotenv").config({
    path: "./.env"
  }).parsed,
  Discord = require("discord.js");

function fourcornersRound(corners, message, eventChannel) {
  function removeTeam(chosenCorner, user) {
    let removeCorners = [];
    for (i = 0; i < cornerAmount.length - 2; i++) {
      if (cornerAmount[i] !== chosenCorner) {
        removeCorners.push(cornerAmountStr[i]);
      }
    }
    console.log("remove corners: " + removeCorners);
    for (const index of removeCorners) {
      let key = removeCorners[index];
      let colourDict = [corners[key]];

      colourDict.splice(index, 1);
      const waitRemoveReaction = removereaction(user, chosenCorner);

      Promise.resolve(waitRemoveReaction).then(() => {
        colourDict.push(user.id);
      });
    }
  }

  function removereaction(user, chosenCorner) {
    const userReactions = Msg.reactions.cache.filter(reaction =>
      reaction.users.cache.has(user.id)
    );

    for (const reaction of userReactions.values()) {
      if (reaction !== chosenCorner) {
        reaction.users.remove(user.id);
        console.log("Removed UserID: ", user.id, ". Reaction:", reaction);
      }
    }
  }

  eventChannel
    .send(`React to a colour! You have 15 seconds.`)
    .then(sentMessage => {
      Msg = sentMessage;
      for (i = 0; i < cornerAmount.length; i++) {
        sentMessage.react(cornerAmount[i]);
        console.log("reacted with " + cornerAmount[i]);
      }

      return sentMessage;
    })
    .then(sentMessage => {
      const filter = (reaction, user) => {
        return (
          cornerAmount.includes(reaction.emoji.name) &&
          user.id !== "710597839927115856"
        );
      };

      const collector = sentMessage.createReactionCollector(filter, {
        time: 15000
      });

      collector.on("collect", (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        switch (reaction.emoji.name){
          case "🔵":
            removeTeam("🔵", user)
            break;
          default:
        }
      });

      collector.on("end", collected => {
        console.log(`Collected ${collected.size} items`);
        console.log(corners);
      });
    });
}

function fourcorners(message, client) {
  var fourCornersStartEmbed = new Discord.MessageEmbed()
    .setColor("#03b6fc")
    .setTitle("Four Corners Event")
    .setDescription(
      `A four corners event has been created! You have 5 minutes to join.`
    )
    .setFooter(
      "For the best experience, please stay in this channel at all times."
    );
  var fourCornersRulesEmbed = new Discord.MessageEmbed()
    .setColor("#03b6fc")
    .setTitle("Four Corners Event")
    .setDescription(
      `The channel is locked, and no new people can join! I'll give you a minute to read the rules. We are starting in approximately`
    )
    .setImage("https://i.postimg.cc/PJcqHsCm/Webp-net-gifmaker.gif")
    .setFooter(
      "For the best experience, please stay in this channel at all times."
    );
  let corners = {
    red: [""],
    blue: [""],
    green: [""],
    yellow: [""],
    purple: [""],
    orange: [""],
    brown: [""],
    black: [""]
  };
  var pingRole;
  if (env.PING_ROLE === "here") {
    pingRole = "@here";
  } else if (env.PING_ROLE === "everyone") {
    pingRole = "@everyone";
  } else {
    pingRole = `<@&${env.PING_ROLE}>`;
  }

  let eventChannel = client.channels.cache.get(env.EVENT_CHANNEL);

  eventChannel.send(pingRole, fourCornersStartEmbed).then(sentMessage => {
    setTimeout(() => {
      sentMessage.edit(pingRole, fourCornersRulesEmbed);
    }, 30000);

    setTimeout(() => {
      sentMessage.edit(pingRole, `, we're starting now!`);
      sentMessage.suppressEmbeds();
    }, 36000);
  });

  setTimeout(function() {
    eventChannel.send(
      pingRole +
        `\n **Four corners rules:** \n There aren't many rules for this game, but here they are: \n **1.** Every round, react to the message. \n **2.** Every round, one colour will be eliminated. Don't be the one! \n **3.** Listen to the <@${
          env.HOST
        }>!`
    );
  }, 30000);

  setTimeout(function() {
    fourcornersRound(corners, message, eventChannel);
  }, 36000);
}

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
      console.log(env);

      message.reply("succesfully started a game of four corners!");

      switch (args[1]) {
        case "4":
          cornerAmount = ["🔵", "🔴", "🟢", "🟡"];
          cornerAmountStr = ["blue", "red", "green", "yellow"];
          break;
        case "5":
          cornerAmount = ["🔵", "🔴", "🟢", "🟡", "🟣"];
          cornerAmountStr = ["blue", "red", "green", "yellow", "purple"];
          break;
        case "6":
          cornerAmount = ["🔵", "🔴", "🟢", "🟡", "🟣", "🟠"];
          cornerAmountStr = [
            "blue",
            "red",
            "green",
            "yellow",
            "purple",
            "orange"
          ];
          break;
        case "7":
          cornerAmount = ["🔵", "🔴", "🟢", "🟡", "🟣", "🟠", "🟤"];
          cornerAmountStr = [
            "blue",
            "red",
            "green",
            "yellow",
            "purple",
            "orange",
            "brown"
          ];
          break;
        case "8":
          cornerAmount = ["🔵", "🔴", "🟢", "🟡", "🟣", "🟠", "🟤", "⚫"];
          cornerAmountStr = [
            "blue",
            "red",
            "green",
            "yellow",
            "purple",
            "orange",
            "brown",
            "black"
          ];
          break;
        default:
          cornerAmount = ["🔵", "🔴", "🟢", "🟡"];
          cornerAmountStr = ["blue", "red", "green", "yellow"];
      }

      fourcorners(message, client, cornerAmount, cornerAmountStr);
    }
  };
});
