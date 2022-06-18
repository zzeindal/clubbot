process
 .on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection at Promise: ${reason}`);
 })
 .on('uncaughtException', err => {
    console.log(`Uncaught Exception thrown: ${err}`);
 });

const { Stage } = require('telegraf')
const { bot } = require('./config/connectTelegram.js');
const { $user } = require('./config/connectMongoose.js');
const { saveUser, getUser } = require('./helpers/utils.js')
const { main_keyboard } = require('./helpers/keyboard.js')

const { Keyboard, Key } = require('telegram-keyboard')

const {
    registration_scene,
    registration_scene_2,
    registration_scene_3,
    registration_scene_4,
    registration_scene_5
} = require('./scenes/registrationScene.js');

const {
    addGirlCard_scene,
    addGirlCard_scene_2,
    addGirlCard_scene_3,
    addGirlCard_scene_4
} = require('./scenes/addGirlCardScene.js');

const { addBalance_scene } = require('./scenes/addBalanceScene.js');
const { lost_item_scene } = require('./scenes/lost_itemScene.js');
const { ask_scene } = require('./scenes/askScene.js');

const stage = new Stage([
    registration_scene,
    registration_scene_2,
    registration_scene_3,
    registration_scene_4,
    registration_scene_5,
    addBalance_scene,
    addGirlCard_scene,
    addGirlCard_scene_2,
    addGirlCard_scene_3,
    addGirlCard_scene_4,
    lost_item_scene,
    ask_scene
]);

stage.hears('↩️ Вернутся в главное меню', async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("cancelProcess"), main_keyboard);
    return ctx.scene.leave();
});

bot.use(stage.middleware());

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}: ${err}`)
})

require('./modules/userCommands.js');
require('./modules/adminCommands.js');

bot.start(async (ctx) => {
    const user = await getUser(ctx.from.id);
    if (!user) {
        await saveUser(ctx)

        return ctx.scene.enter("registration_scene");
    }
    else {
        return ctx.replyWithHTML(ctx.i18n.t("welcome_back"), main_keyboard)
    }
});

bot.on('text', async (ctx) => {
    if (ctx.chat.id < 0) return;
    ctx.replyWithHTML(ctx.i18n.t("backText"), main_keyboard);
});

bot.startWebhook('/messages', null, 25);
bot.launch();
