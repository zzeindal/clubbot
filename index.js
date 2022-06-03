process
 .on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection at Promise: ${reason}`);
 })
 .on('uncaughtException', err => {
    console.log(`Uncaught Exception thrown: ${err}`);
 });

const { bot } = require('./config/connectTelegram.js');
const { $user } = require('./config/connectMongoose.js');
const { saveUser, getUser, main_keyboard } = require('./helpers/utils.js')

const { Keyboard, Key } = require('telegram-keyboard')

require('./modules/userCommands.js');
require('./modules/adminCommands.js');

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`)
})

bot.start(async (ctx) => {
	const user = await getUser(ctx.from.id);
    if (!user) {
        await saveUser(ctx)

        return ctx.scene.enter("registrationScene");
    }
});

bot.on('text', async (ctx) => {
    if (ctx.chat.id < 0) return;
});

bot.startPolling();
