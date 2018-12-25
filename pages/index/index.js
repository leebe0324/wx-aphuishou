//index.js
//获取应用实例
const loginApi = 'https://www.innothinking.cn/login/getCode2Session'
const getPageMsgApi = 'https://www.innothinking.cn/login/getPageMsg'
const createOrder = 'https://www.innothinking.cn/order/createOrder'
const app = getApp()
Page({
    data: {
        openid: '',
        imgUrls: '',
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 3000, //自动切换时间间隔
        duration: 1000, //滑动动画时长
        inputShowed: false,
        inputVal: "",
        addressClick: false,

        title: '请选择废品分类（可多选）',
        multiIndex: [0, 0, 0],
        index: 0,
        address: [],
        comm: '',
        // 分类数据
        navSelect: "", //记录点击多少个item
        classify: [],
        date: '',
        startdate: '',
        enddate: '',
        starttime: '',
        endtime: '',
        endstart: '',
        v1: '',
        v2: '',
        v3: '',
        phone: '',
        placeHolder:'',
        placeHolderForPhone:''

    },

    onShow: function() {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.login({
            success: res => {
                //获取用户授权       
                wx.getSetting({
                    success: result => {
                        if (result.authSetting['scope.userInfo']) {
                            console.log('首页授权了')
                            wx.getUserInfo({
                                success: r => {
                                    console.log('首页用户信息', r)
                                    //请求后台换取openid
                                    wx.request({
                                        url: loginApi,
                                        method: 'get',
                                        data: {
                                            'code': res.code,
                                            'nickname': r.userInfo['nickName'],
                                            'headimgurl': r.userInfo['avatarUrl']
                                        },
                                        header: {
                                            'content-type': 'application/json'
                                        },
                                        success: res => {
                                            console.log('首页返回用户信息', res)
                                            wx.removeStorageSync('openid')
                                            wx.setStorageSync('openid', res.data.openid)
                                            this.setData({
                                                openid: res.data.openid
                                            })
                                            console.log('首页存openid', this.data.openid)
                                            wx.hideLoading()
                                        },
                                        fail: erro => {
                                            wx.hideLoading()
                                            wx.showToast({
                                                title: '网络加载失败',
                                                image: 'assets/image/cry'
                                            })
                                        }
                                    })
                                }
                            })

                        } else {
                            //没有授权
                            wx.hideLoading()
                            console.log('首页没授权')
                        }
                    }
                })
            }
        })
        var _this = this
        wx.request({
            url: getPageMsgApi,
            method: 'get',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res => {
                if (res.data.msg == '请求页面数据成功') {
                    var imageArr = res.data.banner

                    var list = res.data.category //分类
                    var addressList = [] //小区地址
                    var v = [] //分类
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].status == 1) {
                            list[i].status = false
                        }
                        v.push(list[i])
                    }
                    for (var i = 0; i < res.data.community.length; i++) {
                        addressList.push(res.data.community[i].name)
                    }
                    _this.setData({
                        imgUrls: imageArr,
                        classify: v,
                        address: addressList
                    })
                    wx.hideLoading()
                }
            },
            fail: res => {
                wx.showToast({
                    title: '网络请求失败',
                    image: '../../assets/image/cry.png',
                    duration: 2000
                })
            }
        })
        //初始化回收时间
        function getZ(v) {
            //格式化日期
            v = parseInt(v);
            return v < 10 ? '0' + v : v
        }
        //获取当前日期
        let d = new Date();
        console.log('当前日期', d);
        let y = d.getFullYear();
        let _y = y;
        //月份+1，起始下表为0
        let m = d.getMonth() + 1;
        let _m = m + 1;
        if (_m > 12) {
            _m = 1;
            //超过12个月年份+1
            _y = _y + 1;
        }
        //格式化
        _m = getZ(_m);
        console.log('===', _m);
        _y = getZ(_y);
        //获取当前日，请查看utils文件utils.js
        let date = d.getDate();
        date = getZ(date);
        //获取当前星期几
        let day = d.getDay();
        //格式化星期几
        // day = this.valday(day);
        let hours = d.getHours();
        let min = d.getMinutes();
        min = getZ(min);
        //当前小时+1等于7:00-8:00时间段
        let endtime = hours + 1;
        let dateStr = y + '年' + m + '月' + date + '日';
        let startDate = y + '-' + m + '-' + date;
        let endDate = _y + '-' + _m + '-' + date;
        _this.setData({
            date: dateStr,
            startdate: startDate,
            enddate: endDate,
            starttime: hours + ':' + min,
            endtime: endtime + ':' + min,
            endstart: endtime + ':' + min,
            placeHolderForPhone: '请输入手机号',
            placeHolder: '1'
        })
    },
    //格式化星期(弃用)
    valday: function(day) {
        switch (day) {
            case 1:
                return '一';
                break;
            case 2:
                return '二';
                break;
            case 3:
                return '三';
                break;
            case 4:
                return '四';
                break;
            case 5:
                return '五';
                break;
            case 6:
                return '六';
                break;
            case 0:
                return '日';
                break;
        }
    },
    //点击年月日
    bindDateChange: function(e) {
        var _this = this
        function getZ(v) {
            v = parseInt(v);
            return v < 10 ? '0' + v : v
        }
        let v = e.detail.value;
        let nowDate = new Date();
        let nowYear = nowDate.getFullYear();
        let nowMonth = nowDate.getMonth();
        nowMonth = getZ(nowMonth);
        //获取当前日
        let ndate = nowDate.getDate();
        ndate = getZ(ndate);
        let nowStr = nowYear + '-' + nowMonth + '-' + ndate
        if (v === nowStr) {
            //如果选择的日期等于当前日期啥都不做
        } else {
            let splitA = e.detail.value.split('-');
            let week = new Date(e.detail.value);
            // let day = this.valday(week.getDay());
            this.setData({
                date: splitA[0] + '年' + splitA[1] + '月' + splitA[2] + '日 ',
                starttime: '07:00',
                endtime: '8:00',
                endstart: '8:00'
            })
        }
    },
    //开始时间
    bindstartTimeChange: function(e) {
        let a = e.detail.value
        let b = a.split(':')
        let endtime = (parseInt(b[0]) + 1) + ':' + b[1]
        this.setData({
            starttime: e.detail.value,
            endtime: endtime,
            endstart: endtime
        })
    },
    //结束时间
    bindendTimeChange: function(e) {
        this.setData({
            endtime: e.detail.value
        })
    },

    // banner点击跳转
    bindEnvironmental: function () {
        console.log('111');
        wx.navigateTo({
            url: '../Environmental/Environmental',
        })
    },

    write: function(e) {

        let a = e.target.dataset.id
        switch (a) {
            case '1':
                this.setData({
                    v1: e.detail.value
                })
                break;
            case '2':
                this.setData({
                    v2: e.detail.value
                })
                break;
            case '3':
                this.setData({
                    v3: e.detail.value
                })
                break;
            case '4':
                this.setData({
                    phone: e.detail.value
                })

                break;
        }

    },
    bindChoice: function(e) {
        //获取当前点击的索引下标
        let ind = e.target.dataset.id;
        //获取当前数组
        let v = this.data.classify;

        //获取当前数组点击的id取反
        v[ind].selected = !v[ind].selected;
        //当前点击id
        let curId = v[ind].id
        //判断当前是否选中
        if (v[ind].selected == true) {
            //获取当前点击+上一次点击的id
            let selectedArr = curId + ',' + this.data.navSelect
            //更新点击状态，存储点击id
            this.setData({
                classify: v,
                navSelect: selectedArr
            })
        } else {
            console.log("没有")
            //讲id字符串变成id数组
            let e = this.data.navSelect.split(',')
            //判断当前点击取消的id在不在e[]数组里面
            let ind = e.findIndex(v => v == curId)
            //删除当前取消点击的id
            e.splice(ind, 1)
            //更新数组
            this.setData({
                classify: v,
                navSelect: e.join(',')
            })
        }
    },

    bindAddress: function(e) {
        let add = this.data.address[e.detail.value]
        this.setData({
            index: e.detail.value,
            comm: this.data.address[e.detail.value]
        })
    },

    order: function() {
        //正则表达式
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        let v1 = this.data.v1
        let v2 = this.data.v2
        let v3 = this.data.v3
        let v4 = this.data.phone
        let v5 = this.data.date
        let v6 = this.data.starttime
        let v7 = this.data.endtime
        var flage = reg.test(v4)
        if (this.data.navSelect === '') {
            wx.showToast({
                title: '请选择分类',
                image: '../../assets/image/cry.png',
                duration: 2000,
                mask: true
            })
        } else if (v1 === '' || v2 === '' || v3 === '') {
            wx.showToast({
                title: '请填写地址信息',
                image: '../../assets/image/cry.png',
                duration: 2000,
                mask: true
            })
        } else if (!flage) {
            wx.showToast({
                title: '请填写正确手机号',
                image: '../../assets/image/cry.png',
                duration: 2000,
                mask: true
            })
            return
        } else {
            if (this.data.comm === '') {
                console.log('默认值', this.data.address[0])
                this.setData({
                    comm: this.data.address[0]
                })

            }
            wx.request({
                url: createOrder,
                method: 'post',
                data: {
                    openid: this.data.openid,
                    categoryIds: this.data.navSelect,
                    pickTime: v5 + v6 + '-' + v7,
                    address: v1 + '栋楼' + v2 + '层' + v3 + '号',
                    communityName: this.data.comm,
                    phoneNumber: v4
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: (res) => {
                    console.log('回收', res)

                    if (res.data.code == 1) {

                        wx.navigateTo({
                            url: '../orderSuccess/orderSuccess?orderNumber=' + res.data.orderNumber + '&openid=' + this.data.openid,
                        })

                    } else {
                        var openid=this.data.openid
                        console.log('有订单的时候openid', openid)
                        wx.showModal({
                            title: '提示',
                            content: res.data.msg,
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                    wx.navigateTo({
                                        url: '../myOrder/myOrder?openid='+openid,
                                    })
                                }
                            }
                        })
                     
                    }

                },fail:(erro)=>
                {
                    wx.showToast({
                        title: '预约失败',
                        image: '../../assets/image/cry.png',
                        duration: 2000,
                        mask: true
                    })

                }

            })

        }
    },
})