var xlsx       = require('node-xlsx');
var fs         = require('fs');
var excel      = require('./modules/excelHelper');
var service = require('./modules/service');
var contract = require('./modules/contract');

excel();

//find data from
/*
contract.find(function(err, res){
  if(err){
    console.log(err);
    return;
  }
  console.log('successed');
  console.log(res);
  debugger;
});
*/