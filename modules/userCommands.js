const { bot } = require('../config/connectTelegram.js');
const { getUser, botUsername } = require('../helpers/utils.js');
const { profile_keyboard } = require('../helpers/keyboard.js');
const QRCode = require('qrcode');

bot.hears('👤 Личный кабинет', async(ctx) => {
	const user = await getUser(ctx.from.id);

	return ctx.replyWithHTML(ctx.i18n.t("profile", { name: user.first_name + ' ' + user.last_name, balance: user.balance }), profile_keyboard);
})

bot.action('qr_code', async(ctx) => {
    QRCode.toString(`http://t.me/${botUsername}?start=${ctx.from.id}`, function(err, string) {
        if (err) {
        	await ctx.answerCbQuery(`Произошла ошибка при составлении QR кода.`, true);
        	return;
        }
        ctx.replyWithPhoto({ source: string });
    })
})