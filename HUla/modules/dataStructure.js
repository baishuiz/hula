var tree = require('./tree');
var utility = require('./utility');

// 创建数据类型枚举
var dataType = utility.enumCreater([
       'NullableClass',
       'Int',
       'Price',
       'Dynamic',
       'List',
       'Boolean',
       'DateTime',
       'Enum'
]);

/*
* @param 解析获取index
*/
var shortIndex =0,  //short name 在第几列
    metadataIndex = 0, //metadata 在第几列
    descIndex = 0 ; //描述 在第几列
function parseIndex(title){
    var findShortNameIndex = false,findTypeIndex = false, finddesc = false;
  	for(var i =0,len=title.length;i <len;i++){
		var col = title[i];
		if(/Short\s?Name/i.test(col)){
		  shortIndex = i;
		  findShortNameIndex = true;
		}
      	if(/metadata/i.test(col)){
        	metadataIndex = i;
        	findTypeIndex = true;
      	}
      	if(/Remark/i.test(col)){
      		descIndex = i;
      		finddesc = true;
      	}
      	if(findShortNameIndex && findTypeIndex && finddesc){
      		break;
      	}
	}
}

function Cell(lineData, index){
	var type = lineData[metadataIndex] || dataType.NullableClass;
	var desc = lineData[descIndex];
	var jstype = "String";
	switch(true){
        // TODO 数组Array
		case type == dataType.NullableClass:
			jstype = "Object";
			break;
		case type == dataType.List:
			jstype = "List";
			break;
		case type == dataType.Boolean:
			jstype = "Boolean";
			break;
    case type == dataType.Enum:
		case type == dataType.Price:
		case type.indexOf(dataType.Int)>=0:
			jstype = "Number";
			break;
		case type == dataType.DateTime:
		case type == dataType.Dynamic:
		default:
			break;
	}

	return { name: (lineData[shortIndex] || '').trim(), index: index, type: jstype, desc : desc };
}

function parse(data, startindex, endindex){
	var root = {};
    for (var rowIndex = startindex; rowIndex < endindex; rowIndex++) {
    	var lineData = data[rowIndex];
    	for (var columnIndex = 1; columnIndex < lineData.length; columnIndex++) {
    		if(lineData[columnIndex]){
    			var key = new Cell(lineData, columnIndex, shortIndex, metadataIndex);
    			tree.insert(key, root);
            	break;
            }
    	}
    }
    return root;
}

module.exports = function(data, startindex, endindex){
	parseIndex(data[0]);
	return parse(data, startindex, endindex);
}
