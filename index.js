/*process
 .on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection at Promise: ${reason}`);
 })
 .on('uncaughtException', err => {
    console.log(`Uncaught Exception thrown: ${err}`);
 });*/

const { Stage, BaseScene } = require('telegraf')
const { bot } = require('./config/connectTelegram.js');
const { $user } = require('./config/connectMongoose.js');
const { saveUser, getUser, main_keyboard } = require('./helpers/utils.js')

const { Keyboard, Key } = require('telegram-keyboard')

const {
    registration_scene,
    registration_scene_2,
    registration_scene_3,
    registration_scene_4,
    registration_scene_5
} = require('./scenes/registrationScene.js');

const { addBalance_scene } = require('./scenes/addBalanceScene.js');

const stage = new Stage([
    registration_scene,
    registration_scene_2,
    registration_scene_3,
    registration_scene_4,
    registration_scene_5,
    addBalance_scene
]);

bot.use(stage.middleware());

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
