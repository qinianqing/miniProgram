// page/promote/valid-list/valid-list.js
const API = require('../../../api/api.js');
let coupon_id = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true
  },
  back: function () {
    wx.navigateBack({

    })
  },
  goProductDetail: function (e) {
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.id
    })
   
  },
  fetchData:(that)=>{
    if(coupon_id){
      API.getCouponFitList(coupon_id).then((resp) => {
        console.log(resp);
        that.setData({
          total:resp.length,
          list:resp,
          loading:false
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    coupon_id = options.coupon_id;
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
    });
    that.fetchData(that);
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