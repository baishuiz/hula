##Rest API
```
Service
    get (/restapi/service/)
        req

        res
            ack
            count
            services
                _id
                name
                url
                req
                res
    get (/restapi/service/:_id)
        req
            _id
        res
            ack
            service
                name
                url
                req
                res
    post (/restapi/service/)
        req
            name
            url
            req
            res
        res
            ack
            _id
    put (/restapi/service/:_id)
        req
            _id
            name
            url
            req
            res
        res
            ack
    delete (/restapi/service/)
        req
            ids
        res
            ack
    delete (/restapi/service/:_id)
        req
            _id
        res
            ack
Case
    get (/restapi/case/)
        req
            srv_id
        res
            ack
            cont
            cases
                _id
                name
                req
                res
    get (/restapi/case/:_id)
        req
            _id
        res
            ack
            case
                srv_id
                name
                req
                res
    post (/restapi/case/)
        req
            srv_id
            name
            req
            res
        res
            ack
            _id
    put (/restapi/case/:_id)
        req
            _id
            name
            req
            res
        res
            ack
    delete (/restapi/case/)
        req
            ids
        res
            ack
    delete (/restapi/case/:_id)
        req
            _id
        res
            ack
```


##Data
```
Service
    _id
    name
    url
    req
    res
Case
    _id
    srv_id
    name
    req
    res
```

## Contract Format for Mongo
```javascript
// Metadata: Number, String, Object, List, Array, Boolean
{
    a: {
        _info:{
            "metadata": "Object",
            "remark": "啊啊啊啊"
        }
        b: {
            _info: {
                "metadata": "Number",
                "remark": "啊啊啊啊"
            }
        }
        c: {
            _info: {
                "metadata": "Object",
                "remark": "啦啦啦"
            }
            d: {
                _info: {
                    "metadata": "String",
                    "remark": "啊啊啊"
                }
            }
        }
    }
}
```
## Contract Format for Front
```javascript
// Metadata: Number, String, Object, List, Array, Boolean
[{
    "key": "datatp",
    "remark": "类型",
    "metadata": "",
    "value": null
}, {
    "key": "promts",
    "remark": "促销",
    "metadata": "",
    "value": [{
        "key": "type",
        "remark": "类型",
        "metadata": "",
        "value": null
    }, {
        "key": "addinfo",
        "remark": "附加信息",
        "metadata": "",
        "value": [{
            "key": "id",
            "remark": "编号",
            "metadata": "",
            "value": null
        }]
    }]
}]
```
