// pages/AppLunchPages/start.js
const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        auth: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo')

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _this = this
        wx.getSetting({
            success: res => {
                console.log('启动页获取用户权限', res)
                if (res.authSetting['scope.userInfo']) {
                    _this.setData({
                        auth: true
                    })

                }else
                {
                   _this.setData({
                       auth:false
                   })
                } if (app.globalData.userInfo) {
                } else if (this.data.canIUse) {
                    app.userInfoReadyCallback = res => {

                    }
                } else {
                    // 在没有 open-type=getUserInfo 版本的兼容处理
                    wx.getUserInfo({
                        success: res => {
                            app.globalData.userInfo = res.userInfo
                        }
                    })
                }
                console.log('状态',this.data.auth)
            }
        })
    },
    enter: function () {
        wx.getSetting({
            success: function (result) {
                if (result.authSetting['scope.userInfo']) {
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
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