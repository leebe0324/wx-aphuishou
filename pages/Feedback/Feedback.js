// pages/Feedback/Feedback.js
const feedApi = 'https://www.innothinking.cn/feedback'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:'',
        nickname:'',
        content:'',

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        console.log('传来了没有', options)
         var _this=this
         _this.setData({
             openid:options.openid,
             nickname: options.nickname
         })
    },

    //失去焦点获取文本内容

    context:function(e)
    {
        console.log('文本内容',e.detail.value)
        var _this = this
        _this.setData({
            content: e.detail.value
        })
    },

    faceSubmit:function()
    {

        console.log('检查用户名',this.data.nickname)
        console.log('检查内容', this.data.content)
        wx.showLoading({
            title: '',
            mask: true
        })
        if(this.data.content.length==0)
        {
            console.log('请输入内容')
            wx.showToast({
                title: '请输入内容',
                image: '../../assets/image/smlie.png',
                duration: 2000,
                mask: true
            })
        }else
        {
            wx.request({
                url: feedApi,
                method: 'POST',
                data: {
                    openid: this.data.openid,
                    nickname: this.data.nickname,
                    context: this.data.content
                },
                header: {
                    'content-type': 'application/json'
                },
                success: res => {
                    console.log('提交返回', res)
                    if(res.data.code==1)
                    {
                        wx.showToast({
                            title: res.data.msg,
                            image: '../../assets/image/smlie.png',
                            duration: 2000,
                            mask: true
                        })
                        setTimeout(function () {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 2000)
                        wx.hideLoading()

                    }else
                    {
                        wx.showToast({
                            title: '提交失败',
                            image: '../../assets/image/cry.png',
                            duration: 2000,
                            mask: true
                        })
                        wx.hideLoading()

                    }
                },fail:erro=>
                {
                    wx.showToast({
                        title: '网络异常',
                        image: '../../assets/image/cry.png',
                        duration: 2000,
                        mask: true
                    })

                }
            })

        }

  

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