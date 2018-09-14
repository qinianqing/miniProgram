// page/user/evaluate/detail/detail.js
const API = require('../../../../api/api.js');
var TimeFormat = require('../../../../util/timeformat.js');

let oid = '';
let spu_id = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  back: () => {
    wx.navigateBack({

    })
  },
  fetchData:(that)=>{
    API.getEvaDetailByRecord(spu_id,oid).then((resp)=>{
      let stars = [];
      for (let i = 0; i < parseInt(resp.star_num); i++) {
        stars.push('1');
      }
      that.setData({
        product:resp.product,
        starNum: resp.star_num,
        createdAt: TimeFormat(resp.createdAt),
        sku: resp.type_id,
        content: resp.comment_content,
        pics: resp.comment_image,
        stars:stars
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    oid = options.object_id;
    spu_id = options.spu_id;
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
    });
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