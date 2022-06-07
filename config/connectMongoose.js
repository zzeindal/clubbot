const mongo = require('mongoose');

const userSchema = new mongo.Schema({
    uid: Number,
    id: Number,
    userName: String,
    userNick: String,
    first_name: String,
    last_name: String,
    birthday: String,
    phoneNumber: String,
    balance: Number,
    access_to_payment: Boolean
});

const $user = mongo.model("Users", userSchema);

console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] [MONGOOSE] > Устанавливаем подключение...`)
mongo.connect('mongodb://localhost:27017/club-bot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] [MONGOOSE] > Подключение установлено.`) }).catch(err => console.log(err));

$user.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$user.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$user.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

module.exports = {
	$user
};