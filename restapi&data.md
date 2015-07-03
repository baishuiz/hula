##Rest API
```
Service
    get
        req

        res
            ack
            count
            services
                name
                url
    post
        req
            name
            url
        res
            ack
            id
    put
        req
            id
            name
            url
        res
            ack
    delete
        req
            id
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
                id
                req_json
                res_json
    post
        req
            srv_id
            req_json
            res_json
        res
            ack
            id
    put
        req
            id
            srv_id
            req_json
            res_json
        res
            ack
    delete
        req
            id
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
                id
                req_json
                res_json
    post
        req
            con_id
            req_json
            res_json
        res
            ack
            id
    put
        req
            id
            con_id
            req_json
            res_json
        res
            ack
    delete
        req
            id
            con_id
        res
            ack
```


##Data
```
Service
    id
    name
    url
Contract
    id
    srv_id
    req_json
    res_json
Case
    id
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