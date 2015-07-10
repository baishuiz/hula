function loopObj (obj) {
    var returnAry = [];
    // TODO
    return returnAry;
}

function loopAry (ary) {
    var returnObj = {};

    ary && ary.forEach(function (obj) {
        if (obj.key) {
            switch (obj.metadata) {
                case 'String':
                case 'Number':
                case 'Boolean':
                case 'Array':
                    returnObj[obj.key] = obj.val;
                    break;
                case 'List':
                    if (!returnObj[obj.key]) {
                        returnObj[obj.key] = [];
                    }
                    obj.value.forEach(function (listAry) {
                        returnObj[obj.key].push(loopAry(listAry));
                    })
                    break;
                case 'Object':
                    returnObj[obj.key] = loopAry(obj.value);
                    break;
                default:
                    break;
            }
        }
    });

    return returnObj;
}

module.exports = {
    dbToView: loopObj,
    viewToDb: loopAry
}
