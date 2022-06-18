const { Keyboard, Key } = require('telegram-keyboard')

const { bot } = require('../config/connectTelegram.js');
const { getUser, botUsername, attendantChat, operatorChat } = require('../helpers/utils.js');
const { 
    profile_keyboard, 
    menu_keyboard, 
    girl_keyboard,
    corporation_keyboard,
    askSupport_keyboard,
    main_keyboard,
    item_lost_keyboard,
    closeRequest_keyboard,
    ask_keyboard
 } = require('../helpers/keyboard.js');

const QRCode = require('qrcode');
const { $girlCard, $corporation, $event, $photo, $request } = require('../config/connectMongoose.js');

bot.action('close_info', async (ctx) => {
    await ctx.deleteMessage();
});

bot.action('main_menu', async (ctx) => {
    await ctx.editMessageText(ctx.i18n.t("backText"), { parse_mode: "HTML", reply_markup: main_keyboard.reply_markup });
});

bot.hears('👤 Личный кабинет', async (ctx) => {
    const user = await getUser(ctx.from.id);

    ctx.replyWithHTML(ctx.i18n.t("profile", { name: user.first_name + ' ' + user.last_name, balance: user.balance }), profile_keyboard);
})

bot.action('qr_code', async (ctx) => {
    try {
        await ctx.replyWithPhoto({ source: `files/qrcodes/${ctx.from.id}.png` })
    } catch (err) {
        await ctx.answerCbQuery(ctx.i18n.t("qrCode"), true);
        QRCode.toFile(`files/qrcodes/${ctx.from.id}.png`, `http://t.me/${botUsername}?start=${ctx.from.id}`, async function(err) {
            if (err) {
                await ctx.answerCbQuery(ctx.i18n.t("qrCodeError"), true);
                return;
            }
            ctx.replyWithPhoto({ source: `files/qrcodes/${ctx.from.id}.png` });
        })
    }
})

bot.action('addbalance', async (ctx) => {
    return ctx.scene.enter("addBalance_scene");
});

bot.hears('🗒 Меню клуба', async (ctx) => {
    ctx.reply(ctx.i18n.t("menu"), menu_keyboard)
});

bot.action(/menu (\d+)$/i, async (ctx) => {
    try {
        await ctx.replyWithPhoto({ source: `files/admin/menu/${ctx.match[1]}.png` })
    } catch(err) {
        ctx.answerCbQuery(ctx.i18n.t("errorMenu"), true);
    }
});

bot.hears('💳 Женские карточки', async (ctx) => {
    const girlCard = await $girlCard.findOne({ ownerId: ctx.from.id });
    if(girlCard) {
        return ctx.replyWithHTML(ctx.i18n.t("cardGirl_have"));
    }
    ctx.replyWithHTML(ctx.i18n.t("cardGirl"), girl_keyboard);
});

bot.action('formGirl', async (ctx) => {
    return ctx.scene.enter("addGirlCard_scene");
});

bot.hears('💼 Корпоративы', async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t("corporations_1"), askSupport_keyboard);
    ctx.replyWithHTML(ctx.i18n.t("corporations_2"), corporation_keyboard)
});

bot.action(/corporation (\d+) (\d+)$/, async (ctx) => {
    const corporations = await $corporation.findOne({ uid: ctx.match[1] });
    if(!corporations) {
        let newCorporation = new $corporation({
            corporation: Number(ctx.match[1]),
            text: "Не указан",
            photo: []
        })
        await newCorporation.save();

        return ctx.answerCbQuery(ctx.i18n.t("inProgress"), true);
    }

    if(corporations.photo.length === 0 || corporations.text === "Не указан") {
        return ctx.answerCbQuery(ctx.i18n.t("inProgress"), true);
    }

    if(!corporations.photo[ctx.match[2]]) return ctx.answerCbQuery(ctx.i18n.t("noPhoto"), true);
    
    const keyboard = Keyboard.make([
        Key.callback('◀️ Предыдущее', `corporation ${ctx.match[1]} ${Number(ctx.match[2]) - 1}`),
        Key.callback('▶️ Следующее', `corporation ${ctx.match[1]} ${Number(ctx.match[2]) + 1}`),
        Key.callback('🔙 Назад', `go_to_main_menu`),
        Key.callback('📞 Написать менеджеру', `support`)
    ], { pattern: [2,1,1]}).inline();

    const link = await bot.telegram.getFileLink(corporations.photo[ctx.match[2]]);
    try {
        await ctx.editMessageMedia(link, { reply_markup: keyboard.reply_markup });
    }
    catch(err) {
        try {
            await ctx.deleteMessage();
        } catch(err) {};
        
        return ctx.replyWithPhoto({ source: link }, { caption: corporations.text, parse_mode: "HTML", reply_markup: keyboard.reply_markup })
    }
})

bot.hears('🔖 Афиша мероприятий', async (ctx) => {
    const events = await $event.find({ active: true })
    if(events.length === 0)  return ctx.replyWithHTML(ctx.i18n.t("inProgress"));
    const keyboard = Keyboard.make([
        Key.callback('◀️ Предыдущее'),
        Key.callback('▶️ Следующее', `event 1`),
        Key.callback('✅ Забронировать столик', `book 0`),
        Key.callback('🔙 Назад', `go_to_main_menu`)
    ], { pattern: [2,1,1]}).inline();
    const link = await bot.telegram.getFileLink(events[0].photo);

    return ctx.replyWithPhoto({ source: link }, { 
        caption: ctx.i18n.t("event", { 
            date: events[0].date, 
            time: events[0].time, 
            description: events[0].description
        }),
        reply_markup: keyboard.reply_markup
    })
});

bot.action(/event (\d+)$/i, async (ctx) => {
    const events = await $event.find({ active: true })
    if(!events[ctx.match[1]]) return;

    const keyboard = Keyboard.make([
        Key.callback('◀️ Предыдущее'),
        Key.callback('▶️ Следующее', `event ${Number(ctx.match[1]) + 1}`),
        Key.callback('✅ Забронировать столик', `book ${ctx.match[1]}`),
        Key.callback('🔙 Назад', `go_to_main_menu`)
    ], { pattern: [2,1,1]}).inline();
    const link = await bot.telegram.getFileLink(events[ctx.match[1]].photo);

    await ctx.editMessageMedia(link);
    await ctx.editMessageCaption({
        caption: ctx.i18n.t("event", { 
            date: events[ctx.match[1]].date, 
            time: events[ctx.match[1]].time, 
            description: events[ctx.match[1]].description
        }),
        reply_markup: keyboard.reply_markup
    })
});

bot.action(/book (\d+)$/i, async (ctx) => {
    const event = await $event.findOne({ uid: ctx.match[1] })
    if(!event || !event.active) {
        return ctx.answerCbQuery(ctx.i18n.t("notEvent"), true);
    }

    var callback = [];
    for(var i = 1; i <= event.countTables; i++) {
        if(event.booked.includes(i)) {
            callback.push(`❌ ${i}`);
        }
        else {
            callback.push(Key.callback(i, `chooseTable ${i} ${ctx.match[1]}`));
        }
    }

    const keyboard_1 = Keyboard.make(callback, { columns: 5 }).inline();
    const keyboard_2 = Keyboard.make(Key.callback(`🔙 Назад`, `event 0`)).inline();
    const keyboard = Keyboard.combine(keyboard_1, keyboard_2).inline();

    try {
        await ctx.deleteMessage();
    } catch(err) {};

    return ctx.replyWithPhoto({ source: 'admin/map.jpg' }, { caption: ctx.i18n.t("chooseTable"), reply_markup: keyboard.reply_markup })
});

bot.action(/chooseTable (\d+) (\d+)$/i, async (ctx) => {
    const event = await $event.findOne({ uid: ctx.match[2] })
    if(!event || !event.active) {
        return ctx.answerCbQuery(ctx.i18n.t("notEvent"), true);
    }

    var callback = [];
    for(var i = 1; i <= event.countTables; i++) {
        if(event.booked.includes(i)) {
            callback.push(`❌ ${i}`);
        }
        else if(i==Number(ctx.match[1])) {
            callback.push(Key.callback(`✅ ${i}`));
        }
        else {
            callback.push(Key.callback(i, `chooseTable ${i} ${ctx.match[2]}`));
        }
    }

    const keyboard_1 = Keyboard.make(callback, { columns: 5 }).inline();
    const keyboard_2 = Keyboard.make([
        Key.callback(`💰Стоимость: ${event.costs[ctx.match[1] - 1]} Руб.`),
        Key.callback('⏩ Продолжить', `go_to_book ${ctx.match[1]} ${ctx.match[2]}`),
        Key.callback(`🔙 Назад`, `event 0`)
    ])

    const keyboard = Keyboard.combine(keyboard_1, keyboard_2).inline();
    await ctx.editMessageReplyMarkup({ reply_markup: keyboard.reply_markup });
});

bot.action(/go_to_book (\d+) (\d+)$/i, async (ctx) => {
    const event = await $event.findOne({ uid: ctx.match[2] })
    if(event.booked.includes(ctx.match[1])) return ctx.answerCbQuery(ctx.i18n.t("bookError"), true);
    return ctx.scene.enter("bookScene", { eventUid: ctx.match[2], numberTable: ctx.match[1] });
});


bot.hears('📸 Фотки с вечеринок', async (ctx) => {
    const photo = await $photo.findOne({ active: true });
    if(!photo) return ctx.replyWithHTML(ctx.i18n.t("inProgress"));
    const keyboard = Keyboard.make([
        Key.callback('▶️ Следующее', 'findPhoto 1 next'),
        Key.callback('📷 Просмотреть фотографии', `checkPhotos ${photo.uid}`)
    ], { columns: 1 }).inline();
    await ctx.replyWithPhoto(photo.mainPhoto, { caption: `Дата։ ${photo.date}\n${photo.description}`, parse_mode: "HTML", reply_markup: keyboard.reply_markup });
});

bot.action(/findPhoto (\d+) (.+) $/, async (ctx) => {
    var photo;
    if(ctx.match[2] == 'next') {
        photo = await $photo.findOne({ uid: { $gte: Number(ctx.match[1]) }, active: true });
    }
    else {
        photo = await $photo.findOne({ uid: { $lte: Number(ctx.match[1]) }, active: true });
    }
    if(!photo) return ctx.answerCbQuery(ctx.i18n.t("noPhoto"), true);
    const keyboard = Keyboard.make([
        Key.callback('◀️ Предыдущее', `findPhoto ${ctx.match[1] - 1} previous`),
        Key.callback('▶️ Следующее', `findPhoto ${ctx.match[1] + 1} next`),
        Key.callback('📷 Просмотреть фотографии', `checkPhotos ${photo.uid} 0`)
    ], { pattern: [2,1] }).inline();
    await ctx.deleteMessage();

    await ctx.replyWithPhoto(photo.mainPhoto, { caption: `Дата։ ${photo.date}\n${photo.description}`, parse_mode: "HTML", reply_markup: keyboard.reply_markup });
});

bot.action(/checkPhotos (\d+) 0$/i, async (ctx) => {
    const photo = await $photo.findOne({ uid: Number(ctx.match[1]) });
    if(!photo) return ctx.answerCbQuery(ctx.i18n.t("noPhoto"), true);
    const keyboard = Keyboard.make([
        Key.callback('◀️ Предыдущее', `checkPhotos ${ctx.match[1]} ${ctx.match[2] - 1}`),
        Key.callback('▶️ Следующее', `checkPhotos ${ctx.match[1]} ${ctx.match[2] + 1}`),
    ]).inline();

    try {
        await ctx.editMessageMedia(photo.other[ctx.match[2]], { reply_markup: keyboard.reply_markup });
    } catch(err) {
        return ctx.answerCbQuery(ctx.i18n.t("noPhoto"), true);
    }
});

bot.hears('🔍 Потерянные вещи', (ctx) => {
    ctx.replyWithHTML(ctx.i18n.t("item_lost"), item_lost_keyboard);
});

bot.action('lost_item', async (ctx) => {
    const request = await $request.findOne({ ownerId: ctx.from.id, active: true });
    if(request) {
        return ctx.editMessageText(ctx.i18n.t("request_have"), { parse_mode: "HTML", reply_markup: closeRequest_keyboard.reply_markup });
    }
    await ctx.deleteMessage();

    return ctx.scene.enter("lost_item_scene");
});

bot.action('close_my_request', async (ctx) => {
    const request = await $request.findOne({ ownerId: ctx.from.id, active: true });
    if(!request) return ctx.answerCbQuery(ctx.i18n.t("no_request"), true);
    await request.set("active", false);
    var chat;
    if(request.theme === "Потерян вещь") {
        chat = attendantChat;
    }
    else {
        chat = operatorChat;
    }
    try {
        const options = { 
            uid: request.uid, 
            name: ctx.from.username, 
            theme: request.theme,
            text: request.text,
            status: "❌ Отклонён клиентом", 
            connected: "-", 
            time: request.time
        }

        await bot.telegram.editMessageText(
            chat,
            request.messageId,
            request.messageId,
            ctx.i18n.t("support", options), {
                parse_mode: "HTML"
            })
    } catch (err) { console.log(err) };
    await ctx.editMessageText(ctx.i18n.t("request_closed"), { parse_mode: "HTML" });
});

bot.hears(['📱 Связь с клубом', '📞 Написать менеджеру'], (ctx) => {
    return ctx.replyWithHTML(ctx.i18n.t("ask"), ask_keyboard);
});

bot.action('ask', async (ctx) => {
    const request = await $request.findOne({ ownerId: ctx.from.id, active: true });
    if(request) {
        return ctx.editMessageText(ctx.i18n.t("request_have"), { parse_mode: "HTML", reply_markup: closeRequest_keyboard.reply_markup });
    }

    await ctx.deleteMessage();
    return ctx.scene.enter("ask_scene")
});


