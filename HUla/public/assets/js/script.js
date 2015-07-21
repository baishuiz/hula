
(function () {
    /*
    * Utility
    */
    var Util = {
        convert: function (str) {
            str = str && str.toString && str.toString() || '';

            str = str.replace(/\\?&/g, '&amp;');
            str = str.replace(/\\?>/g, '&gt;');
            str = str.replace(/\\?</g, '&lt;');
            str = str.replace(/\\?"/g, '&quot;');
            str = str.replace(/\\?'/g, '&#039;');
            str = str.replace(/\\\\/g, '\\');

            return str;
        },
        // Internal recursive comparison function for `isEqual`.
        isEqual: function(a, b, postKey, aStack, bStack, errorStack) {
            errorStack = errorStack || [];
            // 如果case不写则默认通过
            if (a === null) {
                return {
                    status: true,
                    errorStack: errorStack
                };
            }

            // trim String
            if (typeof a === 'string' && typeof b === 'string') {
                a = a.trim();
                b = b.trim();
            }

            // Save bytes in the minified (but not gzipped) version:
            var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

            // Create quick reference variables for speed access to core prototypes.
            var
                push             = ArrayProto.push,
                slice            = ArrayProto.slice,
                toString         = ObjProto.toString,
                hasOwnProperty   = ObjProto.hasOwnProperty;
            // All **ECMAScript 5** native function implementations that we hope to use
            // are declared here.
            var
                nativeIsArray      = Array.isArray,
                nativeKeys         = Object.keys,
                nativeBind         = FuncProto.bind,
                nativeCreate       = Object.create;

            var isFunction = function(obj) {
                return typeof obj == 'function' || false;
            };
            // Is a given variable an object?
            isObject = function(obj) {
                var type = typeof obj;
                return type === 'function' || type === 'object' && !!obj;
            };
            var has = function(obj, key) {
                return obj != null && hasOwnProperty.call(obj, key);
            };

            // Retrieve the names of an object's own properties.
            // Delegates to **ECMAScript 5**'s native `Object.keys`
            getKeys = function(obj) {
              if (!isObject(obj)) return [];
              if (nativeKeys) return nativeKeys(obj);
              var keys = [];
              for (var key in obj) if (has(obj, key)) keys.push(key);
              return keys;
            };

            // Identical objects are equal. `0 === -0`, but they aren't identical.
            // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
            if (a === b) {
                var status = a !== 0 || 1 / a === 1 / b;
                if (!status) {
                    errorStack.push({
                        key: postKey,
                        aStack: aStack,
                        bStack: bStack
                    });
                }
                if (typeof postKey !== 'undefined') {
                    return {
                        status: status,
                        errorStack: errorStack
                    };
                }
            }
            // A strict comparison is necessary because `null == undefined`.
            if (a == null || b == null) {
                var status = a === b;
                if (!status) {
                    errorStack.push({
                        key: postKey,
                        aStack: aStack,
                        bStack: bStack
                    });
                }
                if (typeof postKey !== 'undefined') {
                    return {
                        status: status,
                        errorStack: errorStack
                    };
                }
            }
            // Unwrap any wrapped objects.
            // if (a instanceof _) a = a._wrapped;
            // if (b instanceof _) b = b._wrapped;
            // Compare `[[Class]]` names.
            var className = toString.call(a);
            if (className !== toString.call(b)) {
                errorStack.push({
                    key: postKey,
                    aStack: aStack,
                    bStack: bStack
                });
                if (typeof postKey !== 'undefined') {
                    return {
                        status: false,
                        errorStack: errorStack
                    };
                }
            }
            switch (className) {
                // Strings, numbers, regular expressions, dates, and booleans are compared by value.
                case '[object RegExp]':
                // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
                case '[object String]':
                    // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                    // equivalent to `new String("5")`.
                    var status = '' + a === '' + b;
                    if (!status) {
                        errorStack.push({
                            key: postKey,
                            aStack: aStack,
                            bStack: bStack
                        });
                    }
                    if (typeof postKey !== 'undefined') {
                        return {
                            status: status,
                            errorStack: errorStack
                        };
                    }
                case '[object Number]':
                    // `NaN`s are equivalent, but non-reflexive.
                    // Object(NaN) is equivalent to NaN
                    if (+a !== +a) {
                        var status = +b !== +b;
                        if (!status) {
                            errorStack.push({
                                key: postKey,
                                aStack: aStack,
                                bStack: bStack
                            });
                        }
                        if (typeof postKey !== 'undefined') {
                            return {
                                status: status,
                                errorStack: errorStack
                            };
                        }
                    }

                    // An `egal` comparison is performed for other numeric values.
                    var status = +a === 0 ? 1 / +a === 1 / b : +a === +b;
                    if (!status) {
                        errorStack.push({
                            key: postKey,
                            aStack: aStack,
                            bStack: bStack
                        });
                    }
                    if (typeof postKey !== 'undefined') {
                        return {
                            status: status,
                            errorStack: errorStack
                        };
                    }
                case '[object Date]':
                case '[object Boolean]':
                    // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                    // millisecond representations. Note that invalid dates with millisecond representations
                    // of `NaN` are not equivalent.
                    var status = +a === +b;
                    if (!status) {
                        errorStack.push({
                            key: postKey,
                            aStack: aStack,
                            bStack: bStack
                        });
                    }
                    if (typeof postKey !== 'undefined') {
                        return {
                            status: status,
                            errorStack: errorStack
                        };
                    }
            }

            var areArrays = className === '[object Array]';
            if (!areArrays) {
                if (typeof a != 'object' || typeof b != 'object') {
                    errorStack.push({
                        key: postKey,
                        aStack: aStack,
                        bStack: bStack
                    });
                    if (typeof postKey !== 'undefined') {
                        return {
                            status: false,
                            errorStack: errorStack
                        };
                    }
                }

                // Objects with different constructors are not equivalent, but `Object`s or `Array`s
                // from different frames are.
                var aCtor = a.constructor, bCtor = b.constructor;
                if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                                                                 isFunction(bCtor) && bCtor instanceof bCtor)
                                                        && ('constructor' in a && 'constructor' in b)) {
                    errorStack.push({
                        key: postKey,
                        aStack: aStack,
                        bStack: bStack
                    });
                    if (typeof postKey !== 'undefined') {
                        return {
                            status: false,
                            errorStack: errorStack
                        };
                    }
                }
            }
            // Assume equality for cyclic structures. The algorithm for detecting cyclic
            // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

            // Initializing stack of traversed objects.
            // It's done here since we only need them for objects and arrays comparison.
            aStack = aStack || [];
            bStack = bStack || [];
            var length = aStack.length;
            while (length--) {
                // Linear search. Performance is inversely proportional to the number of
                // unique nested structures.
                if (aStack[length] === a) {
                    var status = bStack[length] === b;
                    !status && errorStack.push({
                        key: postKey,
                        aStack: aStack,
                        bStack: bStack
                    });
                    if (typeof postKey !== 'undefined') {
                        return {
                            status: status,
                            errorStack: errorStack
                        };
                    }
                }
            }

            // Add the first object to the stack of traversed objects.
            aStack.push(a);
            bStack.push(b);

            // Recursively compare objects and arrays.
            if (areArrays) {
                // Compare array lengths to determine if a deep comparison is necessary.
                length = a.length;
                if (length !== b.length) {
                    errorStack.push({
                        key: postKey,
                        aStack: aStack,
                        bStack: bStack
                    });
                    if (typeof postKey !== 'undefined') {
                        return {
                            status: false,
                            errorStack: errorStack
                        };
                    }
                }
                // Deep compare the contents, ignoring non-numeric properties.
                while (length--) {
                    var isEqual = Util.isEqual(a[key], b[key], postKey, aStack, bStack, errorStack);
                    if (!isEqual.status) {
                        errorStack = isEqual.errorStack;
                        errorStack.push({
                            key: postKey,
                            aStack: aStack,
                            bStack: bStack
                        });
                        // return false;
                    }
                }
            } else {
                // Deep compare objects.
                var keys = getKeys(a), key;
                length = keys.length;
                // Ensure that both objects contain the same number of properties before comparing deep equality.
                // 因为存在null情况，此处不做长度校验
                // if (getKeys(b).length !== length) return false;
                while (length--) {
                    // Deep compare each member
                    key = keys[length];
                    var isEqual = Util.isEqual(a[key], b[key], key, aStack, bStack, errorStack);
                    if (!(has(b, key) && isEqual.status)) {
                        errorStack = isEqual.errorStack;
                        errorStack.push({
                            key: key,
                            aStack: aStack,
                            bStack: bStack
                        });
                        // return false;
                    }
                }
            }
            // Remove the first object from the stack of traversed objects.
            aStack.pop();
            bStack.pop();
            return {
                status: true,
                errorStack: errorStack
            };
        }
    };

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
        $.ajaxSetup({
            timeout: 30000
        });

        var successHandler = function (data) {
            data = data || {};
            return data;
        };

        var errorHandler = function (error) {
            error = error || {};

            return {
                ack: 1,
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
                window.location.href = '/contract/?srv_id=' + srv_id;
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
            var $curSubTree = $(this).closest('.input-wrap').next('.list-tree').first();
            var $appendTree = $curSubTree.clone();
            $appendTree.find('.js-delete').show();
            $appendTree.find('.js-input').val('');
            $curSubTree.after($appendTree);
        });

        $casePage.on('click', '.js-delete', function (e) {
            var $curSubTree = $(this).closest('.list-tree');
            $curSubTree.remove();
        });

        var loopList = function ($els) {
            var list = [];
            $els.each(function(){
                var $el = $(this);
                var $inputWrap = $el.find('.input-wrap');
                var subListValue = null;

                var key = $.trim($inputWrap.attr('data-key'));
                var remark = $.trim($inputWrap.attr('data-remark'));
                var metadata = $.trim($inputWrap.attr('data-metadata'));
                var val = null;

                // Metadata: Number, String, Object, List, Array, Boolean
                switch (metadata) {
                    case 'String':
                        val = $.trim($inputWrap.find('.js-input').val()) || null;
                        break;
                    case 'Number':
                        var tmpNum = parseInt($.trim($inputWrap.find('.js-input').val()), 10);

                        val = (typeof tmpNum === 'number' && !Number.isNaN(tmpNum)) ? tmpNum : null;
                        break;
                    case 'Boolean':
                        var boolStr = $.trim($inputWrap.find('.js-boolean').val());
                        if (boolStr) {
                            val = parseInt(boolStr, 10) === 1;
                        } else {
                            val = null;
                        }
                        break;
                    case 'Array':
                        val = $.trim($inputWrap.find('.js-input').val()).split(',') || null;
                        break;
                    case 'Object':
                        var $subList = $el.find('>ul>li');
                        if ($subList.length) {
                            subListValue = loopList($subList);
                            subListValue = subListValue.length ? subListValue : null;
                        }
                        break;
                    case 'List':
                        var $subLists = $el.find('>.list-tree');
                        if ($subLists.length) {
                            subListValue = [];
                            $subLists.each(function () {
                                var tmpAry = loopList($(this).find('>li'));
                                if (tmpAry.length) {
                                    subListValue.push(tmpAry);
                                }
                            });
                            subListValue = subListValue.length ? subListValue : null;
                        }
                        break;
                    default:
                        break;
                }

                if (val !== null || subListValue !== null) {
                    list.push({
                        key: key,
                        remark: remark,
                        metadata: metadata,
                        value: subListValue,
                        val: val
                    });
                }
            });
            return list;
        };
        // TODO 验证input
        $casePage.on('click', '.js-save-case', function (e) {
            e.preventDefault();
            var reqData = loopList($('.common-list.js-req>li'));
            var resData = loopList($('.common-list.js-res>li'));
            var name = $.trim($casePage.find('.js-name').val());
            var id = $casePage.attr('data-id');
            var srv_id = $casePage.attr('data-srv-id');
            var con_id = $casePage.attr('data-con-id');
            var NO = $casePage.attr('data-no');
            var ajaxStr = id ? 'put' : 'post';

            UI.showLoading();
            Ajax[ajaxStr]('/restapi/case/' + (id || ''), {
                con_id: con_id,
                name: name,
                req: reqData,
                res: resData
            }, function (data) {
                UI.hideLoading();
                window.location.href = $('.js-back-btn').attr('href');
            }, function (error) {
                UI.hideLoading();
                error.msg && UI.showError(error.msg);
            })
        });

        // case editor
        $casePage.find('li>.list-tree').each(function() {
            var $target = $(this);
            var index = $target.index($target.parent().children('.list-tree'));
            if (index === 0) {
                $target.find('.js-delete').hide();
            }
        });

        //copy form template by melvin.ren
        var loop = function (ary, parentIsList, parentNode) {
            if (!ary || !ary.length) {
                ary = [{}]
            }
            var str = [];
            parentNode = parentNode || {};
            for (var i = 0, len = ary.length, v, isFirst, isList, subNode; i < len; i++) {
                v = ary[i];
                isFirst = i === 0;
                isList = v.metadata === 'List';
                subNode = parentNode[v.key];
                str.push('<li>');
                        str.push('<div class="line"></div>');
                        str.push('<div class="input-wrap" data-metadata="' + (v.metadata || '') + '" data-key="' + (v.key || '') + '" data-remark="' + (v.remark || '') + '">');
                            str.push('<strong class="text">' + (v.key || '') + '</strong>');
                            str.push('<span class="text">' + (v.remark || '') + '</span>');
                            if (v.metadata === 'String'){
                                str.push('<input type="text" class="js-input form-control" placeholder="String" value="' + Util.convert(subNode || '') + '">');
                            } else if (v.metadata === 'Number') {
                                str.push('<input type="number" class="js-input form-control" placeholder="Number" min="0" value="' + ((typeof subNode === 'number' && !Number.isNaN(subNode)) ? subNode : null) + '">');
                            } else if (v.metadata === 'Boolean') {
                                str.push('<select class="js-boolean">');
                                    str.push('<option></option>');
                                    str.push('<option value="1" ' + ((subNode === true) ? 'selected' : '') + '>True</option>');
                                    str.push('<option value="0" ' + ((subNode === false) ? 'selected' : '') + '>False</option>');
                                str.push('</select>');
                            } else if (v.metadata === 'Array') {
                                str.push('<input type="text" class="js-input form-control" placeholder="Array" value="' + (subNode || []).join(',') + '">');
                            }
                            if (isList) {
                               str.push('<button class="js-add btn btn-xs btn-success">add</button>');
                            }
                            if (parentIsList && i === 0) {
                               str.push('<button class="js-delete btn-delete btn btn-xs btn-danger">delete</button>');
                            }
                        str.push('</div>');
                        if (v.metadata === 'Object' || isList) {
                            if (Array.isArray(subNode)) {
                                subNode.forEach(function(tmpNode){
                                    str.push('<ul class="' + (isList ? "list-tree" : "") + '">');
                                        str.push(loop(v.value, isList, tmpNode));
                                    str.push('</ul>');
                                });
                            } else {
                                str.push('<ul class="' + (isList ? "list-tree" : "") + '">');
                                    str.push(loop(v.value, isList, subNode));
                                str.push('</ul>');
                            }
                        }
                str.push('</li>')
            }
            return str.join('');
        }

        $casePage.on('blur', '#js_caseReqString', function(e){
          var target = $(e.currentTarget),
              val = target.val(),
              con_req = JSON.parse($casePage.find('#js_con_req').val()),
              requestBox = $casePage.find('.js-req');
          if(!$.trim(val)){
            return;
          }
          var requestObj ;
          try{
            requestObj = JSON.parse(val);
          }catch(e){
            UI.showError('输入request格式不正确！')
            console.log(e);
            return;
          }
          var reqhtml = loop(con_req, false, requestObj);
          requestBox.html(reqhtml);
        });

        $casePage.on('blur', '#js_caseResString', function(e){
          var target = $(e.currentTarget),
              val = target.val(),
              con_res = JSON.parse($casePage.find('#js_con_res').val()),
              responseBox = $casePage.find('.js-res');
          if(!$.trim(val)){
            return;
          }
          var responseObj ;
          try{
            responseObj = JSON.parse(val);
          }catch(e){
            UI.showError('输入response格式不正确！')
            console.log(e);
            return;
          }
          var reshtml = loop(con_res, false, responseObj);
          responseBox.html(reshtml);
        });

        // select all
        $casePage.on('click', '.js-select-all', function (e) {
            e.preventDefault();
            $casePage.find('.js-check').prop('checked', true);
        });

        $caseRunForm = $('#case-run-form');

        // run case
        $casePage.on('click', '.js-run', function (e) {
            e.preventDefault();
            var $root = $(this).closest('tr');
            var id = $root.attr('data-id');
            var $input = $caseRunForm.find('input[name="ids"]');

            if (id) {
                $input.val(id);
                $caseRunForm.submit();
            } else {
                $input.val('');
                return false;
            }
        });

        // run all case
        $casePage.on('click', '.js-run-all', function (e) {
            e.preventDefault();
            var $selectedCB = $casePage.find('.cases-table .js-check:checked');
            var ids = [];
            $selectedCB.each(function () {
                var id = $(this).closest('tr').attr('data-id');
                id && ids.push(id);
            });

            var $input = $caseRunForm.find('input[name="ids"]');
            if (ids.length) {
                $input.val(ids.join(','));
                $caseRunForm.submit();
            } else {
                $input.val('');
                return false;
            }
        });

        // Run Case
        (function () {
            var $caseResultPage = $('#case-result');
            if ($caseResultPage.length) {
                var $cases = $caseResultPage.find('.js-cases>tr');
                $cases.find('.js-status, .js-detail').text('');

                $caseResultPage.on('click', '.js-re-run', function (e) {
                    e.preventDefault();
                    $cases.removeAttr('class');
                    $cases.find('.js-status, .js-detail').text('');
                    sentReq();
                });

                var cases = JSON.parse($caseResultPage.find('.js-cases').val() || '[]');
                var contract = JSON.parse($caseResultPage.find('.js-contract').val() || '{}');
                var service = JSON.parse($caseResultPage.find('.js-service').val() || '{}');
                var host = JSON.parse($caseResultPage.find('.js-host').val() || 'null');
                var subEnv = JSON.parse($caseResultPage.find('.js-sub-env').val() || 'null');
                var needSubEvn = JSON.parse($caseResultPage.find('.js-need-sub-env').val() || 'false');
                var auth = JSON.parse($caseResultPage.find('.js-auth').val() || 'null');
                var url = 'http://' + host + '/restapi/soa2/' + service.url + ( needSubEvn ? ('?subEnv=' + (subEnv || 'fat80')) : '');

                var sentReq = function (i) {
                    i = i || 0;
                    var caseObj = cases[i];
                    var $caseElm = $cases.eq(i);
                    var $statusElm = $caseElm.find('.js-status');
                    var $detailElm = $caseElm.find('.js-detail');

                    $caseElm.addClass('warning');
                    $statusElm.text('发送中...');

                    if (caseObj) {
                        var req = caseObj.req;
                        var alliance = req && req.alliance;
                        if (!alliance || !alliance.sid || !alliance.ouid || !alliance.aid) {
                            delete req.alliance;
                        }

                        $.extend(req, {
                            contentType: 'json',
                            head: {
                                auth: auth || null,
                                cid: '',
                                ctok: '',
                                cver: '1.0',
                                lang: '01',
                                sid: '8888',
                                syscode: '09'
                            }
                        });

                        Ajax.post(url, req, function (data) {
                            data = data || {};
                            delete data.head;
                            delete data.ResponseStatus;

                            var isEqual = Util.isEqual(caseObj.res, data);
                            var errorStrAry = _.uniq(_.compact(_.pluck(isEqual.errorStack, 'key')));

                            if (!errorStrAry || !errorStrAry.length) {
                                $caseElm.removeClass('warning').addClass('success');
                                $statusElm.text('成功');
                                $detailElm.text('');
                            } else {
                                $caseElm.addClass('danger');
                                $statusElm.text('失败');
                                $detailElm.text(errorStrAry.join(', '));
                            }
                            sentReq(i + 1);
                        }, function (error) {
                            $caseElm.removeClass('warning').addClass('danger');
                            $statusElm.text('失败');
                            $detailElm.text(JSON.stringify(error));
                            sentReq(i + 1);
                        });
                    }
                };

                sentReq();
            }
        })();
    };

    /*
    * upload page
    */
    var uploadAction = function(){
      var $uploadPage = $('.upload-page');
      var uploadframe = $uploadPage.find("#uploadTrg");
      var uploadform = $uploadPage.find("#uploadForm");
      var submitbtn = $uploadPage.find('#submit');

      submitbtn.on('click', function(){
        UI.showLoading();
        uploadForm.submit();
      });
      uploadframe.on('load', function(){
        var html = uploadframe && uploadframe[0] && uploadframe[0].contentDocument.body.innerHTML;
        $uploadPage.html(html);
        UI.hideLoading();
      });
    };

    $(document).on('ready', function () {
        serviceAction();
        contractAction();
        caseAction();
        uploadAction();
    });

})();
