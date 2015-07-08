var express = require('express');
var router = express.Router();
var contractModel = require('../../modules/contract');
var resHandler = require('../../libs/resHandler');

router.get('/', function(req, res, next) {
    contractModel.find(null, null, function(error, result){
        res.json(resHandler({
            contracts: result,
            count: result && result.length || 0
        }, error));
    });
});

router.get('/:_id', function(req, res, next) {
    contractModel.findById(req.params._id, null, function(error, result){
        res.json(resHandler({ contract: result }, error));
    });
});

router.post('/', function(req, res, next) {
    contractModel.create(req.body, function (error, result) {
        res.json(resHandler({ _id: result }, error));
    });
});

router.put('/:_id', function(req, res, next) {
    contractModel.findOneAndUpdate({ _id: req.params._id }, req.body, null, function (error, result) {
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
