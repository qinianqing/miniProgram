// page/order/payresult/payresult.js
const API = require('../../../api/api.js');

let order_id;

var notice = '';
var parcelNotice = '';
var contact = '';
var phone = '';
var address = '';
var amount = 0;
var province = '';
var city = '';
var county = '';
var that_;
let cashmoney;
var shareUserId;
var shareStatus;

let user_name = '';

let canShare = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true,
    cashmoney: '',
    // shareStatus: false,
    selectShare: false,
    getCoupon: false,
    canShare: canShare,
    shareW: false
  },
  continueBuy: function () {
    wx.navigateTo({
      url: '../../index/index',
    })
  },
  back: function () {
    wx.navigateBack({

    })
  },
  selectC: function () {
    var that = this;
    that.setData({
      selectShare: false
    })
  },
  gomine: function () {
    var that = this;
    wx.navigateTo({
      url: '../../wallet/wallet',
    })
  },
  inviteFriend: function () {
    var that = this;
    that.setData({
      selectShare: true
    })
  },
  selectO: function () {


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
  checkOrder: function () {
    wx.navigateTo({
      url: '../detail/detail?order_id=' + order_id,
    })
  },
  fetchData: function (that) {
    var that = this;
    that.fetchGuess(that);
    API.getOrderDetail(order_id).then((resp) => {
      console.log("dfdf", resp)
      let o = resp.order;
      parcelNotice = '预计' + o.arrival_date + '送达'
      contact = o.contact
      phone = o.phone;
      province = o.province,
        city = o.city,
        county = o.county,
        address = o.address;
      amount = o.actual_payment;
      cashmoney = o.cashback / 1000;
      wx.hideLoading();

      // todo 展现条件应该与服务器条件一致
      if (o.actual_payment >= 30) {
        canShare = true;
      }

      that.setData({
        parcelNotice: parcelNotice,
        contact: contact,
        phone: phone,
        canShare: canShare,
        address: address,
        province: province,
        city: city,
        county: county,
        amount: amount,
        cashmoney: cashmoney
      })
    }, (err) => {
      console.error(err.message);
    });
    API.getWeekNotice().then((resp) => {
      that.setData({
        notice: resp.notice,
        loading: false
      })

    }, (err) => {
      console.error(err.message);
    })
  },
  fetchGuess: (that) => {
    // 获取猜你喜欢列表
    API.getGuessRandom().then((resp) => {
      let results = [];
      for (let i = 0; i < resp.hits.length; i++) {
        results.push(resp.hits[i]._source);
      }
      for (var i = 0; i < results.length; i++) {
        if (results[i].goods_cashback) {
          if (results[i].goods_cashback < 100) {
            results[i].tagstyle = true
          } else {
            results[i].tagstyle = false
          }
        } else {

        }

      }
      that.setData({
        guess: results
      })
    }, (err) => {
      console.error(err.error_msg);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    order_id = options.order_id;
    // 获取订单信息
    var that = this;
    that_ = this;
    API.setPage(that);
    wx.getStorage({
      key: 'user_Id',
      success: function (res) {
        shareUserId = res.data;
      }
    })
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
    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        user_name = res.data.nickName
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
  onShareAppMessage: function () {
    if (canShare) {
      return {
        title: user_name + '送你拼手气红包',
        path: '/page/user/mine/invite/send?invite_order=' + shareUserId + '&order_id=' + order_id,
        imageUrl: 'https://cdn.jiyong365.com/1~6%E5%85%83%E7%BA%A2%E5%8C%85.png',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else {
      return {
        title: '家庭采购上锦时',
        path: '/page/index/index',
        imageUrl: 'https://cdn.jiyong365.com/%E9%A6%96%E9%A1%B5%E5%88%86%E4%BA%AB.png',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }
})