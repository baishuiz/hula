
(function () {

    /*
    * Ajax
    */
    var Ajax = (function () {
        var successHandler = function (data) {
            data = data || {};
            return data;
        };

        var errorHandler = function (error) {
            error = error || {};

            return {
                ack: 0,
                msg: error.status + ': ' + error.statusText
            }
        }

        var get = function (url, successFn, errorFn) {
            $.getJSON(url)
                .done(function (data) {
                    data = successHandler(data);
                    if (data.ack) {
                        errorFn && errorFn(data);
                    } else {
                        successFn && successFn(data);
                    }
                })
                .fail(function (error) {
                    error = errorHandler(error);
                    errorFn && errorFn(error);
                });
        }

        return {
            get: get
        };
    })();

    /*
    * Service Page
    */
    var serviceAction = function () {
        Ajax.get('/restapi/service', function (data) {
            data.services
        }, function (error) {

        })
    };


    $(document).on('ready', function () {
        serviceAction();
    });

})();
