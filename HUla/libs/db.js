var mongoose = require('mongoose');
var config = require('../config.json');
mongoose.connect('mongodb://' + config.mongoURL || 'localhost/HULa');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
    mongoose: mongoose,
    db: db
};