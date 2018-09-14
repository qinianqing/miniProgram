// page/subscribe/list/spu_map.js
const API = require('../../../api/api.js');

let spu_id = '';
let goods_name = '';
let that_;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    gif: '../../../image/loading.gif',
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
  itemTap: (e) => {
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.id,
    })
  },
  fetchData:()=>{
    API.getSubscribeListSpu(spu_id).then((resp)=>{
      that_.setData({
        list:resp,
        loading:false,
        goods_name:goods_name
      })
    },(err)=>{
      console.error(err)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    spu_id = options.spu_id || options.goods_id;
    goods_name = options.goods_name;
    that_ = this;
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
    that_.fetchData();
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