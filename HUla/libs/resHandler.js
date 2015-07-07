var _ = require('underscore');

module.exports = function (result, error, msg) {
    if (error) {
        return {
            ack: 1,
            msg: msg || error.stack,
            Extension: error
        };
    } else {
        return _.extend({ ack: 0 }, result);
    }
};
