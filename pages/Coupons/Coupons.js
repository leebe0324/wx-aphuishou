Page({

  /**
   * 页面的初始数据
   */
  data: {
      discount: '',
      openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          openid:options.openid
      })
      console.log('查看优惠券',options.openid)

      wx.request({
        url: 'https://www.innothinking.cn/coupon',
          method:'get',
          data:{
              openid:this.data.openid
          },
          header:
          {
              'content-type': 'application/json'
          },
          success:res=>
          {
              console.log('优惠券列表',res.data)

              this.setData({
                  discount: res.data.coupons
              })

            //   console.log()
          },fail:res=>{
              wx.showToast({
                  title: '请求失败',
                  image: '../../assets/image/cry.png',
                  duration: 2000
              })
          }
      })
    
  },
  //立即使用优惠券
    changeType: function (e)
    {
        console.log('点击了', e)

        var context
        if (e._relatedInfo.anchorTargetText == '未审核') {
            context = '优惠券审核中，审核完毕后使用'
        } else {
            context = e.target.id
        }

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