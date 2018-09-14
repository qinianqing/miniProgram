// page/product/comment/showpicture/showpicture.js
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
var width = '';
var that_;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl: '',
    width: '750rpx',
    height: '',
  },
  letLoginModalShow: function (f) {
    if (f) {
      that_.setData({
        showLoginModal: true
      })
    } else {
      that_.setData({
        showLoginModal: false
      })
    }
  },
  back:function(){
  wx.navigateBack({
    
  })
  },
  goReLogin: function (e) {
    let userInfo = e.detail;
    API.rebind(userInfo);
  },
  delete: function (e) {
    var that = this;
    wx.showModal({
      content: '点一下就没有咯，确定吗？',
      success: function (res) {
        if (res.confirm) {
          let pages = getCurrentPages();
          let currentpage = pages[pages.length - 1].data.imageurl;
          let prepage = pages[pages.length - 2].data.commentPicArray;
          prepage.remove(currentpage);
          pages[pages.length - 2].deletePic(prepage);
          // 返回
          wx.navigateBack({

          })
        } else if (res.cancel) {
          wx.navigateBack({

          })
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that_ = this;
    API.setPage(that);
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
    });
    var imageurl = options.image_id;
    width = '750rpx';
    var proportion = options.proportion;
    that.setData({
      imageurl: imageurl,
      height: width / proportion
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
  // onShareAppMessage: function () {

  // }
})