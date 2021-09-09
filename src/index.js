require('dotenv').config();
const express = require("express")
const { Client } = require("discord.js");
const wd = require("word-definition");
const ud = require("urban-dictionary");
const { addToLeaderBoard } = require("./supabaseClient");

const app = express();
const client = new Client();

const getResponse = () => {
    const responses = ["you’re not lolijamming correctly", "that’s not a good lolijam", "come on, you can lolijam better than that!", "this is exhausting", "try harder",  "that ain’t it kid", "nope", "that’s not really lolijam material", "god give me the strength to endure your complete lack of lolijam", "nice try, but nope", "not quite", "try again hot shot", "you make me so angry", "😡", "👎", "🙅‍♂️"]

    const index = Math.floor(Math.random() * responses.length);

    return responses[index]
}

client.once('ready', () => {
	console.log(`${client.user.username} logged in`);
});

client.on('message', async (message) => {
    console.log(message.author.bot)
    if(!message.author.bot){
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
            message.reply(getResponse())
        } else {
            console.log(`${message.author.username}#${message.author.discriminator}`)
            urbanResults.forEach(word => addToLeaderBoard(`${message.author.username}#${message.author.discriminator}`, word))
        }
    }
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 the server is blasing off!`);
});





