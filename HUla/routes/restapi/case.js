var express = require('express');
var router = express.Router();
var caseModel = require('../../modules/case');
var resHandler = require('../../libs/resHandler');
var caseFormat = require('../../libs/caseFormat');

router.get('/restapi/case/', function(req, res, next) {
    var con_id = req.query.con_id;
    caseModel.find({ con_id: con_id }, null, function(error, result){
        // TODO 格式转换
        res.json(resHandler({
            cases: result,
            con_id: con_id,
            count: result && result.length || 0
        }, error));
    });
});

router.get('/restapi/case/:_id', function(req, res, next) {
    caseModel.findById(req.params._id, null, function(error, result){
        // TODO 格式转换
        res.json(resHandler({ case: result }, error));
    });
});

router.post('/restapi/case/', function(req, res, next) {
    var param = req.body || {};
    param.req = caseFormat.viewToDb(param.req);
    param.res = caseFormat.viewToDb(param.res);

    caseModel.create(req.body, function (error, result) {
        res.json(resHandler({ _id: result }, error));
    });
});

router.put('/restapi/case/:_id', function(req, res, next) {
    var param = req.body || {};
    param.req = caseFormat.viewToDb(param.req);
    param.res = caseFormat.viewToDb(param.res);
    
    caseModel.findOneAndUpdate({ _id: req.params._id }, req.body, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/restapi/case/', function(req, res, next) {
    caseModel.removeAll(req.body.ids, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/restapi/case/:_id', function(req, res, next) {
    caseModel.findByIdAndRemove(req.params._id, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

module.exports = router;
