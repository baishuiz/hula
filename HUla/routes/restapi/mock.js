var express = require('express');
var router = express.Router();
var serviceModel = require('../../modules/service');
var caseModel = require('../../modules/case');
var contractModel = require('../../modules/contract');
var resHandler = require('../../libs/resHandler');
var contractFormat = require('../../libs/contractFormat');

router.use('/mock', function(req, res, next) {  // GET 'http://www.example.com/mock/new'
console.log(req.originalUrl); // '/mock/new'
console.log(req.baseUrl); // '/mock'
console.log(req.body,"***************************"); // '/new'

serviceModel.find({url:req.path}, null, function(error, result){

  if(error || !result[0]){
    res.json({msg:"服务未找到" + req.path})
    return;
  }
    var service = result[0];

    contractModel.find({srv_id:service._id}, null, function(error, result){
        if(error || !result || !result[0]){
          res.json({msg:"契约未找到" + req.path})
          return;
        }
        result = result || [];
        var con_id = result[0]._id;
        // console.log(req.body.productSearchChannelCode);
        // res.send(req.body);
        console.log(req.body,"************************************")
        caseModel.find({ con_id: con_id, req: req.body }, null, function(error, result){
            // TODO 格式转换

            res.json(result[0] ? result[0].res : {msg:"未匹配到请求数据"});
        });
    });


});
// next();
});

// 验证请求数据是否符合契约
function validReq(req, contract){
    var result;
    console.log(contract);
   for(var key in contract.req){
       switch(key){
         case  'Number' :
           result = _.isNumber(req[key]);
           break;
       }

       if(!result){

           return result;
       }
   }
   return true;
}


// router.get('/restapi/service/', function(req, res, next) {
//     serviceModel.find(null, null, function(error, result){
//         res.json(resHandler({
//             services: result,
//             count: result && result.length || 0
//         }, error));
//     });
// });

// router.get('/restapi/service/:_id', function(req, res, next) {
//     serviceModel.findById(req.params._id, null, function(error, result){
//         res.json(resHandler({ service: result }, error));
//     });
// });

// router.post('/restapi/service/', function(req, res, next) {
//     serviceModel.create(req.body, function (error, result) {
//         res.json(resHandler({ _id: result }, error));
//     });
// });

// router.put('/restapi/service/:_id', function(req, res, next) {
//     serviceModel.findOneAndUpdate({ _id: req.params._id }, req.body, null, function (error, result) {
//         res.json(resHandler(null, error));
//     });
// });

// router.delete('/restapi/service/', function(req, res, next) {
//     serviceModel.remove({ _id : { $in: req.body.ids }}, function (error, result) {
//         res.json(resHandler(null, error));
//     });
// });

// router.delete('/restapi/service/:_id', function(req, res, next) {
//     serviceModel.findByIdAndRemove(req.params._id, null, function (error, result) {
//         res.json(resHandler(null, error));
//     });
// });

module.exports = router;
