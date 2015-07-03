var mongoose = require('mongoose');
var config = require('../config.json');
var db = mongoose.createConnection('mongodb://' + config.mongoURL || 'localhost/HULa');

db.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
    mongoose: mongoose,
    db: db
};