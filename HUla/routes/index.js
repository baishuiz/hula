var express = require('express');
var router = express.Router();

// router.use(function(req, res, next) {
//   res.send(req.baseUrl);
//   // next();
// });

function use (routerConfig){
  router.use(require(routerConfig));
}

use('./contract');
use('./service');
use('./case');
use('./uploadfile');
use('./upload');
use('./restapi/service');
use('./restapi/contract');
use('./restapi/case');
use('./restapi/mock');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/services');
});




module.exports = router;
