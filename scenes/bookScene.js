const { bot } = require('../config/connectTelegram.js');
const { BaseScene } = require('telegraf');
const { main_keyboard, back_keyboard } = require('../helpers/keyboard.js');
const { alfaBank } = require('../helpers/utils.js');
const { $event, $order } = require('../config/connectMongoose.js');

const book_scene = new BaseScene('book_scene');
book_scene.enter(async (ctx) => {
    ctx.session.eventUid = ctx.scene.state.eventUid;
    ctx.session.numberTable = ctx.scene.state.numberTable;
    await ctx.replyWithHTML(ctx.i18n.t("book_1", { id: ctx.session.numberTable }), back_keyboard);
});

book_scene.on('text', async (ctx) => {
    if(!Number(ctx.message.text)) return ctx.replyWithHTML(ctx.i18n.t("amountNotInteger"));
    ctx.session.count = ctx.message.text;
    return ctx.scene.enter("book_scene_2")
});

const book_scene_2 = new BaseScene('book_scene_2');
book_scene_2.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("book_2", { id: ctx.session.numberTable }), back_keyboard);
});

book_scene_2.on('text', async (ctx) => {
    ctx.session.name = ctx.message.text;
    return ctx.scene.enter("book_scene_3")
});

const book_scene_3 = new BaseScene('book_scene_3');
book_scene_3.enter(async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("book_3", { id: ctx.session.numberTable }), back_keyboard);
});

book_scene_3.on('text', async (ctx) => {
    ctx.session.phone = ctx.message.text;
    return ctx.scene.enter("book_scene_4")
});

const book_scene_4 = new BaseScene('book_scene_4');
book_scene_4.enter(async (ctx) => {
    ctx.session.event = await $event.findOne({ uid: ctx.session.eventUid });
    ctx.session.amount = ctx.session.event.costs[ctx.session.numberTable - 1];

    const keyboard = keyboard.make([
        Key.callback('💰➡️ 50%', 50),
        Key.callback('💰➡️ 100%', 100),
        Key.callback('🔙 Назад', 'back')
    ], { pattern: [2,1]}).inline();

    await ctx.replyWithHTML(ctx.i18n.t("book_4", { id: ctx.session.numberTable,  amount: ctx.session.amount }), keyboard);
});

book_scene_4.on('callback_query', async (ctx) => {
    ctx.session.forPayment = ctx.session.amount * ctx.update.callback_query.data / 100;
    const orderId = await $order.countDocuments();

    let newOrder = new $order({
        orderId: orderId,
        ownerId: ctx.from.id,
        amount: ctx.session.forPayment,
        bookTable: true,
        paid: false,
        active: true
    })

    await newOrder.save();

    const result = await alfaBank.register({
        amount: ctx.session.forPayment,
        orderNumber: orderId,
        returnUrl: `https://t.me`,
        jsonParams: {
          numberTable: ctx.session.numberTable
        }
    })
    
    if(!result.formUrl) return ctx.answerCbQuery(`Системная ошибка․`, true);

    const keyboard = Keyboard.make([
        Key.url('💸 Оплатить', result.formUrl),
        Key.callback('🔙 Назад', 'back')
    ], { columns: 1 }).inline();

    await ctx.replyWithHTML(ctx.i18n.t("book_finish", {
        count: ctx.session.count,
        name: ctx.session.name,
        phone: ctx.session.phone,
        date: ctx.session.event.date,
        time: ctx.session.event.time,
        amount: ctx.session.amount,
        percent: ctx.update.callback_query.data,
        forPayment: ctx.session.forPayment
    }), keyboard);
});