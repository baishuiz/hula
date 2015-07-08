var dataStructure = require('./dataStructure');

var utility = {
    /*
     * @描述： 枚举对象生成
     */
    enumCreater : function(enumArr) {
        var enumObj = {};
        for (var i = 0; i < enumArr.length; i++) {
        var activeEnum = Things[i];
        enumObj[activeEnum] = activeEnum;
        };
    }  
};


var dataHelp = function() {
    parse : function(sheet){
        
    },

    save : function(data){
        // ToDo: save to db
    }
}


// 创建数据类型枚举
var dataType = utility.enumCreater([
       'NullableClass',
       'Int',
       'Price',
       'Dynamic',
       'List',
       'Boolean',
       'DateTime'
]);


// 导入契约
module.exports = function (xlsObject){
    // 遍历 Sheet
    xlsObject.forEach(function(sheet, index){
        var data = dataHelp.parse(sheet);
        dataHelp.save(data);
    });     
}