var express = require('express');
var router = express.Router();
var contractModel = require('../../modules/contract');
var contractFormat = require('../../libs/contractFormat');
var resHandler = require('../../libs/resHandler');

router.get('/', function(req, res, next) {
    contractModel.find(null, null, function(error, result){
        result = result || [];
        result.forEach(function (obj) {
            if (obj) {
                obj.req = contractFormat(obj.req);
                obj.res = contractFormat(obj.res);
            }
        });
        res.json(resHandler({
            contracts: result,
            count: result && result.length || 0
        }, error));
    });
});

router.get('/:_id', function(req, res, next) {
    contractModel.findById(req.params._id, null, function(error, result){
        result = result || {};
        result.req = contractFormat(result.req);
        result.res = contractFormat(result.res);

        res.json(resHandler({ contract: result }, error));
    });
});

router.post('/', function(req, res, next) {
    var param = req.body || {};
    param.req = contractFormat(param.req, true);
    param.res = contractFormat(param.res, true);
    contractModel.create(param, function (error, result) {
        res.json(resHandler({ _id: result }, error));
    });
});

router.put('/:_id', function(req, res, next) {
    var param = req.body || {};
    param.req = contractFormat(param.req, true);
    param.res = contractFormat(param.res, true);
    contractModel.findOneAndUpdate({ _id: req.params._id }, param, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/', function(req, res, next) {
    contractModel.removeAll(req.body.ids, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/:_id', function(req, res, next) {
    contractModel.findByIdAndRemove(req.params._id, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

module.exports = router;
