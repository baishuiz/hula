var dbLibs = require('../db/connection');
var mongoose = dbLibs.mongoose;
var db = dbLibs.db;

var caseSchema = new mongoose.Schema({
    con_id: {type: String},
    name: {type: String},
    req: {type: Object},
    res: {type: Object}
});

var caseModel = mongoose.model('Case', caseSchema);

var isValidId = function (_id) {
    return mongoose.Types.ObjectId.isValid(_id);
};

var find = function (criteria, projection, callback) {
    criteria = criteria || {};
    var con_id = criteria && criteria.con_id;

    if (con_id) {
        if (!isValidId(con_id)) {
            callback && callback({ stack: 'unavailable id' });
            return;
        }
    } else {
        delete criteria.con_id;
    }

    caseModel.find(criteria, projection || {con_id:1, name: 1, req: 1, res: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var findById = function (_id, projection, callback) {
    if (!isValidId(_id)) {
        callback && callback(null, null);
        return;
    }

    caseModel.findById(_id, projection || {con_id: 1, name: 1, req: 1, res: 1}, {}, function(error, result){
        callback && callback(error, result);
    });
}

var create = function (doc, callback) {
    doc = doc || {};
    var con_id = doc.con_id;
    var name = doc.name;
    var req = doc.req;
    var res = doc.res;
    if (!name || !req || !res || !isValidId(con_id)) {
        callback && callback({ stack: 'unavailable param' });
        return;
    }

    find({ name: name, con_id: con_id }, null, function (error, result) {
        if (error) {
                callback && callback(error, null);
        } else {
            if (result && result.length) {
                callback && callback({ stack: 'case name exist' }, null);
            } else {
                caseModel.create({ con_id: con_id, name: name, req: req, res: res }, function (error, caseObj) {
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

var remove = function (conditions, callback) {
    if (_.isEmpty(conditions)) {
        callback && callback({ stack: 'unavailable params' });
        return;
    }
    caseModel.remove(conditions, function (error, result){
        callback && callback(error, result);
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
