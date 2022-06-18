const { BaseScene } = require('telegraf');
const { Keyboard, Key } = require('telegram-keyboard');
const { back_keyboard, profile_keyboard, cancel_keyboard } = require('../helpers/keyboard.js');
const { getUser } = require('../helpers/utils.js');

const addBalance_scene = new BaseScene('addBalance_scene');
addBalance_scene.enter(async(ctx) => {
    await ctx.deleteMessage();
    await ctx.reply('💸', cancel_keyboard);
    await ctx.replyWithHTML(ctx.i18n.t("addBalance_1"), back_keyboard);
});

addBalance_scene.on('callback_query', async (ctx) => {
    if(ctx.update.callback_query.data === "back") {
        const user = await getUser(ctx.from.id);

        await ctx.editMessageText(ctx.i18n.t("profile", { name: user.first_name + ' ' + user.last_name, balance: user.balance }), { parse_mode: "HTML", reply_markup: profile_keyboard.reply_markup });
        return ctx.scene.leave();
    }
});

addBalance_scene.on('text', async(ctx) => {
    if (ctx.message.text === '🔙 Назад') {
        const user = await getUser(ctx.from.id);
        await ctx.replyWithHTML(ctx.i18n.t("profile", { name: user.first_name + ' ' + user.last_name, balance: user.balance }), profile_keyboard);
        return ctx.scene.leave();
    }
    if (!Number(ctx.message.text)) return ctx.replyWithHTML(ctx.i18n.t("amountNotInteger"));
    const keyboard = Keyboard.make([Key.url("https://google.com")]).inline();
    ctx.replyWithHTML(ctx.i18n.t("addBalance_2"), keyboard);
});

module.exports = {
    addBalance_scene
}