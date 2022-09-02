const { Telegraf } = require('telegraf');
const fs = require("fs");

function random_int(max) {
    return Math.floor(Math.random() * max);
}

function random(arr) {
    return arr[random_int(arr.length)];
}

// Get BOT_TOKEN and DOMAIN from .env file.
require('dotenv').config();

const jokes = fs.readFileSync("./jokes.txt")
    .toString()
    .split("<:!-|SEPARATOR|-!:>");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));

bot.command("joke", ctx => ctx.reply(random(jokes)));

bot.launch().then(_r => console.log("Bot started."));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));