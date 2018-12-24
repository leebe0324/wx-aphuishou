const loginApi = 'https://www.innothinking.cn/login/getCode2Session'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        money: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {
        wx.showLoading({
            title: '',
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
                                            if (res.data.code == 1) {
                                                wx.hideLoading()
                                                console.log('我的页面获取用户信息', res)
                                                this.setData({
                                                    openid: res.data.user['openid'],
                                                    money: res.data.user['orderMoney']
                                                })
                                                console.log
                                            } else {
                                                wx.hideLoading()
                                                wx.showToast({
                                                    title: '数据获取失败',
                                                    image: 'assets/image/cry',
                                                    mask:true
                                                })

                                            }
                                        },
                                        fail: erro => {
                                            wx.hideLoading()
                                            wx.showToast({
                                                title: '网络加载失败',
                                                image: 'assets/image/cry',
                                                mask: true
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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