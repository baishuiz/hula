##Rest API
```
Service
    get
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
    get
        req
            _id
        res
            ack
            service
                name
                url
                req_contract
                res_contract
    post
        req
            name
            url
            req_contract
            res_contract
        res
            ack
            _id
    put
        req
            _id
            name
            url
            req_contract
            res_contract
        res
            ack
    delete
        req
            _id
        res
            ack
Case
    get
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
    get
        req
            _id
        res
            ack
            case
                srv_id
                name
                req_json
                res_json
    post
        req
            srv_id
            name
            req_json
            res_json
        res
            ack
            _id
    put
        req
            _id
            name
            req_json
            res_json
        res
            ack
    delete
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
    req_contract
    res_contract
```

## Contract Format (req_contract, res_contract)
```javascript
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