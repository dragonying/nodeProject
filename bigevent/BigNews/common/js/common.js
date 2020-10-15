(function (window) {
    // 获取接口api
    function getApi() {
        console.log('获取api')
        let keyword = 'bigEventApi';
        let api = JSON.parse(sessionStorage.getItem(keyword)) || null;
        if (!api) {
            $.getJSON('/common/data/api.json', function (data) {
                api = data
                console.log(api)
                sessionStorage.setItem(keyword, JSON.stringify(api));
            })
        }
        return api;
    }

    //token处理
    function token(v, del = false) {
        v = v || '';
        let k = 'token';
        return del ? localStorage.removeItem(k) : (v.length < 1 ? localStorage.getItem(k) : localStorage.setItem(k, v));
    }


    // 前台请求
    function frontRequest(targetType, data = {}, successFuc = null) {
        return request(targetType, data, successFuc);
    }

    // 后台请求
    function backendRequest(targetType, data = {}, successFuc = null) {
        //用户token
        let userToken = token();
        //全局ajax配置
        $.ajaxSetup({
            beforeSend: function (xhr) {
                //设置token
                xhr.setRequestHeader('Authorization', userToken);
            },
            error: function (xhr, status, error) {
                console.log(error)
            },
            complete: function (xhr, status) {
                if (userToken.length < 1) {
                    window.location.href = '/admin/login.html';
                }
            }
        });
        return request(targetType, data, successFuc);
    }


    //请求
    function request(targetType, data = {}, successFuc = null) {
        let domain = 'http://localhost:8012/api/v1'
        let api = getApi();
        console.log(api)

        //第二个参数和第三个参数可以调换位置
        if (Object.prototype.toString.call(data) == '[object Function]' && ['[object String]', '[object Object]', '[object Null]'].indexOf(Object.prototype.toString.call(successFuc)) >= 0) {
            let tmp = data;
            data = successFuc
            successFuc = tmp
        }

        //配置请求属性
        let target = api[targetType]
        option = {
            url: domain + target.route,
            type: target.method,
            data: data,
            success: function (res) {
                typeof successFuc == 'function' ? successFuc(res) : console.log(res);
            }
        }

        //文件上传
        if (data && data.__proto__.constructor === FormData) {
            option.contentType = false;
            option.processData = false;
        }

        $.ajax(option);
    }

    //验证参数
    function validHasValEmpty(option) {
        let opType = Object.prototype.toString.call(option);
        let acceptType = ['[object Array]', '[object String]']
        if (acceptType.indexOf(opType) >= 0) {
            option = Array.isArray(option) ? option : option.split(' ')
            for (let i = 0; i < option.length; i++) {
                if (option[i].trim().length < 1) {
                    return true;
                }
            }
        }
        return false;
    }

    window.validHasValEmpty = validHasValEmpty;
    window.backendRequest = backendRequest;
    window.frontRequest = frontRequest;
    window.token = token;
})(window);
