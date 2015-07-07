var xlsx = require('node-xlsx');
var fs = require('fs');

//var fixture = JSON.parse(fs.readFileSync(__dirname + '/fixtures/test.json'));
var filename = __dirname + '/酒店 - 服务接口 - H5.xlsx';
var xlsObject;

var objClass = 'NullableClass',
    numClass = /Int\d|Price/i,
    strClass = 'Dynamic',
    arrClass = 'List',
    boolClass = 'Boolean',
    dateClass = 'DateTime'


// parse file
xlsObject = xlsx.parse(filename);

xlsObject.forEach(function(sheet,index){
  if(index ==0){
    return;
  }
  var rowcount = sheet.length; //总行数
    var shortIndex =0,  //short name 在第几列
        metadataIndex = 0; //metadata 在第几列
    var row = sheet[0]; //第一行    
    row.forEach(function(col,ci){
      if(/Short\s?Name/i.test(col)){
        shortIndex = ci;
      }
      if(/metadata/i.test(col)){
        metadataIndex = ci;
      }
    });

var request = {"key": sheet[1][0], "type":"object","value":{}}
  , response
  , responseIndex =0;
for(var ri=2; ri<rowcount;ri++){  
  row = sheet[ri];
  if(!responseIndex){
    for(var ci = 1; ci < shortIndex; ci++){
      var col = row[ci];
      for(var rii=ri; ri<rowcount;ri++){
        if(row[rii]){

        }
      }
    }
  }
   if(sheet[ri][0]){
      response = {"key": sheet[ri][0], "type":"object","value":{}};
      responseIndex = ri; //response对象开始行数
   }

}

function rowIndex(startIndex, rows){
  for(var rowcount = rows.length; startIndex<rowcount;startIndex++){
    if(row[startIndex]){
      return startIndex;
      break;
    }
  }
  return -1;  
}


      
      if(!request){
        request ={"key": row[0], "type":"object","value":{}};
      }else if(!row[0]){
        response = {"key": row[0], "type":"object","value":{}};
      }
      for(var j=1;j<shortIndex;j++){
        if(row[j]){
          request.value[row[shortIndex]]
        }
      }
    }
});