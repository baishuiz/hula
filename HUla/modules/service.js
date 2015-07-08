var dbLibs = require('../libs/db');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var serviceSchema = new mongoose.Schema({
    NO: {type: String},
    name: {type: String},
    url: {type: String},
    req: {type: Array},
    res: {type: Array}
});

var serviceModel = mongoose.model('Service', serviceSchema);

var isValidId = function (_id) {
    return mongoose.Types.ObjectId.isValid(_id);
};

var find = function (criteria, projection, callback) {
    serviceModel.find(criteria || {}, projection || {name: 1, url: 1, req: 1, res: 1, NO: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var findById = function (_id, projection, callback) {
    if (!isValidId(_id)) {
        callback && callback(null, null);
        return;
    }

    serviceModel.findById(_id, projection || {name: 1, url: 1, req: 1, res: 1, NO: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var create = function (doc, callback) {
    var name = doc.name;
    var url = doc.url;
    var NO = doc.NO;
    if (!name || !url || !NO) {
        callback && callback({ stack: 'unavailable param' });
        return;
    }

    // TODO 判断相同服务号的存在?
    find({ NO: NO }, null, function (error, result) {
        if (error) {
                callback && callback(error, null);
        } else {
            if (result && result.length) {
                callback && callback({ stack: 'service name exist' }, null);
            } else {
                serviceModel.create({ name: name, url: url, NO: NO }, function (error, service) {
                    callback && callback(error, service && service._id);
                });
            }
        }
    });
}

var findOneAndUpdate = function (query, doc, options, callback) {
    var _id = query && query._id;

    if (_id && !isValidId(_id)) {
        callback && callback({ stack: 'unavailable id' });
        return;
    }

    var name = doc.name;
    var url = doc.url;
    var NO = doc.NO;
    if (!name || !url || !NO) {
        callback && callback({ stack: 'unavailable param' });
        return;
    }
    find({ NO: NO }, null, function (error, result) {
        if (error) {
            callback && callback(error, null);
        } else {
            var isSame = result && result[0] && result[0]._id && (result[0]._id.toString() === _id);

            if (result && result.length && !isSame) {
                callback && callback({ stack: 'service NO. exist' }, null);
            } else {
                serviceModel.findOneAndUpdate(query, doc, options, function (error, service) {
                    callback && callback(error, service);
                });
            }
        }
    });
}

var findByIdAndRemove = function (_id, options, callback) {
    if (!_id || !isValidId(_id)) {
        callback && callback({ stack: 'unavailable id' });
        return;
    }

    // TODO 删除时同时删除 contract 和 case ？
    serviceModel.findByIdAndRemove(_id, options, function (error) {
        callback && callback(error);
    });
}

var removeAll = function (ids, options, callback) {
    if (!ids || !ids.length) {
        callback && callback({ stack: 'unavailable ids' });
        return;
    }

    // TODO 删除时同时删除 contract 和 case ？
    serviceModel.remove({ _id: { $in: ids }}, function (error, result){
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
