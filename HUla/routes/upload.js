var express = require('express');
var fs = require('fs');
var excel = require('../modules/excelHelper');
var router = express.Router();


router.get('/upload', function(req, res, next){
  res.render('upload',{nav: 'upload'});
});

router.post('/uploadhandler', function(req, res, next){
  var path = req.files.contractfile.path;

  excel(path, function(result){
    res.render('uploadfinish',{result: result, nav: 'upload'});
  });
});

module.exports = router;
