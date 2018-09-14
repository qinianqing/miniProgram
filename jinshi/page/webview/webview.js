// page/webview/webview.js
let url = '';
let fromIndex = 1;
let pages;
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  back: function () {
    if (fromIndex) {
      wx.navigateBack({
      })
    } else {
      wx.navigateTo({
        url: '../../index/indexs',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    url = options.url;
    let that = this;
    pages = getCurrentPages().length;
    if (pages === 1) {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/huidaoshouye.png'
      })
    } else {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/Group%20ss4.png'
      })
    }
    // wx.getStorage({
    //   key: 'loginFromIndex',
    //   success: function (res) {
    //     if (res.data) {
    //       that.setData({
    //         navBack: 'https://cdn.jiyong365.com/Group%20ss4.png'
    //       })
    //     } else {
    //       fromIndex = 0;
    //       that.setData({
    //         navBack: 'https://cdn.jiyong365.com/huidaoshouye.png'
    //       })
    //       wx.setStorage({
    //         key: 'loginFromIndex',
    //         data: 1,
    //       })
    //     }
    //   },
    // })

    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphonex: true
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphonex: false
          })
        }
      },
    })

    that.setData({
      url:options.url
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
    return {
      title: '直达精致，让家更好！',
      path: '/page/webview/webview?url='+url,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})