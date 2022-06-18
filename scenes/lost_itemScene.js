const { bot } = require('../config/connectTelegram.js');
const { BaseScene } = require('telegraf');
const moment = require('moment');
const { cancel_keyboard, main_keyboard } = require('../helpers/keyboard.js');
const { Keyboard, Key } = require('telegram-keyboard');
const { botUsername, attendantChat } = require('../helpers/utils.js');
const { $request } = require('../config/connectMongoose.js');

moment.locale('ru');

const lost_item_scene = new BaseScene('lost_item_scene');
lost_item_scene.enter((ctx) => {
    ctx.replyWithHTML(ctx.i18n.t("lost_item"), cancel_keyboard);
});

lost_item_scene.on('text', async (ctx) => {
    const time = moment().format('MMMM Do YYYY, HH:mm:ss a');

    const uid = await $request.countDocuments();

    const keyboard = Keyboard.make([
        Key.url('Взять обращение', `https://t.me/${botUsername}?start=${uid}_attendant`)
    ]).inline();

    const options = { 
        uid: uid, 
        name: ctx.from.username, 
        theme: "Потерян вещь",
        text: ctx.message.text,
        status: "🔄 в ожидании подтверждения", 
        connected: "-", 
        time: time
    }

    const result = await bot.telegram.sendMessage(attendantChat, ctx.i18n.t("support", options), { parse_mode: "HTML", reply_markup: keyboard.reply_markup });

    let newRequest = new $request({
        uid: uid,
        ownerId: ctx.from.id,
        theme: "Потерян вещь",
        text: ctx.message.text,
        time: time,
        messageId: result.message_id,
        active: true
    })

    await newRequest.save();
    await ctx.replyWithHTML(ctx.i18n.t("request_done", { uid: uid }), main_keyboard);
    return ctx.scene.leave();
});

module.exports = {
    lost_item_scene
}
