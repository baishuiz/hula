var dbLibs = require('../db/connection');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;
var caseModel = require('./case');

// TODO Contract 里是否应该存储服务NO？

var contractSchema = new mongoose.Schema({
    srv_id: {type: String},
    version: {type: String},
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
console.log(_id);
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

var removeCase = function (conditions) {
    caseModel.remove(conditions);
}

var findByIdAndRemove = function (_id, options, callback) {
    if (!_id || !isValidId(_id)) {
        callback && callback({ stack: 'unavailable id' });
        return;
    }

    contractModel.findByIdAndRemove(_id, options, function (error) {
        _id && removeCase({ con_id: _id});
        callback && callback(error);
    });
}

var remove = function (conditions, callback) {
    if (_.isEmpty(conditions)) {
        callback && callback({ stack: 'unavailable params' });
        return;
    }

    find(conditions, { _id: 1 }, function (error, result) {
        contractModel.remove(conditions, function (error, result){
            callback && callback(error, result);
        });

        var ids = _.compact(_.pluck(result, '_id'));
        if (ids && ids.length) {
            removeCase({ con_id: { $in: ids }});
        }
    });
}

module.exports = {
    find: find,
    findById: findById,
    create: create,
    findOneAndUpdate: findOneAndUpdate,
    findByIdAndRemove: findByIdAndRemove,
    remove: remove
};
