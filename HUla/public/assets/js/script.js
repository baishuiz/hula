
(function () {
    /*
    * Utility
    */
    var Util = {};

    /*
    * UI
    */
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
        var $emptyElm = $serviceTable.find('.js-empty')

        $servicePage.on('click', '.js-add-service', function (e) {
            e.preventDefault();

            if (!$serviceTable.find('>tbody>tr').not($emptyElm).length) {
                $emptyElm.hide();
            }

            var $tplItem = $servicePage.find('.js-service-tpl-item');
            $serviceTable.append($($tplItem.html()));
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
            var NO = $.trim($root.find('.js-input-no').val());

            UI.showLoading();
            Ajax[ajaxStr]('/restapi/service/' + id, {
                name: $.trim($root.find('.js-input-name').val()),
                url: $.trim($root.find('.js-input-url').val()),
                NO: NO
            }, function (data) {
                UI.hideLoading();
                $target.hide();
                $root.find('input').each(function () {
                    $(this).attr('data-value', $(this).val()).attr('disabled', 'disabled')
                });

                if (data._id) {
                    var id = data._id.toString();
                    $root.attr('data-id', id);
                    $root.find('.js-contract').attr('href', '/contract/?srv_id=' + id + '&no=' + NO);
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

            if ($serviceTable.find('>tbody>tr').not($emptyElm).length < 2) {
                $emptyElm.show();
            }

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

    /*
    * Contract Page
    */
    var contractAction = function () {
        var $contractPage = $('.contract-page');
        var tplSingle = $('#tpl_single').html();
        var tplExtend = $('#tpl_extend').html();

        $contractPage.on('change', 'select', function () {
            var $target = $(this);
            var $parent = $target.closest('.input-wrap');
            var val = $.trim($target.val());

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
                var remark = $.trim($inputWrap.find('.js-remark').val());
                var metadata = $.trim($inputWrap.find('.js-metadata').val());

                if (!key) {
                    return;
                }

                list.push({
                    key: key,
                    remark: remark,
                    metadata: metadata,
                    value: subListValue
                });
            });
            return list;
        };
        // TODO 验证input
        $contractPage.on('click', '.js-save-contract', function (e) {
            e.preventDefault();
            var reqData = loopList($('.common-list.js-req>li'));
            var resData = loopList($('.common-list.js-res>li'));
            var id = $contractPage.attr('data-id');
            var srv_id = $contractPage.attr('data-srv-id');
            var NO = $contractPage.attr('data-no');
            var ajaxStr = id ? 'put' : 'post';

            UI.showLoading();
            Ajax[ajaxStr]('/restapi/contract/' + (id || ''), {
                srv_id: srv_id,
                NO: NO,
                req: reqData,
                res: resData
            }, function (data) {
                UI.hideLoading();
                if (!id) {
                    window.location.href = '/contract/?srv_id=' + srv_id;
                }
            }, function (error) {
                UI.hideLoading();
                error.msg && UI.showError(error.msg);
            })

        });
    }

    /*
    * Case Page
    */
    var caseAction = function () {
        var $casePage = $('.case-page');

        $casePage.on('click', '.js-add', function (e) {
            var $curSubTree = $(this).closest('.list-tree');
            var $appendTree = $curSubTree.clone();
            $appendTree.find('.js-input').val('');
            $curSubTree.after($appendTree);
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

                var key = $.trim($inputWrap.attr('data-key'));
                var remark = $.trim($inputWrap.attr('data-remark'));
                var metadata = $.trim($inputWrap.attr('data-metadata'));

                list.push({
                    key: key,
                    remark: remark,
                    metadata: metadata,
                    value: subListValue
                });
            });
            return list;
        };
        // TODO 验证input
        $casePage.on('click', '.js-save-case', function (e) {
            e.preventDefault();
            var reqData = loopList($('.common-list.js-req>li'));
            var resData = loopList($('.common-list.js-res>li'));
            var id = $casePage.attr('data-id');
            var srv_id = $casePage.attr('data-srv-id');
            var NO = $casePage.attr('data-no');
            var ajaxStr = id ? 'put' : 'post';

            // TODO 格式化成标准请求数据
            return;
            UI.showLoading();
            Ajax[ajaxStr]('/restapi/contract/' + (id || ''), {
                srv_id: srv_id,
                NO: NO,
                req: reqData,
                res: resData
            }, function (data) {
                UI.hideLoading();
                if (!id) {
                    window.location.href = '/contract/?srv_id=' + srv_id;
                }
            }, function (error) {
                UI.hideLoading();
                error.msg && UI.showError(error.msg);
            })

        });
    };

    $(document).on('ready', function () {
        serviceAction();
        contractAction();
        caseAction();
    });

})();
