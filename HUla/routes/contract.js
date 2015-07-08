var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('contract', { title: '契约', nav: 'contract' });
});

module.exports = router;
