require('dotenv').config();
const express = require("express")
const { Client } = require("discord.js");
const wd = require("word-definition");
const ud = require("urban-dictionary");

const app = express();
const client = new Client();

client.once('ready', () => {
	console.log(`${client.user.username} logged in`);
});

client.on('message', async (message) => {
    function requestWrapper(word){
        return new Promise((resolve, reject) => {
            wd.getDef(word, "en", null, function(def) {
                resolve(def)
            })
        })
    }
    if(message.channel.id == process.env.DISCORD_CHANNEL_ID) {
        const { content } = message;
        const wordArray = content.split(" ")
        const urbanResults = [];

        for (let i = 0; i < wordArray.length; i++) {
            const word = wordArray[i];
            const result = await ud.define(word).catch(async err => {
                const secondCheck = await requestWrapper(word)
                if(secondCheck.err == 'not found') urbanResults.push(word)
            })
            if (result) console.log('got result for:', word)
        }
        console.log(urbanResults)
        console.log('hello')
        if (urbanResults.length === 0) {
            message.reply("Excuse me human but you are not using any made up words!")
        }
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)

const PORT = process.env.PORT || 5000

app.listen({ PORT }, () => {
  console.log(`🚀 the server is blasing off!`);
});





