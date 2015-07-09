var express = require('express');
var router = express.Router();
var contractModel = require('../modules/contract');
var contractFormat = require('../libs/contractFormat');

router.get('/', function(req, res, next) {
    contractModel.find({ srv_id: req.query.srv_id }, null, function (error, result) {
        result = result && result[0] || {};

        res.render('contract', {
            title: '契约',
            contract: result || {},
            req: contractFormat(result.req),
            res: contractFormat(result.res),
            nav: 'service',
            errorMsg: error && error.msg,
            id: result && result._id && result._id.toString(),
            srv_id: req.query.srv_id,
            NO: req.query.no
        });
    });
});

module.exports = router;
