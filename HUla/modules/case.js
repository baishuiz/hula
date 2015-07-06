var dbLibs = require('../libs/db');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var caseSchema = new mongoose.Schema({
    srv_id: {type: String},
    name: {type: String},
    req_json: {type: String},
    res_json: {type: String}
});

var caseModel = mongoose.model('Case', caseSchema);

var isValidId = function (_id) {
    return mongoose.Types.ObjectId.isValid(_id);
};

var find = function (criteria, projection, callback) {
    criteria = criteria || {};
    var srv_id = criteria && criteria.srv_id;

    if (srv_id) {
        if (!isValidId(srv_id)) {
            callback && callback({ message: 'unavailable id' });
            return;
        }
    } else {
        delete criteria.srv_id;
    }

    caseModel.find(criteria, projection || {srv_id:1, name: 1, req_json: 1, res_json: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var findById = function (_id, projection, callback) {
    if (!isValidId(_id)) {
        callback && callback(null, null);
        return;
    }

    caseModel.findById(_id, projection || {srv_id: 1, name: 1, req_json: 1, res_json: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var create = function (doc, callback) {
    doc = doc || {};
    var srv_id = doc.srv_id;
    var name = doc.name;
    var req_json = doc.req_json;
    var res_json = doc.res_json;
    if (!name || !req_json || !res_json || !isValidId(srv_id)) {
        callback && callback({ message: 'unavailable param' });
        return;
    }

    find({ name: name, srv_id: srv_id }, null, function (error, result) {
        if (error) {
                callback && callback(error, null);
        } else {
            if (result && result.length) {
                callback && callback({ message: 'case name exist' }, null);
            } else {
                caseModel.create({ srv_id: srv_id, name: name, req_json: req_json, res_json: res_json }, function (error, caseObj) {
                    callback && callback(error, caseObj && caseObj._id);
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
    var req_json = doc.req_json;
    var res_json = doc.res_json;
    if ((typeof name !== 'undefined' && !name) ||
        (typeof req_json !== 'undefined' && !req_json) ||
        (typeof res_json !== 'undefined' && !res_json)) {
        callback && callback({ message: 'unavailable param' });
        return;
    }

    caseModel.findOneAndUpdate(query, doc, options, function (error, caseObj) {
        callback && callback(error, caseObj);
    });
}

var findByIdAndRemove = function (_id, options, callback) {
    if (!_id || !isValidId(_id)) {
        callback && callback({ message: 'unavailable id' });
        return;
    }

    caseModel.findByIdAndRemove(_id, options, function (error) {
        callback && callback(error);
    });
}

var removeAll = function (ids, options, callback) {
    if (!ids || !ids.length) {
        callback && callback({ message: 'unavailable ids' });
        return;
    }
    caseModel.remove({ _id: { $in: ids }}, function (error, result){
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