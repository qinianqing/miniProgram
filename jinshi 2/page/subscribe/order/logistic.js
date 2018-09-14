// page/subscribe/order/logistic.js
const API = require('../../../api/api.js');
let id = '';
let week = '';
var that_;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true
  },
  back: () => {
    let pages = getCurrentPages();
    if (pages.length === 1) {
      wx.redirectTo({
        url: '../../index/index',
      })
    } else {
      wx.navigateBack({

      })
    }
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
  goReLogin: function (e) {
    let userInfo = e.detail;
    API.rebind(userInfo);
  },

  fetchData: function (that) {
    API.subsPackageLogistic(id,week).then((resp) => {
      that.setData({
        name: '发货日：'+resp.msg[resp.msg.length-1].Date.split(' ')[0],
        express_id: resp.express_id,
        express_brand: resp.express_brand,
        items: resp.msg,
        loading: false
      })
      wx.stopPullDownRefresh();
    }, (err) => {
      console.error(err.message);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    week = options.week;
    let that = this;
    that_ = this;
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
    API.setPage(that);
    that.fetchData(that);
    // that.setData({
    //   name: parcel_name,
    //   express_id: express_id
    // })
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
    let that = this;
    that.fetchData();
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