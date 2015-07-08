var xlsx       = require('node-xlsx');
var fs         = require('fs');
//var toContract = require('./tocontract');


//module.exports = function(filePath, callBack ) {
    var xls  = parseExcel();
    //console.log(xls);
    fs.writeFile("tttttttttt",JSON.stringify(xls))
    //var json = toContract(xls);
    // save contract
//}



function parseExcel(filePath){
    var filename  = __dirname + '/../酒店 - 服务接口 - H5.xlsx'; // 测试文件
    var xlsObject = xlsx.parse(filename);
    return xlsObject;
}


// save 契约
// TODO: @xmf