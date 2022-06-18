const { bot } = require('../config/connectTelegram.js');
const { $girlCard } = require('../config/connectMongoose.js');
const { BaseScene } = require('telegraf');
const { main_keyboard, back_keyboard, cancel_keyboard } = require('../helpers/keyboard.js');
const { adminChat } = require('../helpers/utils.js');
const { Keyboard, Key } = require('telegram-keyboard')

const addGirlCard_scene = new BaseScene('addGirlCard_scene');
addGirlCard_scene.enter((ctx) => {
    ctx.replyWithHTML(ctx.i18n.t("addGirlCard_1"), cancel_keyboard);
});

addGirlCard_scene.on('text', async (ctx) => {
    ctx.session.name = ctx.message.text;
    return ctx.scene.enter("addGirlCard_scene_2")
});

const addGirlCard_scene_2 = new BaseScene('addGirlCard_scene_2');
addGirlCard_scene_2.enter((ctx) => {
    ctx.replyWithHTML(ctx.i18n.t("addGirlCard_2"));
});

addGirlCard_scene_2.on('text', async (ctx) => {
    if(ctx.message.text.length !== 12 || !ctx.message.text.includes('+7')) {
        return ctx.replyWithHTML(ctx.i18n.t("phoneNumber_error"))
    }
    ctx.session.phoneNumber = ctx.message.text;
    return ctx.scene.enter("addGirlCard_scene_3")
});

const addGirlCard_scene_3 = new BaseScene('addGirlCard_scene_3');
addGirlCard_scene_3.enter(async (ctx) => {
    try {
        await ctx.editMessageText(ctx.i18n.t("addGirlCard_3"), { parse_mode: "HTML", reply_markup: back_keyboard.reply_markup })
    }
    catch(err) {
        await ctx.replyWithHTML(ctx.i18n.t("addGirlCard_3"), back_keyboard);
    }
});

addGirlCard_scene_3.on('callback_query', async (ctx) => {
    if(ctx.update.callback_query.data === "back") return ctx.scene.enter("addGirlCard_scene_2");
});

addGirlCard_scene_3.on('text', async (ctx) => {
    var split = ctx.message.text.split('.');
    if (split.length !== 3) return ctx.replyWithHTML(ctx.i18n.t("date_error"));
    if ((new Date().getFullYear() - split[2]) < 18) return ctx.replyWithHTML(ctx.i18n.t("age_error"));
    ctx.session.birthday = ctx.message.text;
    return ctx.scene.enter("addGirlCard_scene_4")
});

const addGirlCard_scene_4 = new BaseScene('addGirlCard_scene_4');
addGirlCard_scene_4.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("addGirlCard_4"), back_keyboard);
});

addGirlCard_scene_4.on('callback_query', async (ctx) => {
    if(ctx.update.callback_query.data === "back") return ctx.scene.enter("addGirlCard_scene_3");
});

addGirlCard_scene_4.on('text', async (ctx) => {
    if (ctx.message.text === "🔙 Назад") {
        return ctx.scene.enter("addGirlCard_scene_3")
    }

    const keyboard = Keyboard.make([
        Key.callback('✅ Одобрить', `doneGirlCard ${ctx.from.id}`),
        Key.callback('❌ Отклонить', `rejectGirlCard ${ctx.from.id}`),
    ]).inline();

    try {
        let newCard = new $girlCard({
            ownerId: ctx.from.id,
            name: ctx.session.name,
            phone: ctx.session.phoneNumber,
            birthday: ctx.session.birthday,
            instagram: ctx.message.text,
            active: false
        })
    
        await newCard.save();
        await ctx.replyWithHTML(ctx.i18n.t("addGirlDone"), main_keyboard);
        
        await bot.telegram.sendMessage(adminChat, ctx.i18n.t("addGirl_admin", { 
            nick: ctx.from.username, 
            name: ctx.session.name, 
            phone: ctx.session.phoneNumber, 
            birthday: ctx.session.birthday,
            link: ctx.message.text 
        }), { reply_markup: keyboard.reply_markup });
    }
    catch(err) {
        await ctx.replyWithHTML(ctx.i18n.t("highError"), main_keyboard);
    }
    return ctx.scene.leave();
});

module.exports = {
    addGirlCard_scene,
    addGirlCard_scene_2,
    addGirlCard_scene_3,
    addGirlCard_scene_4
}