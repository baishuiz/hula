var dbLibs = require('../libs/db');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var serviceSchema = new mongoose.Schema({
    name: {type: String},
    url: {type: String}
});

var serviceModel = mongoose.model('mongoose', serviceSchema);

var isValidId = function (_id) {
    return mongoose.Types.ObjectId.isValid(_id);
};

var find = function (criteria, projection, callback) {
    serviceModel.find(criteria || {}, projection || {name: 1, url: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var findById = function (_id, projection, callback) {
    if (!isValidId(_id)) {
        callback && callback(null, null);
        return;
    }

    serviceModel.findById(_id, projection || {name: 1, url: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var create = function (doc, callback) {
    var name = doc.name;
    var url = doc.url;
    if (!name || !url) {
        callback && callback({ message: 'param unavailable' });
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
    if (!name || !url) {
        callback && callback({ message: 'param unavailable' });
        return;
    }

    serviceModel.findOneAndUpdate(query, doc, options, function (error) {
        callback && callback(error, service);
    });
}

var findOneAndRemove = function (conditions, options, callback) {
    var _id = conditions && conditions._id;

    if (_id && !isValidId(_id)) {
        callback && callback({ message: 'unavailable id' });
        return;
    }

    serviceModel.findOneAndRemove(conditions, options, function (error) {
        callback && callback(error);
    });
}

module.exports = {
    find: find,
    findById: findById,
    create: create,
    findOneAndUpdate: findOneAndUpdate,
    findOneAndRemove: findOneAndRemove
};