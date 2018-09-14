// page/subscribe/index.js
const API = require('../../api/api.js');

let that_;
let list = [];
let isLastPage = true;
let fromP = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    gif: '../../image/loading.gif',
  },
  back: () => {
    wx.navigateBack({

    })
  },
  itemTap: (e)=>{
    wx.navigateTo({
      url: './detail/detail?id=' + e.currentTarget.id,
    })
  },
  about: ()=>{
    wx.navigateTo({
      url: '../user/customer-service/customer-service?source=subscribe&id=3b562e5c018444c782af2462e16dca41',
    })
  },
  goToCheck: ()=>{
    wx.navigateTo({
      url: './calender/check',
    })
  },
  fetchData: () => {
    API.getSubscribeList(fromP).then((resp) => {
      wx.stopPullDownRefresh();
      let showList = [];
      if (resp.hits.length === 20) {
        isLastPage = false;
        fromP = fromP + 20;
      } else {
        isLastPage = true;
        fromP = 0;
      }
      for (var i = 0; i < resp.hits.length; i++) {
        showList.push(resp.hits[i]._source);
      }
      list = list.concat(showList);
      that_.setData({
        loading: false,
        list: list
      })
    }, (err) => {
      console.error(err.error_msg)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that_ = this;
    list = [];
    that_.fetchData();

    let that = this;
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
    list = [];
    that_.fetchData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!isLastPage) {
      that_.fetchData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})