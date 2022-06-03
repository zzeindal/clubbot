const { bot } = require('../config/connectTelegram.js');

bot.hears('Привет', async(ctx) => {
	return ctx.reply(`Привет․`)
})