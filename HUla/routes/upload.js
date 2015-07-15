var express = require('express');
var fs = require('fs');
var excel = require('../modules/excelHelper');
var router = express.Router();


router.get('/upload', function(req, res, next){
  res.render('upload');
});

router.get('/uploadfinish', function(req, res, next){
  res.render('uploadfinish');
});

router.post('/upload', function(req, res, next){
  var path = req.files.contractfile.path;

  var msg = excel(path);
  console.log(msg);
  res.redirect('/uploadfinish');
});

module.exports = router;
