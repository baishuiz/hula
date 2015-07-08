
(function () {
    var UI = (function () {
        var $loading = $('#js-mask');
        var $toast = $('#js-toast');
        return {
            showLoading: function() {
                $loading.show();
            },
            hideLoading: function () {
                $loading.hide();
            },
            showError: function (text) {
                $toast.addClass('alert-danger').text(text).show();
                setTimeout(function () {
                    $toast.removeClass('alert-danger').text('').hide();
                }, 2000)
            }
        };
    })();

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

        var put = function (url, data, successFn, errorFn) {
            $.ajax({
                url: url,
                type: 'PUT',
                data: data
            }).done(function (data) {
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
            get: get,
            put: put
        };
    })();

    /*
    * Service Page
    */
    var serviceAction = function () {
        $('.js-service-table').on('click', '.js-edit', function (e) {
            e.preventDefault();
            var $target = $(this);
            var $root = $target.closest('tr');

            $target.hide();
            $root.find('input').removeAttr('disabled');
            $root.find('.js-save, .js-cancel').show();
            $root.find('.js-delete').hide();
        });

        // TODO
        $('.js-service-table').on('click', '.js-save', function (e) {
            e.preventDefault();
            var $target = $(this);
            var $root = $target.closest('tr');
            var id = $root.attr('data-id');

            UI.showLoading();
            Ajax.put('/restapi/service/' + id, {
                name: $root.find('.js-input-name').val(),
                url: $root.find('.js-input-url').val()
            }, function (data) {
                UI.hideLoading();
                $target.hide();
                $root.find('input').each(function () {
                    $(this).attr('data-value', $(this).val()).attr('disabled', 'disabled')
                });
                $root.find('.js-cancel').hide();
                $root.find('.js-edit, .js-delete').show();
            }, function (error) {
                UI.hideLoading();
                error.msg && UI.showError(error.msg);
            })
        });

        $('.js-service-table').on('click', '.js-cancel', function (e) {
            e.preventDefault();
            var $target = $(this);
            var $root = $target.closest('tr');

            $target.hide();
            $root.find('input').each(function () {
                $(this).val($(this).attr('data-value')).attr('disabled', 'disabled')
            });
            $root.find('.js-save').hide();
            $root.find('.js-edit, .js-delete').show();
        });
    };


    $(document).on('ready', function () {
        serviceAction();
    });

})();
