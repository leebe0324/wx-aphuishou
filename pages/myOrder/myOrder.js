const order = 'https://www.innothinking.cn/order'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: '../icon/jiaju@3x.png',
        appoint: [],
        reveal1: false,
        reveal2: true,
        active: 1,
        finishedOrder: [],
        unpickOrder: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        wx.showLoading({
            title: '',
        })
        wx.request({
            url: order,
            method: 'get',
            data: {
                openid: options.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log('订单列表', res.data)

                if (res.data.code == 1) {
                    wx.hideLoading()
                    this.setData({
                        appoint: res.data.unpickOrder,
                        unpickOrder: res.data.unpickOrder,
                        finishedOrder: res.data.finishedOrder
                    })
                    console.log('默认待回收', this.data.appoint)
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '订单加载失败',
                        image: '../../assets/image/cry.png',
                        duration: 2000
                    })
                }
            }
        })
    },
    //待回收
    waitRecycle: function() {
        //为防止数据重复先置空数组
        this.setData({
            appoint: '',
            active: 1,
            reveal1: false,
            reveal2: true
        })
        this.setData({
            appoint: this.data.unpickOrder
        })

    },
    //已回收
    completeRecycle: function() {
        //为防止数据重复先置空数组
        this.setData({
            appoint: '',
            active: 2,
            reveal1: true,
            reveal2: false
        })
        this.setData({
            appoint: this.data.finishedOrder
        })
    },
    cancelOrder: function(e) {
        console.log('点击取消', e.target.id)

        wx.showLoading({
            title: '',
        })
        wx.request({
            url: order,
            method: 'POST',
            data: {
                orderNumber: e.target.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {
                console.log('订单列表', res.data)
                if (res.data.code == 1) {
                    wx.hideLoading()
                    wx.showToast({
                        title: '取消成功',
                        image: '../../assets/image/smlie.png',
                        duration: 2000
                    })
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 2000)

                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: '取消失败',
                        image: '../../assets/image/cry.png',
                        duration: 2000
                    })
                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 2000)

                }

            }
        })
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