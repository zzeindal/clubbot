const { bot } = require('../config/connectTelegram.js');
const { BaseScene } = require('telegraf');
const { getUser, downloadImage } = require('../helpers/utils.js');
const { main_keyboard, back_keyboard } = require('../helpers/keyboard.js');

const registration_scene = new BaseScene('registration_scene');
registration_scene.enter(async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("registration_1"), { parse_mode: "HTML" });
    }
    catch(err) {
        await ctx.replyWithHTML(ctx.i18n.t("registration_1"));
    }
});

registration_scene.on('text', async (ctx) => {
    ctx.session.first_name = ctx.message.text;
    return ctx.scene.enter("registration_scene_2")
});

const registration_scene_2 = new BaseScene('registration_scene_2');
registration_scene_2.enter(async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("registration_2"), { parse_mode: "HTML", reply_markup: back_keyboard.reply_markup });
    }
    catch(err) {
        await ctx.replyWithHTML(ctx.i18n.t("registration_2"), back_keyboard);
    }
});

registration_scene_2.on('callback_query', async (ctx) => {
    if(ctx.update.callback_query.data === "back") return ctx.scene.enter("registration_scene");
});

registration_scene_2.on('text', async (ctx) => {
    ctx.session.last_name = ctx.message.text;
    return ctx.scene.enter("registration_scene_3")
});

const registration_scene_3 = new BaseScene('registration_scene_3');
registration_scene_3.enter(async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("registration_3"), { parse_mode: "HTML", reply_markup: back_keyboard.reply_markup });
    }
    catch(err) {
        await ctx.replyWithHTML(ctx.i18n.t("registration_3"), back_keyboard);
    }
});

registration_scene_3.on('callback_query', async (ctx) => {
    if(ctx.update.callback_query.data === "back") return ctx.scene.enter("registration_scene_2");
});

registration_scene_3.on('text', async (ctx) => {
    var split = ctx.message.text.split('.');
    if (split.length !== 3) return ctx.replyWithHTML(ctx.i18n.t("date_error"));
    if ((new Date().getFullYear() - split[2]) < 18) return ctx.replyWithHTML(ctx.i18n.t("age_error"));
    ctx.session.birthday = ctx.message.text;
    return ctx.scene.enter("registration_scene_4")
});

const registration_scene_4 = new BaseScene('registration_scene_4');
registration_scene_4.enter(async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("registration_4"), { parse_mode: "HTML", reply_markup: back_keyboard.reply_markup });
    }
    catch(err) {
        await ctx.replyWithHTML(ctx.i18n.t("registration_4"), back_keyboard);
    }
});

registration_scene_4.on('callback_query', async (ctx) => {
    if(ctx.update.callback_query.data === "back") return ctx.scene.enter("registration_scene_3");
});

registration_scene_4.on('text', async (ctx) => {
    ctx.session.phoneNumber = ctx.message.text;
    return ctx.scene.enter("registration_scene_5")
});

const registration_scene_5 = new BaseScene('registration_scene_5');
registration_scene_5.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("registration_5"), back_keyboard);
});

registration_scene_5.on('callback_query', async (ctx) => {
    if(ctx.update.callback_query.data === "back") return ctx.scene.enter("registration_scene_4");
});

registration_scene_5.on('photo', async (ctx) => {
    const url = await bot.telegram.getFileLink(ctx.message.photo[1].file_id);
    const user = await getUser(ctx.from.id);

    await ctx.replyWithHTML(ctx.i18n.t("registration_success"));
    await ctx.replyWithHTML(ctx.i18n.t("mainText", { username: ctx.from.username }), main_keyboard);

    await user.set("first_name", ctx.session.first_name);
    await user.set("last_name", ctx.session.last_name);
    await user.set("birthday", ctx.session.birthday);
    await user.set("phoneNumber", ctx.session.phoneNumber);

    await downloadImage(url, `files/userPhotos/${ctx.from.id}.jpg`)
    return ctx.scene.leave();
});


module.exports = {
    registration_scene,
    registration_scene_2,
    registration_scene_3,
    registration_scene_4,
    registration_scene_5
}