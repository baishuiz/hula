var express = require('express');
var router = express.Router();
var contractModel = require('../../modules/contract');
var contractFormat = require('../../libs/contractFormat');
var resHandler = require('../../libs/resHandler');

router.get('/restapi/contract/', function(req, res, next) {
    contractModel.find(null, null, function(error, result){
        result = result || [];
        result.forEach(function (obj) {
            if (obj) {
                obj.req = contractFormat.dbToView(obj.req);
                obj.res = contractFormat.dbToView(obj.res);
            }
        });
        res.json(resHandler({
            contracts: result,
            count: result && result.length || 0
        }, error));
    });
});

router.get('/restapi/contract/:_id', function(req, res, next) {
    contractModel.findById(req.params._id, null, function(error, result){
        result = result || {};
        result.req = contractFormat.dbToView(result.req);
        result.res = contractFormat.dbToView(result.res);

        res.json(resHandler({ contract: result }, error));
    });
});

router.post('/restapi/contract/', function(req, res, next) {
    var param = req.body || {};
    param.req = contractFormat.viewToDb(param.req);
    param.res = contractFormat.viewToDb(param.res);
    contractModel.create(param, function (error, result) {
        res.json(resHandler({ _id: result }, error));
    });
});

router.put('/restapi/contract/:_id', function(req, res, next) {
    var param = req.body || {};
    param.req = contractFormat.viewToDb(param.req);
    param.res = contractFormat.viewToDb(param.res);
    contractModel.findOneAndUpdate({ _id: req.params._id }, param, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/restapi/contract/', function(req, res, next) {
    contractModel.removeAll(req.body.ids, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/restapi/contract/:_id', function(req, res, next) {
    contractModel.findByIdAndRemove(req.params._id, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

module.exports = router;
