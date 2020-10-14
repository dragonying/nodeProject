        //缓存处理
        function Storage(keyWord, primaryKey = '_id') {
            this.keyWord = keyWord || 'classPeriod';
            this.primaryKey = primaryKey;
            this.error = [];//计入错误信息
            this.rules = [
                { key: this.primaryKey, require: true, unique: true },
                { key: 'name', require: true, unique: true, maxLength: 20, minLength: 2 },
                { key: 'age', require: false, default: null },
                { key: 'hobby', require: false, default: null },
                { key: 'sex', require: false, default: null }
            ]; //数据规则


            //记录错误信息
            this.errorLog = function (title) {
                title.length > 0 && this.error.push(title);
                return this.error;
            }

            this._getUniqueKey = function () {
                let uniqueKey = [];//唯一key
                for (let i = 0; i < this.rules.length; i++) {
                    let rule = this.rules[i];
                    !this._IsUndefined(rule.unique) && uniqueKey.push(rule.key);
                }
                return uniqueKey;
            }

            //数据验证
            this._check = function (obj) {
                let data = this.getAll();
                let isOk = true;

                //验证必填项
                for (let i = 0; i < this.rules.length; i++) {
                    let rule = this.rules[i];
                    let k = rule.key;
                    if (rule.require && (this._IsUndefined(obj[k]) || obj[k].length == 0)) {
                        isOk = false;
                        this.errorLog('缺少必要参数' + k);
                        break;
                    }
                    if ((!this._IsUndefined(rule.maxLength) && obj[k].length > rule.maxLength) || (!this._IsUndefined(rule.minLength) && obj[k].length < rule.minLength) ) {
                        isOk = false;
                        this.errorLog(k+'的字符串长度有误');
                        break;
                    }

                }


                //验证唯一
                if (isOk) {
                    let uniqueKey = this._getUniqueKey();
                    for (let i = 0; i < data.length; i++) {
                        if (!isOk) {
                            break;
                        }
                        let item = data[i];
                        for (let j = 0; j < uniqueKey.length; j++) {
                            let key = uniqueKey[j];
                            if (obj[key] == item[key]) {
                                isOk = false;
                                this.errorLog(key + '是唯一值,用户：' + obj[key] + ' 已经存在');
                                break;
                            }
                        }
                    }
                }


                return isOk;
            }

            //设置默认值
            this._setDefaultValue = function (obj) {
                for (let j = 0; j < this.rules.length; j++) {
                    let rule = this.rules[j];
                    //获取默认值
                    if (!this._IsUndefined(rule.default)) {
                        obj[rule.key] = rule.default;//因为对象是复杂数据类型，属于引用类型，所以可以被赋值
                    }
                }

                return obj;

            }
            //获取所有
            this.getAll = function () {
                return JSON.parse(localStorage.getItem(this.keyWord)) || [];
            }

            //查询
            this._find = function (par, all = true) {
                let data = this.getAll();
                let res = [];
                for (let i = 0; i < data.length; i++) {
                    let isOk = true;
                    //验证值是否所有匹配
                    for (let k in par) {
                        if (data[i][k] != par[k]) {
                            isOk = false;
                        }
                    }
                    if (isOk) {
                        res.push(data[i]);
                        if (!all) {
                            break;
                        }
                    }
                }
                return res;
            }

            //是否对象
            this._IsObject = function (v) {
                return Object.prototype.toString.call(v) == '[object Object]';
            }

            //判断是否为undefined
            this._IsUndefined = function (v) {
                return Object.prototype.toString.call(v) == '[object Undefined]';

            }
            //获取参数
            this._getParm = function (k, v) {
                let par;
                if (this._IsObject(k)) {
                    par = k;
                } else {
                    par = new Object();
                    par[k] = v;
                }
                return par;
            }
            //查询一个
            this.findOne = function (k, v) {
                return this._find(this._getParm(k, v), false)[0];
            }

            //查询多个
            this.findAll = function (k, v) {
                return this._find(this._getParm(k, v));
            }

            //设置
            this._set = function (data) {
                localStorage.setItem(this.keyWord, JSON.stringify(data));
                return true;
            }

            //获取id
            this.getId = function () {
                let data = this.getAll();
                return data.length < 1 ? 1 : (isNaN(parseInt(data[data.length - 1][this.primaryKey])) ? 1 : parseInt(data[data.length - 1][this.primaryKey]) + 1);
            }

            //根据名字增加
            this.addByName = function (name) {
                return this.add({ name: name });
            }

            //增加
            this.add = function (obj) {
                if (typeof (obj) != 'object') {
                    return false;
                }

                let data = this.getAll();
                //添加唯一标识
                obj[this.primaryKey] = this.getId();

                if (!this._check(obj)) {
                    console.log(this.error);
                    return false;
                }

                this._setDefaultValue(obj);

                data.push(obj);

                return this._set(data) ? obj : false;
            }

            //根据id删除
            this.delById = function (id) {
                let where = new Object();
                where[this.primaryKey] = id;
                return this._delete(where, false);
            }

            //根据名称删除
            this.delByName = function (name) {
                return this.del('name', name);
            }

            //delete
            this.del = function (k, v) {
                return this._delete(this._getParm(k, v));
            }

            //条件删除
            this._delete = function (par, all = true) {
                let data = this.getAll();
                let res = false;
                for (let i = 0; i < data.length; i++) {
                    let isOk = true;
                    //验证值是否所有匹配
                    for (let k in par) {
                        if (data[i][k] != par[k]) {
                            isOk = false;
                        }
                    }
                    if (isOk) {
                        data.splice(i, 1);
                        res = true;
                        if (!all) {
                            break;
                        }
                    }

                }
                //删除成功则重置数据
                return res && this._set(data);
            }

        }
