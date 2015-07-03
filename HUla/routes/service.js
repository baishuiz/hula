var express = require('express');
var router = express.Router();
var serviceModel = require('../modules/service');

/* GET service*/
router.get('/', function(req, res, next) {
    serviceModel.find(null, null, function(error, result){
        res.send(JSON.stringify(result));
    });
});

module.exports = router;
