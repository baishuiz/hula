var dbLibs = require('../libs/db');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var contractSchema = new mongoose.Schema({
    srv_id: {type: String},
    NO: {type: String},
    req: {type: Object},
    res: {type: Object}
});

var contractModel = mongoose.model('Contract', contractSchema);

var isValidId = function (_id) {
    return mongoose.Types.ObjectId.isValid(_id);
};

var find = function (criteria, projection, callback) {
    contractModel.find(criteria || {}, projection || {srv_id: 1, NO: 1, req: 1, res: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var findById = function (_id, projection, callback) {
    if (!isValidId(_id)) {
        callback && callback(null, null);
        return;
    }

    contractModel.findById(_id, projection || {srv_id: 1, NO: 1, req: 1, res: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var create = function (doc, callback) {
    doc = doc || {};

    contractModel.create({ srv_id: doc.srv_id, NO: doc.NO, req: doc.req, res: doc.res }, function (error, service) {
        callback && callback(error, service && service._id);
    });
}

var findOneAndUpdate = function (query, doc, options, callback) {
    var _id = query && query._id;

    if (_id && !isValidId(_id)) {
        callback && callback({ stack: 'unavailable id' });
        return;
    }

    contractModel.findOneAndUpdate(query, doc, options, function (error, service) {
        callback && callback(error, service);
    });
}

var findByIdAndRemove = function (_id, options, callback) {
    if (!_id || !isValidId(_id)) {
        callback && callback({ stack: 'unavailable id' });
        return;
    }

    // TODO 删除时同时删除 case ？
    contractModel.findByIdAndRemove(_id, options, function (error) {
        callback && callback(error);
    });
}

var removeAll = function (ids, options, callback) {
    if (!ids || !ids.length) {
        callback && callback({ stack: 'unavailable ids' });
        return;
    }

    // TODO 删除时同时删除 case ？
    contractModel.remove({ _id: { $in: ids }}, function (error, result){
        callback && callback(error, result);
    });
}

module.exports = {
    find: find,
    findById: findById,
    create: create,
    findOneAndUpdate: findOneAndUpdate,
    findByIdAndRemove: findByIdAndRemove,
    removeAll: removeAll
};
