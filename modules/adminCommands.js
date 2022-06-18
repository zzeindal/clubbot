const { bot } = require('../config/connectTelegram.js');
const { adminChat } = require('../helpers/utils.js');
const { $user, $girlCard, $admin, $event, $corporation, $order, $photo, $request } = require('../config/connectMongoose.js');
const { admin_mp_keyboard, admin_menu_keyboard, admin_corporation_keyboard, admin_girlCards_keyboard, admin_photos_keyboard } = require('../helpers/keyboard.js');

bot.hears('/admin', async(ctx) => {
	const admin = await $admin.findOne({ uid: 0 });
	if(!admin) {
		let newAdmin = new $admin({
			uid: 0,
			countTables: 0
		})
		await newAdmin.save();

		return;
	}
	const users = await $user.countDocuments();
	const event = await $event.find({ active: true });
	const girlCard = await $girlCard.find({ acitve: true });
	const corporation = await $corporation.countDocuments();
	const orders = await $order.find({ active: true });
	const photos = await $photo.find({ active: true });
	const requests = await $request.countDocuments();

	return ctx.reply(`
В боте։ ${users} человек
Кол-во активных мероприятий։ ${event.length}
Кол-во активных женских карточек։ ${girlCard.length}
Кол-во корпоративов։ ${corporation}
Кол-во активных заказов։ ${orders.length}
Кол-во фото с вечеринок։ ${photos.length}
Кол-во запросов։ ${requests}
`)
});

bot.action(/doneGirlCard (\d+)$/, async(ctx) => {
	const card = await $girlCard.findOne({ ownerId: ctx.from.id });
	if(!card) {
		return ctx.answerCbQuery('Карта не найдена', true);
	}
	if(card.active) {
		return ctx.answerCbQuery(`Карта уже принята`, true);
	}
	await card.set("active", true);
	await bot.telegram.sendMessage(card.ownerId, `Ваша заявка на получение женской карты <b>была одобрена!</b>`, { parse_mode: "HTML" })
	return ctx.answerCbQuery(`Заявка принята․`, true);
})

bot.action(/rejectGirlCard (\d+)$/, async(ctx) => {
	const card = await $girlCard.findOne({ ownerId: ctx.from.id });
	if(!card) {
		return ctx.answerCbQuery('Карта не найдена', true);
	}
	if(!card.active) {
		return ctx.answerCbQuery(`Карта неактивна`, true);
	}
	await card.set("active", false);
	await bot.telegram.sendMessage(card.ownerId, `❌ Ваша заявка на получение женской карты <b>была отклонена!</b>`, { parse_mode: "HTML" })
	return ctx.answerCbQuery(`Заявка отказана․`, true);
})

bot.action(/edit_(.+)$/, async(ctx) => {
	var check = ctx.match[1];
	
	var keyboard;

	switch(check) {
		case "mp":
			keyboard = admin_mp_keyboard;
			break;
		case "menu":
			keyboard = admin_menu_keyboard;
			break;
		case "corporation":
			keyboard = admin_corporation_keyboard;
			break;
		case "girlCards":
			keyboard = admin_girlCards_keyboard;
			break;
		case "photos":
			keyboard = admin_photos_keyboard;
			break;
	}

	return ctx.reply(`Выберите раздел:`, keyboard);
});
