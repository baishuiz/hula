
(function () {
    var UI = (function () {
        var $loading = $('#js-mask');
        var $toast = $('#js-toast');
        var loadingTimer = 0;

        return {
            showLoading: function() {
                loadingTimer = setTimeout(function () {
                    $loading.show();
                }, 100);
            },
            hideLoading: function () {
                clearTimeout(loadingTimer);
                $loading.hide();
            },
            showError: function (text) {
                $toast.addClass('alert-danger').text(text).show();
                setTimeout(function () {
                    $toast.removeClass('alert-danger').text('').hide();
                }, 2000);
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
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
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

        var put = function (url, data, successFn, errorFn) {
            $.ajax({
                url: url,
                type: 'PUT',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
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

        var post = function (url, data, successFn, errorFn) {
            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
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
            put: put,
            post: post
        };
    })();

    /*
    * Service Page
    */
    var serviceAction = function () {
        var $servicePage = $('.service-page');
        var $serviceTable = $servicePage.find('.js-service-table');

        $servicePage.on('click', '.js-add-service', function (e) {
            e.preventDefault();
            var $emptyItem = $servicePage.find('.js-service-empty-item');
            $serviceTable.append($($emptyItem.html()));
        });

        // 编辑
        $serviceTable.on('click', '.js-edit', function (e) {
            e.preventDefault();
            var $target = $(this);
            var $root = $target.closest('tr');

            $target.hide();
            $root.find('input').removeAttr('disabled');
            $root.find('.js-save, .js-cancel').show();
            $root.find('.js-delete, .js-contract').hide();
        });

        // 确认
        $serviceTable.on('click', '.js-save', function (e) {
            e.preventDefault();
            var $target = $(this);
            var $root = $target.closest('tr');
            var id = $root.attr('data-id');
            var ajaxStr = id ? 'put' : 'post';

            UI.showLoading();
            Ajax[ajaxStr]('/restapi/service/' + id, {
                name: $root.find('.js-input-name').val(),
                url: $root.find('.js-input-url').val(),
                NO: $root.find('.js-input-no').val(),
                url: $root.find('.js-input-url').val()
            }, function (data) {
                UI.hideLoading();
                $target.hide();
                $root.find('input').each(function () {
                    $(this).attr('data-value', $(this).val()).attr('disabled', 'disabled')
                });

                if (data._id) {
                    var id = data._id.toString();
                    $root.attr('data-id', id);
                    $root.find('.js-contract').attr('href', '/contract/' + id);
                    $root.find('.js-delete').attr('href', '/service/delete/' + id);
                }

                $root.find('.js-cancel').hide();
                $root.find('.js-edit, .js-delete, .js-contract').show();
            }, function (error) {
                UI.hideLoading();
                error.msg && UI.showError(error.msg);
            })
        });

        // 取消
        $serviceTable.on('click', '.js-cancel', function (e) {
            e.preventDefault();
            var $target = $(this);
            var $root = $target.closest('tr');
            var id = $root.attr('data-id');

            if (!id) {
                $root.remove();
                return;
            }

            $target.hide();
            $root.find('input').each(function () {
                $(this).val($(this).attr('data-value')).attr('disabled', 'disabled')
            });
            $root.find('.js-save').hide();
            $root.find('.js-edit, .js-delete, .js-contract').show();
        });
    };

    var contractAction = function () {
        var $contractPage = $('.contract-page');
        var tplSingle = $('#tpl_single').html();
        var tplExtend = $('#tpl_extend').html();

        $contractPage.on('change', 'select', function () {
            var $target = $(this);
            var $parent = $target.closest('.input-wrap');
            var val = $target.val().trim();

            switch (val) {
                case 'Object':
                case 'List':
                    $parent.next().remove().end().after(tplExtend);
                    break;
                default:
                    $parent.next().remove();
            }
        });

        $contractPage.on('click', '.js-add', function () {
            $(this).closest('li').after(tplSingle);
        });

        $contractPage.on('click', '.js-delete', function () {
            $(this).closest('li').remove();
        });

        var loopList = function ($els) {
            var list = [];
            $els.each(function(){
                var $el = $(this);
                var $inputWrap = $el.find('.input-wrap');
                var subListValue = null;

                var $subList = $el.find('>ul>li');
                if ($subList.length) {
                    subListValue = loopList($subList);
                }

                var key = $.trim($inputWrap.find('.js-key').val());
                var name = $.trim($inputWrap.find('.js-name').val());
                var type = $.trim($inputWrap.find('.js-type').val());

                if (!key) {
                    return;
                }

                list.push({
                    key: key,
                    name: name,
                    type: type,
                    value: subListValue
                });
            });
            return list;
        };
        $contractPage.on('click', '.js-save-contract', function (e) {
            e.preventDefault();
            var reqData = loopList($('.contract-list.js-req>li'));
            var resData = loopList($('.contract-list.js-res>li'));
            var id = $contractPage.attr('data-id');

            UI.showLoading();
            Ajax.put('/restapi/service/' + id, {
                req: reqData,
                res: resData
            }, function (data) {
                UI.hideLoading();

            }, function (error) {
                UI.hideLoading();
                error.msg && UI.showError(error.msg);
            })

        });
    }

    $(document).on('ready', function () {
        serviceAction();
        contractAction();
    });

})();
