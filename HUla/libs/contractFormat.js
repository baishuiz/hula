function loopObj (obj) {
    obj = obj || {};
    var returnAry = [];
    var subObj = null;

    for (var k in obj) {
        subObj = obj[k];

        if (subObj._info) {
            returnAry.push({
                key: k,
                remark: subObj._info.remark,
                metadata: subObj._info.metadata,
                value: loopObj(subObj)
            });
        }
    }

    return returnAry;
}

function loopAry (ary) {
    ary = ary || [];
    var returnObj = {};
    var subAry = null;

    for (var i = 0, len = ary.length, obj; i < len; i++) {
        obj = ary[i];

        returnObj[obj.key] = {
            _info: {
                remark: obj.remark,
                metadata: obj.metadata
            }
        }
        if (obj.value) {
            returnObj[obj.key] = _.extend(returnObj[obj.key], loopAry(obj.value));
        }
    }

    return returnObj;
}

module.exports = {
    dbToView: loopObj,
    viewToDb: loopAry
}
