var mongoose = require('mongoose');
var dbConfig = require('./config.json');
mongoose.connect(dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.db);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

module.exports = {
    mongoose: mongoose,
    db: db
};
