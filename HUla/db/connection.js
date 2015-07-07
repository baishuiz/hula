var mongoose = require('mongoose');
var dbConfig = require('dbconfig.js')

var uri      = dbConfig.host + dbConfig.db + 
mongoose.connect(dbConfig.host, dbConfig.db, dbConfig.port);
