var utility = {

    /**
    * @name NEG.base.NS
    * @class [创建命名空间]
    * @param {String} NSString [要创建的命名空间，以点号隔开(Biz.Common)]
    * @param {Object} root [参数NSString的根节点，(默认是window)]
    * @return {Object} [返回创建的对象，若已存在则直接返回]
    * @example
    * NEG.base.NS("Biz.Common").ConsoleOne=function(){console.log(1);};
    * Biz.Common.ConsoleOne();
    * 结果：输出 1
    */
    NS: function (NSString, root, defaultdata) {
        var nsPath = NSString.split("."), ns = root || window || {}, root = ns;
        for (var i = 0, len = nsPath.length; i < len; i++) {
            ns[nsPath[i]] = ns[nsPath[i]] || {};
            
            if(i == len-1 && defaultdata){
            	ns[nsPath[i]] = defaultdata;	
            }
            ns = ns[nsPath[i]];
        };
        return ns;
    },

    /*
     * @描述： 枚举对象生成
     */
    enumCreater : function(enumArr) {
        var enumObj = {};
        for (var i = 0; i < enumArr.length; i++) {
	        var activeEnum = enumArr[i];
	        enumObj[activeEnum] = activeEnum;
        };
        return enumObj;
    } 	
};


module.exports = utility;