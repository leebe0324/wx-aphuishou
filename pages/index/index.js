//index.js
//获取应用实例
const loginApi = 'https://www.innothinking.cn/login/getCode2Session'
const getPageMsgApi = 'https://www.innothinking.cn/login/getPageMsg'
const createOrder = 'https://www.innothinking.cn/order/createOrder'
const getAllCoupons = 'https://www.innothinking.cn/coupon/getAll'
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
    items: [{
        name: '0',
        value: '9:00-11:00',
        checked: 'true'
      },
      {
        name: '1',
        value: '15:00-18:00'
      }
    ],
    loginItems: [],
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
    endstart: '',
    v1: '',
    v2: '',
    v3: '',
    phone: '',
    placeHolder: '',
    placeHolderForPhone: '',
    userAddress: '', //用户地址
    onloadDate: '' //系统初始化时间
  },
  onLoad: function() {
    //判断地址缓存
    try {
      const value = wx.getStorageSync('addr')
      if (value) {
        this.setData({
          v1: value
        })
      } else {
        this.setData({
          v1: ''
        })
      }
    } catch (e) {
      wx.showToast({
        title: '缓存获取失败',
        image: 'assets/image/cry'
      })
    }
    //判断手机号缓存
    try {
      const value = wx.getStorageSync('phone')
      if (value) {
        this.setData({
          phone: value
        })
      } else {
        this.setData({
          phone: placeHolderForPhone
        })
      }
    } catch (e) {
      wx.showToast({
        title: '缓存获取失败',
        image: 'assets/image/cry'
      })
    }
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
              wx.getUserInfo({
                success: r => {
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
                      wx.removeStorageSync('openid')
                      wx.setStorageSync('openid', res.data.openid)
                      this.setData({
                        openid: res.data.openid
                      })

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
        console.log('首页数据', res)
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
        wx.hideLoading()
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
    let y = d.getFullYear();
    let _y = y;
    //月份+1，起始下表为0
    let mmm = d.getMonth() + 1;
    let mm = mmm.toString()
    let m = 0 + mm
    let _m = m + 1;
    if (_m > 12) {
      _m = 1;
      //超过12个月年份+1
      _y = _y + 1;
    }
    //格式化
    _m = getZ(_m);
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

    var nowHours = d.getHours()
    //时间为上午全可选 默认选择9-11点
    if (nowHours > 0 && nowHours < 11) {
      var item = [{
          name: '0',
          value: '9:00-11:00',
          checked: 'true'
        },
        {
          name: '1',
          value: '15:00-18:00',
        }]

      var pickTime = item[0].value
      this.setData({
        items: item,
        starttime: pickTime
      })
      //如果是下午，只可选择下午
    } else if (10 < nowHours && nowHours < 18) {
      var item = [{
          name: '0',
          value: '9:00-11:00',
          disabled: 'true'
        },
        {
          name: '1',
          value: '15:00-18:00',
          checked: 'true'
        }]

      var pickTime = item[1].value
      this.setData({
        items: item,
        starttime: pickTime,
        loginItems: item
      })
      //如果是晚上，全部不可选
    } else {
      var item = [{
        name: '0',
        value: '9:00-11:00',
        disabled: 'true'
      },
      {
        name: '1',
        value: '15:00-18:00',
        disabled: 'true'
      }]
      this.setData({
        items: item,
        loginItems: item,
        starttime: ''
      })
    } 
    _this.setData({
      date: dateStr,
      onloadDate: dateStr,
      startdate: startDate,
      enddate: endDate,
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
        date: splitA[0] + '年' + splitA[1] + '月' + splitA[2] + '日',
        starttime: '7:00',
        endtime: '8:00',
        endstart: '8:00'
      })
    }
    if (this.data.onloadDate == this.data.date) {
      var item = this.data.loginItems
      var pickTime = item[0].value
      this.setData({
        items: item,
        starttime: pickTime
      })
    } else {
      var item = [{
          name: '0',
          value: '9:00-11:00',
          checked: 'true'
        },
        {
          name: '1',
          value: '15:00-18:00',
        }]

      var pickTime = item[0].value
      this.setData({
        items: item,
        starttime: pickTime
      })
    }
  },

  //单选点击时间
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e)
    this.setData({
      starttime: this.data.items[e.detail.value].value
    })
    console.log('选择时间', this.data.starttime)
  },
  // banner点击跳转
  bindEnvironmental: function() {
    console.log('111');
    wx.navigateTo({
      url: '../Environmental/Environmental',
    })
  },

  write: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  address: function(e) {
    var aaa = e.detail.value.replace(/\s+/g, '')
    console.log('地址信息', aaa)
    this.setData({
      v1: aaa
    })
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
    var reg = /1[3|4|5|6|7|8|9][0-9]{9}/;
    let v1 = this.data.v1
    // let v2 = this.data.v2
    // let v3 = this.data.v3
    let v4 = this.data.phone
    let v5 = this.data.date
    let v6 = this.data.starttime

    console.log('订单提交', v5, v6)
    var flage = reg.test(v4)
    if (this.data.navSelect === '') {
      wx.showToast({
        title: '请选择分类',
        image: '../../assets/image/cry.png',
        duration: 2000,
        mask: true
      })
    } else if (this.data.starttime === '') {
      wx.showToast({
        title: '今日回收已结束',
        image: '../../assets/image/cry.png',
        duration: 2000,
        mask: true
      })
    } else if (v1 === '') {
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
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: createOrder,
        method: 'post',
        data: {
          openid: this.data.openid,
          categoryIds: this.data.navSelect,
          pickTime: v5 + v6,
          address: v1,
          communityName: '',
          phoneNumber: v4
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: (res) => {
          console.log('回收', res)
          if (res.data.code == 1) {

            wx.setStorageSync('addr', v1)
            wx.setStorageSync('phone', v4)
            console.log('下单存地址', wx.getStorageSync('addr'))
            console.log('下单存手机号', wx.getStorageSync('phone'))
            wx.hideLoading()
            wx.navigateTo({
              url: '../orderSuccess/orderSuccess?orderNumber=' + res.data.orderNumber + '&openid=' + this.data.openid,

            })
          } else {
            wx.hideLoading()
            if (res.data.msg == '创建订单失败') {
              wx.showToast({
                title: '预约失败',
                image: '../../assets/image/cry.png',
                duration: 2000,
                mask: true
              })
            }
            var openid = this.data.openid
            console.log('有订单的时候openid', openid)
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../myOrder/myOrder?openid=' + openid,
                  })
                }
              }
            })
          }
        },
        fail: (erro) => {
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