var dbLibs = require('../libs/db');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var serviceSchema = new mongoose.Schema({
    name: {type: String},
    url: {type: String}
});

var serviceModel = db.model('mongoose', serviceSchema);

function find(criteria, projection, callback) {
    serviceModel.find(criteria || {}, projection || {name: 1, url: 1}, {}, function(error, result){
        if(error) {
            console.log(error);
        } else {
        }
        callback && callback(error, result);
        //关闭数据库链接
        // TODO 何时关闭？
        //db.close();
    });
}

module.exports = {
    find: find
};