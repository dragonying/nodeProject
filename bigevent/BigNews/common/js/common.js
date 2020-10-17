(function (window) {
    // 获取接口api
    // function getApi() {
    //     console.log('获取api')
    //     let keyword = 'bigEventApi';
    //     let api = JSON.parse(sessionStorage.getItem(keyword)) || null;
    //     if (!api) {
    //         $.getJSON('/common/data/api.json', function (data) {
    //             api = data
    //             console.log(api)
    //             sessionStorage.setItem(keyword, JSON.stringify(api));
    //         })
    //     }
    //     return api;
    // }
    let api = {
        adminUserLogin: { route: '/admin/user/login', method: 'post', title: '用户登录' },
        adminUserInfo: { route: '/admin/user/info', method: 'get', title: '获取用户信息' },
        adminUserDetail: { route: '/admin/user/detail', method: 'get', title: '获取用户详情' },
        adminUserEdit: { route: '/admin/user/edit', method: 'post', title: '编辑用户信息' },
        adminCategoryList: { route: '/admin/category/list', method: 'get', title: '所有文章类别' },
        adminCategoryAdd: { route: '/admin/category/add', method: 'post', title: '新增文章类别' },
        adminCategorySearch: { route: '/admin/category/search', method: 'get', title: '根据id查询指定文章类别' },
        adminCategoryEdit: { route: '/admin/category/edit', method: 'post', title: '编辑文章类别' },
        adminCategoryDelete: { route: '/admin/category/delete', method: 'post', title: '删除文章类别' },
        adminArticleQuery: { route: '/admin/article/query', method: 'get', title: '文章搜索' },
        adminArticlePublish: { route: '/admin/article/publish', method: 'post', title: '发布文章' },
        adminArticleSearch: { route: '/admin/article/search', method: 'get', title: '根据id获取文章信息' },
        adminArticleEdit: { route: '/admin/article/edit', method: 'post', title: '文章编辑' },
        adminArticleDelete: { route: '/admin/article/delete', method: 'post', title: '删除文章' },
        adminDataInfo: { route: '/admin/data/info', method: 'get', title: '获取统计数据' },
        adminDataArticle: { route: '/admin/data/article', method: 'get', title: '日新增文章数量统计' },
        adminDataCategory: { route: '/admin/data/category', method: 'get', title: '各类型文章数量统计' },
        adminDataVisit: { route: '/admin/data/visit', method: 'get', title: '日文章访问量' },
        adminCommentSearch: { route: '/admin/comment/search', method: 'get', title: '文章评论搜索' },
        adminCommentPass: { route: '/admin/comment/pass', method: 'post', title: '评论审核通过' },
        adminCommentReject: { route: '/admin/comment/reject', method: 'post', title: '评论审核不通过' },
        adminCommentDelete: { route: '/admin/comment/delete', method: 'post', title: '删除评论' },
        indexHotpic: { route: '/index/hotpic', method: 'get', title: '首页焦点图' },
        indexCategory: { route: '/index/category', method: 'get', title: '文章类型' },
        indexLatest: { route: '/index/latest', method: 'get', title: '最新资讯' },
        indexRank: { route: '/index/rank', method: 'get', title: '热门排行' },
        indexLatest_comment: { route: '/index/latest_comment', method: 'get', title: '最新评论' },
        indexAttention: { route: '/index/attention', method: 'get', title: '焦点关注' },
        indexArticle: { route: '/index/article', method: 'get', title: '文章详细内容' },
        indexGet_comment: { route: '/index/get_comment', method: 'get', title: '评论列表' },
        indexPost_comment: { route: '/index/post_comment', method: 'post', title: '发表评论' },
        indexSearch: { route: '/index/search', method: 'get', title: '文章搜索' },
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

    //错误提示
    function msgError(msg) {
        if (!$('#error-modal').length) {
            let modal = `<div class="modal fade" tabindex="-1" role="dialog" id='error-modal'>
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">提示</h4>
            </div>
            <div class="modal-body">
                <p class='error-msg'>something error ....</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">确定</button>
            </div>
        </div>
    </div>
</div>`;
            $(modal).appendTo('body');
        }

        $('#error-modal').find('.error-msg').text(msg).end().modal('show')
    }

    // 后台请求
    function backendRequest(targetType, data = {}, successFuc = null, async = true) {
        //用户token
        let userToken = token() || '';
        //全局ajax配置
        $.ajaxSetup({
            async: async,
            beforeSend: function (xhr) {
                //设置token
                xhr.setRequestHeader('Authorization', userToken);
            },
            error: function (xhr, status, error) {
                if (xhr.responseJSON.status == 403) {
                    window.location.href = '/admin/login.html';
                } else {
                    msgError(xhr.responseJSON.msg);
                }
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
        // let api = getApi();
        // console.log(api)

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
                if (res.code != 200) {
                    console.log(res)
                }
                if (res.code == 403 || res.status == 403) {
                    window.location.href = '/admin/login.html';
                    return;
                }
                typeof successFuc == 'function' ? (res.code == 200 ? successFuc(res) : msgError(res.msg)) : console.log(res);
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


//处理高亮
!(function () {
    let route = window.location.href.match(/^https*:\/\/.*?((\/\w+)+\.html)/)[1].split('/').pop();
    let active = window.parent.document.querySelector('a[href="' + route + '"]');
    if ($(active).parents('.level02').length > 0) {
        $(active).parent().addClass('active').siblings().removeClass('active');
    } else if ($(active).parents('.level01').length > 0) {
        $(active).parents('.level01').eq(0).addClass('active').siblings('.level01').removeClass('active');
    }
})();