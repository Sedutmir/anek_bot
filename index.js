const { Telegraf } = require('telegraf');
const fs = require("fs");

const Jokes = require("./jokes");
const {commands, utils} = require("./commands");

// Get BOT_TOKEN from .env file.
require('dotenv').config();

global.jokes = new Jokes();
global.jokes.init_with_JSON("jokes.json");

const bot = new Telegraf(process.env.BOT_TOKEN);


bot.start(commands.c_start);
bot.help(commands.c_help);
bot.command("joke", commands.c_joke);
bot.command("report", commands.c_report);
bot.command("edit", commands.c_edit);
bot.command("joke_id", commands.c_joke_id);



bot.launch().then(_r => console.log("Bot started."));

// Enable graceful stop
process.once('SIGINT', () => {
    bot.stop('SIGINT');
    global.jokes.save_in_JSON("jokes.json");
});

process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    global.jokes.save_in_JSON("jokes.json");
});