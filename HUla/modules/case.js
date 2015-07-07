var dbLibs = require('../libs/db');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var caseSchema = new mongoose.Schema({
    srv_id: {type: String},
    name: {type: String},
    req: {type: Array},
    res: {type: Array}
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
            callback && callback({ stack: 'unavailable id' });
            return;
        }
    } else {
        delete criteria.srv_id;
    }

    caseModel.find(criteria, projection || {srv_id:1, name: 1, req: 1, res: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var findById = function (_id, projection, callback) {
    if (!isValidId(_id)) {
        callback && callback(null, null);
        return;
    }

    caseModel.findById(_id, projection || {srv_id: 1, name: 1, req: 1, res: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var create = function (doc, callback) {
    doc = doc || {};
    var srv_id = doc.srv_id;
    var name = doc.name;
    var req = doc.req;
    var res = doc.res;
    if (!name || !req || !res || !isValidId(srv_id)) {
        callback && callback({ stack: 'unavailable param' });
        return;
    }

    find({ name: name, srv_id: srv_id }, null, function (error, result) {
        if (error) {
                callback && callback(error, null);
        } else {
            if (result && result.length) {
                callback && callback({ stack: 'case name exist' }, null);
            } else {
                caseModel.create({ srv_id: srv_id, name: name, req: req, res: res }, function (error, caseObj) {
                    callback && callback(error, caseObj && caseObj._id);
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
    var req = doc.req;
    var res = doc.res;
    if ((typeof name !== 'undefined' && !name) ||
        (typeof req !== 'undefined' && !req) ||
        (typeof res !== 'undefined' && !res)) {
        callback && callback({ stack: 'unavailable param' });
        return;
    }

    caseModel.findOneAndUpdate(query, doc, options, function (error, caseObj) {
        callback && callback(error, caseObj);
    });
}

var findByIdAndRemove = function (_id, options, callback) {
    if (!_id || !isValidId(_id)) {
        callback && callback({ stack: 'unavailable id' });
        return;
    }

    caseModel.findByIdAndRemove(_id, options, function (error) {
        callback && callback(error);
    });
}

var removeAll = function (ids, options, callback) {
    if (!ids || !ids.length) {
        callback && callback({ stack: 'unavailable ids' });
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
