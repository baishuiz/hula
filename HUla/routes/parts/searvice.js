var express = require('express');
var router = express.Router();
var serviceModel = require('../../modules/service');
var resHandler = require('../../libs/resHandler');

router.get('/', function(req, res, next) {
    serviceModel.find(null, null, function(error, result){
        res.json(resHandler({
            services: result,
            count: result && result.length || 0
        }, error));
    });
});

router.get('/:_id', function(req, res, next) {
    serviceModel.findById(req.params._id, null, function(error, result){
        res.json(resHandler({ service: result }, error));
    });
});

router.post('/', function(req, res, next) {
    serviceModel.create(req.body, function (error, result) {
        res.json(resHandler({ _id: result }, error));
    });
});

router.put('/:_id', function(req, res, next) {
    serviceModel.findOneAndUpdate({ _id: req.params._id }, req.body, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/', function(req, res, next) {
    serviceModel.removeAll(req.body.ids, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/:_id', function(req, res, next) {
    serviceModel.findByIdAndRemove(req.params._id, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

module.exports = router;
