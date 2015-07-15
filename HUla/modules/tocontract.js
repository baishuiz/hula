var dataStructure = require('./dataStructure');
var service = require('./service');
var contract = require('./contract');
var dataHelp = {
    parseURL: function(sheet){
      var name = sheet.name,
          rows = sheet.data;
      var resturl = /Restful\s?URL/i,
          serverno = /Service\s?Code/i,
          urlindex = 0 ,
          servernoindex = 0,
          findurl = false,
          findserverno = false;
      var result = [];
      if(name == "Overview" && rows && rows.length){
        var title = rows[0];
        for(var i=0, len=title.length; i<len; i++){
          var t = title[i];
          if(resturl.test(t) && !findurl){
            urlindex = i;
            findurl = true;
          }
          if(serverno.test(t) && !findserverno){
            servernoindex = i;
            findserverno = true;
          }

          if(findserverno && findurl){
            break;
          }
        }

        for(j=1, l= rows.length; j<l; j++){
          var row = rows[j];
          result.push({
            serverno : row[servernoindex],
            resturl  : row[urlindex]
          });
        }
        return result;
      }
      return null;
    },

    parse : function(sheet, serverurlmap){
      var name = sheet.name;
      if(name == "Overview"){
        return ;
      }
      var reg = /(\d+)(.+)/;
      var res = reg.exec(name);
      var serverno, servername, serverresturl;
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

      //获取服务对象的rest url
      if(serverurlmap && serverurlmap.length){
        serverurlmap.forEach(function(s){
          if(s.serverno == serverno){
            serverresturl = s.resturl;
            return false;
          }
        });
      }

      return {
        serverno : serverno,
        servername: servername,
        serverresturl : serverresturl,
        req : request.root,
        res : response.root
      }
    },

    save : function(data, callback){
      var msg;
      if(!data){
        callback && callback(msg);
        return;
      }
      service.create({name:data.servername, NO: data.serverno, url: data.serverresturl},
        function(err, res){
          if(err){
              //console.log(err);
              msg = { text: "创建service:"+data.serverno+"失败", ack:1 };
              callback && callback(msg);
              return;
            }
            msg = { text: "创建service:"+data.serverno+"成功", ack:0};
            contract.create({
              srv_id : res,
              NO: data.serverno,
              res: data.res
            },function(err){
              if(err){
                  //console.log(err);
                  msg ={ text:"创建contract:"+data.serverno+"失败", ack:1};
                  callback && callback(msg);
                  return;
                }
                msg = {text: "创建contract:"+data.serverno+"成功", ack:0};
                callback && callback(msg);
            });
        });
      }
}


function iterate(datas,msg, callback){
    var data = datas.shift();
    dataHelp.save(data, function(result){
        msg = msg || [];
        msg.push(result);
        if(datas.length){
          iterate(datas, msg,callback);
        }else{
          callback && callback(msg);
        }
    });
}

// 导入契约
module.exports = function (xlsObject, callback){
    var datas = [];
    var serverurlmap = [];
    // 遍历 Sheet
    xlsObject.forEach(function(sheet, index){
        //解析overview， 提取resturl
        if(index == 0){
          serverurlmap = dataHelp.parseURL(sheet);
        }else{
          //解析具体契约，提取每个契约对象
          var data = dataHelp.parse(sheet, serverurlmap);
          if(data){
              datas.push(data);
          }
        }
    });
    iterate(datas, [], callback);
}
