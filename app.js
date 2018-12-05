//app.js

const loginApi ='https://www.innothinking.cn/login/getCode2Session'
App({
    globalData: {
        userInfo: null,
        authSetting: false,
        openid: null,
    },

    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        /*----------------------------------------------------------------- */

        wx.showLoading({
            title: '',
        })
        // 登录
        wx.login({
            success: res => {

                if (res.code) {

                    //获取用户授权       
                    wx.getSetting({
                        success: result => {
                            if (result.authSetting['scope.userInfo']) {
                                console.log('appjs授权了')
                                this.globalData.authSetting = true
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

                                                if(res.data.code==1)
                                                {
                                                    wx.hideLoading()
                                                    console.log('appjs获取数据', res)
                                                    this.globalData.openid = res.data.openid
                                                    this.globalData.userInfo = r.userInfo
                                                    wx.removeStorageSync('openid')
                                                    wx.setStorageSync('openid', res.data.openid)
                                                    console.log('appjs缓存openid', wx.getStorageSync('openid'))

                                                }else
                                                {
                                                    wx.hideLoading()
                                                    wx.showToast({
                                                        title: '程序加载数据失败',
                                                        image: '../../assets/image/cry.png',
                                                        duration: 2000
                                                    })

                                                }
                                            },
                                            fail: erro => {
                                                wx.showToast({
                                                    title: '网络请求失败',
                                                    image: '../../assets/image/cry.png',
                                                    duration: 2000
                                                })
                                            }
                                        })
                                    }
                                })

                            } else {
                                //没有授权
                                wx.hideLoading()
                                console.log('appjs没授权')
                                this.globalData.authSetting = false
                            }
                        }


                    })

                }

            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    }
})