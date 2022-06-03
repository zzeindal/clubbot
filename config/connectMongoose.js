const mongo = require('mongoose');

const userSchema = new mongo.Schema({
    uid: Number,
    id: Number,
    userName: String,
    userNick: String
});

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