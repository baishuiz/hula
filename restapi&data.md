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
                req_contract
                res_contract
    get (/restapi/service/:_id)
        req
            _id
        res
            ack
            service
                name
                url
                req_contract
                res_contract
    post (/restapi/service/)
        req
            name
            url
            req_contract
            res_contract
        res
            ack
            _id
    put (/restapi/service/:_id)
        req
            _id
            name
            url
            req_contract
            res_contract
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
                req_json
                res_json
    get (/restapi/case/:_id)
        req
            _id
        res
            ack
            case
                srv_id
                name
                req_json
                res_json
    post (/restapi/case/)
        req
            srv_id
            name
            req_json
            res_json
        res
            ack
            _id
    put (/restapi/case/:_id)
        req
            _id
            name
            req_json
            res_json
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
    req_contract
    res_contract
Case
    _id
    srv_id
    name
    req_contract
    res_contract
```

## Contract Format (req_contract, res_contract)
```javascript
// Type
// Number, String, Object, List, Array, Boolean
[{
    "key": "datatp",
    "name": "类型",
    "type": "string",
    "value": null
}, {
    "key": "promts",
    "name": "促销",
    "type": "array-list",
    "value": [{
        "key": "type",
        "name": "类型",
        "type": "number",
        "value": null
    }, {
        "key": "addinfo",
        "name": "附加信息",
        "type": "object",
        "value": [{
            "key": "id",
            "name": "编号",
            "type": "string",
            "value": null
        }]
    }]
}]
```