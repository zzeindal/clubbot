const mongo = require('mongoose');

const adminSchema = new mongo.Schema({
    uid: Number,
    countTables: Number
})

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

const girlCardSchema = new mongo.Schema({
    ownerId: Number,
    name: String,
    phone: String,
    birthday: String,
    instagram: String,
    active: Boolean
})

const corporationSchema = new mongo.Schema({
    uid: Number,
    text: String,
    photo: Array
})

const eventPosterSchema = new mongo.Schema({
    uid: Number,
    date: String,
    time: String,
    description: String,
    photo: String,
    countTables: Number,
    costs: Array,
    booked: Array,
    active: Boolean
})

const orderSchema = new mongo.Schema({
    orderId: Number,
    ownerId: Number,
    amount: Number,
    bookTable: Boolean,
    paid: Boolean,
    active: Boolean
});

const photoSchema = new mongo.Schema({
    uid: Number,
    date: String,
    description: String,
    mainPhoto: String,
    other: Array,
    active: Boolean
})

const operatorSchema = new mongo.Schema({
    id: Number
})

const attendantSchema = new mongo.Schema({
    id: Number
})

const requestSchema = new mongo.Schema({
    uid: Number,
    messageId: Number,
    ownerId: Number,
    connected_by: Number,
    theme: String,
    text: String,
    active: Boolean,
    time: String
})

const $admin = mongo.model("Admin", adminSchema);
const $user = mongo.model("Users", userSchema);
const $girlCard = mongo.model("Girl Cards", girlCardSchema);
const $corporation = mongo.model("Corporation", corporationSchema);
const $event = mongo.model("Event Poster", eventPosterSchema);
const $order = mongo.model("Orders", orderSchema);
const $photo = mongo.model("Photos", photoSchema);
const $operator = mongo.model("Operators", operatorSchema);
const $attendant = mongo.model("Attendants", attendantSchema);
const $request = mongo.model("Requests", requestSchema);

console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] [MONGOOSE] > Устанавливаем подключение...`)
mongo.connect('mongodb://localhost:27017/club-bot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log(`[${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] [MONGOOSE] > Подключение установлено.`) }).catch(err => console.log(err));

$admin.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$admin.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$admin.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

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

$girlCard.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$girlCard.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$girlCard.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$corporation.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$corporation.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$corporation.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$event.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$event.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$event.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$order.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$order.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$order.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$photo.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$photo.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$photo.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$operator.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$operator.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$operator.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$attendant.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$attendant.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$attendant.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

$request.prototype.set = function(field, value) {
    this[field] = value;
    return this.save();
}
$request.prototype.inc = function(field, value) {
    this[field] += value;
    return this.save();
}
$request.prototype.dec = function(field, value) {
    this[field] -= value;
    return this.save();
}

module.exports = {
    $admin,
	$user,
    $girlCard,
    $corporation,
    $event,
    $order,
    $photo,
    $operator,
    $attendant,
    $request
};