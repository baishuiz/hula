var express = require('express');
var router = express.Router();
var contractModel = require('../modules/contract');

router.get('/', function(req, res, next) {
    contractModel.find({ srv_id: req.query.srv_id }, null, function (error, result) {
        res.render('contract', {
            title: '契约',
            contract: result,
            nav: 'service',
            errorMsg: error && error.msg,
            id: req.params._id
        });
    });
});

module.exports = router;
