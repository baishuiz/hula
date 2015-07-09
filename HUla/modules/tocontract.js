var dataStructure = require('./dataStructure');
var service = require('./service');
var contract = require('./contract');

var dataHelp = {
    parse : function(sheet){
      var name = sheet.name;
      if(name == "Overview"){
        return ;
      }
      var reg = /(\d+)(.+)/;
      var res = reg.exec(name);
      var serverno, servername;
      if(res){
        serverno = res[1];
        servername = res[2];
      }
      var rows = sheet.data,
          startIndex = 1, 
          requestCount = 2,
          endIndex = rows.length;
      //没有request，格式不对，直接退出
      if(!rows[startIndex][0]){
        return;
      }
      //找到response 开始的行数
      for(; requestCount<endIndex; requestCount++){
        if(rows[requestCount][0]){            
          break;
        }
      }
      
      var request = dataStructure(sheet.data, startIndex, requestCount);      
      var response = dataStructure(sheet.data, requestCount+1, endIndex);
      
      return {
        serverno : serverno,
        servername: servername,
        req : request.root,
        res : response.root
      }
    },

    save : function(data){      
      service.create({name:data.servername, NO: data.serverno, url: data.serverno},
        function(err, res){
          if(err){
            console.log(err);
            console.log("创建service:"+data.serverno+"失败");
            return;
          }
          console.log("创建service:"+data.serverno+"成功")
          contract.create({
            srv_id : res,
            NO: data.serverno,
            req: data.req,
            res: data.res
          },function(err){
            if(err){            
              console.log(err);
              console.log("创建contract:"+data.serverno+"失败");
              return;
            }
            console.log("创建contract:"+data.serverno+"成功");
          });    
        })
      
        // ToDo: save to db
    }
}


// 导入契约
module.exports = function (xlsObject){
    // 遍历 Sheet
    xlsObject.forEach(function(sheet, index){   
        var data = dataHelp.parse(sheet);
        if(data){
          dataHelp.save(data);
        }
    });     
}