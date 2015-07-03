var mongoose = require('mongoose');
var config = require('./config.json');
var db = mongoose.createConnection('mongodb://' + config.mongoURL || 'localhost/HULa');

// Schema 结构
var serviceSchema = new mongoose.Schema({
    name: {type: String},
    url: {type: String}
});

// model
var serviceModel = db.model('mongoose', serviceSchema);

db.on('error', console.error.bind(console, 'connection error:'));

// 增加记录 基于model操作
/*var doc = {name : '3', url : 'static/cityget'};
serviceModel.create(doc, function(error){
    if(error) {
        console.log(error);
    } else {
        console.log('save ok');
    }
    //关闭数据库链接
    db.close();
});*/

// mongoose find
serviceModel.find({}, {name: 1, url : 1}, {}, function(error, result){
    if(error) {
        console.log(error);
    } else {
        console.log('find' + result);
    }
    //关闭数据库链接
    db.close();
});

/*serviceModel.remove({}, function(error){
    if(error) {
        console.log(error);
    } else {
        console.log('delete ok!');
    }
    db.close();
});*/
return;

// 修改记录
var conditions = {username : 'model_demo_username'};
var update     = {$set : {age : 27, title : 'model_demo_title_update'}};
var options    = {upsert : true};
mongooseModel.update(conditions, update, options, function(error){
    if(error) {
        console.log(error);
    } else {
        console.log('update ok!');
    }
    //关闭数据库链接
    db.close();
});
