const { Keyboard, Key } = require('telegram-keyboard')
const { $user } = require('../config/connectMongoose.js');
const fs = require('fs');
const botUsername = 'smsaccount_bot';
const adminChat = -1001427054190;

const main_keyboard = Keyboard.make(['📲 Арендовать номер', '⚙️ Профиль', '🎁 Бонусы клиентам', '🔓 Остальные боты', '❓ Тех. поддержка', '📝 FAQ'], {
    columns: 2,
}).reply();

const back_keyboard = Keyboard.make(['🔙 Назад']).reply();

async function saveUser(ctx) {
    const count = await $user.countDocuments();
    let user = new $user({
        uid: count,
        id: ctx.from.id,
        userName: `${ctx.from.first_name}`,
        userNick: `${ctx.from.username !== undefined ? ctx.from.username : 'Без никнейма'}`,
        balance: 0,
        referalBalance: 0,
        level: 1,
        salePercent: 0,
        chatWithAdmin: false
    })
    await user.save();
}

async function getUser(ctx) {
    const user = await $user.findOne({ id: ctx.from.id })
    return user;
}

module.exports = {
    botUsername,
    adminChat,
    saveUser,
    getUser
}