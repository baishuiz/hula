var express = require('express');
var router = express.Router();
var serviceModel = require('../modules/service');

router.get('/services', function(req, res, next) {
    serviceModel.find(null, null, function(error, result){
        res.render('service', { title: '服务', services: result, nav: 'service', errorMsg: error && error.msg });
    });
});

router.get('/service/delete/:_id', function(req, res, next) {
    serviceModel.findByIdAndRemove(req.params._id, null, function (error, result) {
        if (error) {
            res.render('error', { title: '错误', message: '错误', nav: 'service', error: error });
        } else {
            res.redirect('/services');
        }
    });
});

module.exports = router;
