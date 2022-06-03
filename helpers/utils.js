const { Keyboard, Key } = require('telegram-keyboard')
const { $user } = require('../config/connectMongoose.js');
const fs = require('fs');
const Axios = require('axios')
const botUsername = 'smsaccount_bot';
const adminChat = -1001427054190;

async function saveUser(ctx) {
    const count = await $user.countDocuments();
    let user = new $user({
        uid: count,
        id: ctx.from.id,
        userName: `${ctx.from.first_name}`,
        userNick: `${ctx.from.username !== undefined ? ctx.from.username : 'Без никнейма'}`,
        balance: 0,
        access_to_payment: false
    })
    await user.save();
}

async function getUser(id) {
    const user = await $user.findOne({ id: id })
    return user;
}

async function downloadImage(url, filepath) {
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath));
    });
}

module.exports = {
    botUsername,
    adminChat,
    saveUser,
    getUser,
    downloadImage
}