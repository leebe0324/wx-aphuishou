const coupon = 'https://www.innothinking.cn/coupon'
 var QR = require("../../utils/qrcode.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        discount: '',
        openid: '',
        show:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            openid: options.openid
        })
        console.log('查优惠券', options.openid)
        wx.showLoading({
            title: '',
        })
        wx.request({
            url: coupon,
            method: 'get',
            data: {
                openid: this.data.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log('优惠券信息',res.data)
                if (res.data.code == 1) {

                    this.setData({
                        discount: res.data.coupons
                    })

                    if (res.data.coupons.length == 0)
                    {
                        console.log('没数据')
                    }else
                    {
                        console.log('有数据')
                        this.setData({
                            show: false
                        })
                  
                    }
                    wx.hideLoading()
                    console.log('优惠券列表', res.data)

                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '优惠券加载失败',
                        image: '../../assets/image/cry.png',
                        duration: 2000,
                        mask:true
                    })
                }
            },
            fail: res => {
                wx.showToast({
                    title: '请求失败',
                    image: '../../assets/image/cry.png',
                    duration: 2000,
                    mask:true
                })
            }
        })

    },
    //立即使用优惠券
    changeType: function(e) {
        console.log('点击了', e)

        var context
        if (e._relatedInfo.anchorTargetText == '待审核') {
            context = '后台系统核实订单后，可立即使用'
          wx.showModal({
            title: '提示',
            content: context,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          })
        } else {
            // context = e.target.id

            wx.navigateTo({
              url: 'QRcode?id='+e.target.id,
            })


        }



    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})