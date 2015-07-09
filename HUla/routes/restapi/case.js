var express = require('express');
var router = express.Router();
var caseModel = require('../../modules/case');
var resHandler = require('../../libs/resHandler');

router.get('/', function(req, res, next) {
    var srv_id = req.query.srv_id;
    caseModel.find({ srv_id: srv_id }, null, function(error, result){
        res.json(resHandler({
            cases: result,
            count: result && result.length || 0
        }, error));
    });
});

router.get('/:_id', function(req, res, next) {
    caseModel.findById(req.params._id, null, function(error, result){
        res.json(resHandler({ case: result }, error));
    });
});

router.post('/', function(req, res, next) {
    caseModel.create(req.body, function (error, result) {
        res.json(resHandler({ _id: result }, error));
    });
});

router.put('/:_id', function(req, res, next) {
    caseModel.findOneAndUpdate({ _id: req.params._id }, req.body, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/', function(req, res, next) {
    caseModel.removeAll(req.body.ids, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

router.delete('/:_id', function(req, res, next) {
    caseModel.findByIdAndRemove(req.params._id, null, function (error, result) {
        res.json(resHandler(null, error));
    });
});

module.exports = router;
