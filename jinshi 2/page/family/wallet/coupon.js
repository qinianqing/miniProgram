// page/family/wallet/coupon.js
let family_id = '';

const API = require('../../../api/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true,
  },
  back: function () {
    wx.navigateBack({

    })
  },
  use: function () {
    var that = this;
    that.setData({
      use: true,
      unuse: false
    })
  },
  unuse: function () {
    var that = this;
    that.setData({
      use: false,
      unuse: true
    })
  },
  useFsc:function (){
    wx.navigateTo({
      url: '../../category/index',
    })
  },
  fetchData: (that) => {
    API.getFscList(family_id).then((resp) => {
      if (resp.valid || resp.inactive){
        for (let i = 0; i < resp.valid.Items.length; i++) {
          let a = new Date(Number(resp.valid.Items[i].activeAt));
          resp.valid.Items[i].activeAt = a.getFullYear()+'/'+(a.getMonth()+1)+'/'+a.getDate();
          a = new Date(Number(resp.valid.Items[i].expiredAt));
          resp.valid.Items[i].expiredAt = a.getFullYear() + '/' + (a.getMonth() + 1) + '/' + a.getDate();
        }
        for (let i = 0; i < resp.inactive.Items.length; i++) {
          let a = new Date(Number(resp.inactive.Items[i].activeAt));
          resp.inactive.Items[i].activeAt = a.getFullYear() + '/' + (a.getMonth() + 1) + '/' + a.getDate();
          a = new Date(Number(resp.inactive.Items[i].expiredAt));
          resp.inactive.Items[i].expiredAt = a.getFullYear() + '/' + (a.getMonth() + 1) + '/' + a.getDate();
        }
        that.setData({
          loading:false,
          uselist: resp.valid.Items,
          unuselist: resp.inactive.Items,
          num: resp.valid.Items.length + resp.inactive.Items.length+'张'
        })
      }else{
        that.setData({
          loading: false,
          uselist: [],
          unuselist: []
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    family_id = options.family_id;
    let that = this;
    that.fetchData(that);
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