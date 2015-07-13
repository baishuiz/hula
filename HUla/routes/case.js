var express = require('express');
var router = express.Router();
var caseModel = require('../modules/case');
var contractModel = require('../modules/contract');
var serviceModel = require('../modules/service');
var contractFormat = require('../libs/contractFormat');
var caseFormat = require('../libs/caseFormat');

// TODO 后续case主页面可以单独访问，并根据select的服务和契约新建case

router.get('/case/', function(req, res, next) {
    var reqObj = req.query.con_id ? { con_id: req.query.con_id } : {};

    caseModel.find(reqObj, null, function (error, result) {
        var srv_id = req.query.srv_id || '';
        res.render('case', {
            title: '用例',
            cases: result || {},
            nav: 'service',
            errorMsg: error && error.msg,
            showSubTitle: !!srv_id,
            con_id: req.query.con_id || '',
            srv_id: srv_id || '',
            NO: req.query.no || '',
            referer: req.header('Referer') || ('/contract/?srv_id=' + (srv_id || ''))
        });
    });
});

router.get('/case/new', function(req, res, next) {
    var srv_id = req.query.srv_id || '';
    var referer = req.header('Referer') || ('/contract/?srv_id=' + (srv_id || ''));
    contractModel.findById(req.query.con_id, null, function (error, result) {
        if (error) {
            res.render('error', { title: '错误', message: '错误', nav: 'service', error: error });
        } else {
            if (!result) {
                res.redirect(referer);
            } else {
                res.render('case-editor', {
                    title: '新增用例',
                    contract: {},
                    con_req: contractFormat.dbToView(result.req),
                    con_res: contractFormat.dbToView(result.res),
                    nav: 'service',
                    id: '',
                    con_id: req.query.con_id || '',
                    srv_id: srv_id,
                    NO: req.query.no || '',
                    referer: referer
                });
            }
        }
    });
});

router.get('/case/:_id', function(req, res, next) {
    var srv_id = req.query.srv_id || '';
    var referer = req.header('Referer') || ('/contract/?srv_id=' + (srv_id || ''));

    caseModel.findById(req.params._id, null, function (error, result) {
        result = result || {};
        var con_id = result.con_id || req.query.con_id;

        if (con_id) {
            contractModel.findById(con_id, null, function (error, contract) {
                if (error) {
                    res.render('error', { title: '错误', message: '错误', nav: 'service', error: error });
                } else {
                    if (!result) {
                        res.redirect(referer);
                    } else {
                        res.render('case-editor', {
                            title: '编辑用例',
                            name: result.name || '',
                            con_req: contractFormat.dbToView(contract.req),
                            con_res: contractFormat.dbToView(contract.res),
                            case_req: result.req,
                            case_res: result.res,
                            nav: 'service',
                            errorMsg: error && error.msg,
                            id: result && result._id && result._id.toString(),
                            con_id: req.query.con_id || '',
                            srv_id: srv_id,
                            NO: req.query.no,
                            referer: referer
                        });
                    }
                }
            });
        }
    });
});

router.post('/case/result/', function(req, res, next) {
    var caseIds = (req.body.ids || '').split(',');
    caseModel.find({_id: { $in: caseIds } }, function (error, cases) {
        var conIds = _.pluck(cases, 'con_id');
        contractModel.find({_id: {$in : conIds}}, function (error, contracts) {
            var srvIds = _.pluck(contracts, 'srv_id');
            serviceModel.find({_id: {$in : srvIds}}, function (error, services) {
                res.render('case-result', {
                    title: '执行用例',
                    nav: 'service',
                    cases: cases,
                    contract: contracts && contracts[0],
                    service: services && services[0]
                });
            });
        });
    });
});

router.get('/case/delete/:_id', function(req, res, next) {
    caseModel.findByIdAndRemove(req.params._id, null, function (error, result) {
        if (error) {
            res.render('error', { title: '错误', message: '错误', nav: 'service', error: error });
        } else {
            res.redirect('back');
        }
    });
});

module.exports = router;
