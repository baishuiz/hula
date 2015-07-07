var dbLibs = require('../libs/db');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var serviceSchema = new mongoose.Schema({
    name: {type: String},
    url: {type: String},
    req_contract: {type: String},
    res_contract: {type: String}
});

var serviceModel = mongoose.model('Service', serviceSchema);

var isValidId = function (_id) {
    return mongoose.Types.ObjectId.isValid(_id);
};

var find = function (criteria, projection, callback) {
    serviceModel.find(criteria || {}, projection || {name: 1, url: 1, req_contract: 1, res_contract: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var findById = function (_id, projection, callback) {
    if (!isValidId(_id)) {
        callback && callback(null, null);
        return;
    }

    serviceModel.findById(_id, projection || {name: 1, url: 1, req_contract: 1, res_contract: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var create = function (doc, callback) {
    var name = doc.name;
    var url = doc.url;
    if (!name || !url) {
        callback && callback({ message: 'unavailable param' });
        return;
    }

    find({ name: name }, null, function (error, result) {
        if (error) {
                callback && callback(error, null);
        } else {
            if (result && result.length) {
                callback && callback({ message: 'service name exist' }, null);
            } else {
                serviceModel.create({ name: name, url: url }, function (error, service) {
                    callback && callback(error, service && service._id);
                });
            }
        }
    });
}

var findOneAndUpdate = function (query, doc, options, callback) {
    var _id = query && query._id;

    if (_id && !isValidId(_id)) {
        callback && callback({ message: 'unavailable id' });
        return;
    }

    var name = doc.name;
    var url = doc.url;
    if ((typeof name !== 'undefined' && !name) || (typeof url !== 'undefined' && !url)) {
        callback && callback({ message: 'unavailable param' });
        return;
    }

    serviceModel.findOneAndUpdate(query, doc, options, function (error, service) {
        callback && callback(error, service);
    });
}

var findByIdAndRemove = function (_id, options, callback) {
    if (!_id || !isValidId(_id)) {
        callback && callback({ message: 'unavailable id' });
        return;
    }

    // TODO 删除时同时删除 case ？
    serviceModel.findByIdAndRemove(_id, options, function (error) {
        callback && callback(error);
    });
}

var removeAll = function (ids, options, callback) {
    if (!ids || !ids.length) {
        callback && callback({ message: 'unavailable ids' });
        return;
    }

    // TODO 删除时同时删除 case ？
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