var utility = require('./utility');

//var nameStack = [{name:'root', index:0}];

var nameStack = (function(){
    var itemStack = [];
    var nameList = [];
    var api = {
        enter : function(item){
        	// item
        	// nameList
        	itemStack.unshift({name:item.name, index:item.index});
        	nameList.push(item.name);
        	return this;
        },

        exit : function(index){
        	while(itemStack[0].index >= index){
        		itemStack.shift();
        		nameList.pop();
        	}
        	return this;
        },

        get : function(index){
        	var result = [];
        	for (var i = itemStack.length - 1; i >= 0; i--) {
        		var item = itemStack[i];
        		if(item.index === index){
        			result.push(item);
        		}
        		if(item.index < index){
                    break;
                }
        	};
        },

        getNs : function(){
            return nameList.join('.');
        },

        /*
        * @param 获取栈顶元素
        */
        getHeadItem : function(){
            return itemStack[0];
        }
    }
	return api;
})();

//init namestack
nameStack.enter({name:'root', index:0});

var createNode = function(item){
    var stru = {
        key : item.key,
        name: item.desc,
        type: item.type,
        value : []
    }
    return stru;
}


var tree = {
    /*
    * @param {Object} item: {name:'root', index:0}
    */
    insert : function(item, root){
        var headitem = nameStack.getHeadItem();
        if(item.index <= headitem.index){
            nameStack.exit(item.index);
        }
        nameStack.enter(item);
        utility.NS(nameStack.getNs(), root, { "_info": {"metadata" : item.type, "remark" : item.desc }});
    }
};

module.exports = tree;