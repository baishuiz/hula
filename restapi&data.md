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
    get
        req
            _id
        res
            ack
            service
                name
                url
    post
        req
            name
            url
        res
            ack
            _id
    put
        req
            _id
            name
            url
        res
            ack
    delete
        req
            _id
        res
            ack
Contract
    get
        req
            srv_id
        res
            ack
            count
            contracts
                _id
                req_json
                res_json
    get
        req
            _id
        res
            ack
            contract
                srv_id
                req_json
                res_json
    post
        req
            srv_id
            req_json
            res_json
        res
            ack
            _id
    put
        req
            _id
            srv_id
            req_json
            res_json
        res
            ack
    delete
        req
            _id
            srv_id
        res
            ack
Case
    get
        req
            con_id
        res
            ack
            cont
            cases
                _id
                req_json
                res_json
    get
        req
            _id
        res
            ack
            case
                con_id
                req_json
                res_json
    post
        req
            con_id
            req_json
            res_json
        res
            ack
            _id
    put
        req
            _id
            con_id
            req_json
            res_json
        res
            ack
    delete
        req
            _id
            con_id
        res
            ack
```


##Data
```
Service
    _id
    name
    url
Contract
    _id
    srv_id
    req_json
    res_json
Case
    _id
    con_id
    req_json
    res_json
```

## Contract Format (req_json, res_json)
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