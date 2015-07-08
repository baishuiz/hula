var tree = {};
var nameStack = [];
var createNode = function(lineData){
    var stru = {
    	key : lineData[5],
    	name: lineData[1],
    	type: lineData[6], // 需转换
    }
    return stru;
}