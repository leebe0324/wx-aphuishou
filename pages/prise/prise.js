const createCoupon ='https://www.innothinking.cn/coupon/createCoupon'


Page({
  /**
   * 页面的初始数据
   */
  data: {
      display: "display:none",
      title: 'null',
      transrotate: null,
      openid:'',
      orderNumber:''
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      console.log('优惠券接收数据',options)

      this.setData({
          openid:options.openid,
          orderNumber:options.orderNumber
      })
    
  },
  //抽奖点击
    getPrise() {
        var _this=this

        this.setData({
            transrotate: 'transrotate'
        });
        //延时操作中要把this换成变量，否则this指向域会出问题
        setTimeout(function () {
            wx.request({
                url: createCoupon,
                data: {
                    openid: _this.data.openid,
                    orderNumber: _this.data.orderNumber
                },
                header: {
                    'content-type': 'application/json'
                },
                method: 'get',
                success: res => {
                    console.log('获取优惠券', res)
                    if (res.data.code == 1) {
                        _this.setData({
                            title: res.data.couponName,
                            display: "display:block"
                        })
                    } else {
                        _this.setData({
                            transrotate: null
                        })
                        wx.showModal({
                            title: '提示',
                            content: '获取优惠券失败',
                            showCancel:false,
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')

                                    //待定跳转
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                } 
                            }
                        })
                    }
                }
            })

        }, 2000)
     },
//查看优惠券
    discount() {
        wx.navigateTo({
            url: '/pages/Coupons/Coupons?openid='+this.data.openid,
        })
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})