// page/wallet/wallet.js
// 总额
const API = require('../../api/api.js');

var total = '';
var list = [];

let last_key = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../image/loading.gif',
    loading: true
  },
  back:function(){
    let pages = getCurrentPages();
    if (pages.length === 1) {
      wx.redirectTo({
        url: '../../index/index',
      })
    } else {
      wx.navigateBack({

      })
    }   wx.navigateBack({
      
    })
  },
  fetchData:function(that){
    // 获取余额
    API.getUserWalletBalance().then((resp)=>{
      if(resp){
        total = resp;
        that.setData({
          total:total
        })
      }else{
        total = '0.00';
        that.setData({
          total: total
        })
      }
    }).catch((err)=>{
      console.error(err);
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    })

    API.getUserWalletList('all',last_key).then((resp) => {
      if (resp.Count) {
        if (resp.LastEvaluatedKey){
          last_key = resp.LastEvaluatedKey;
        }
        let l = that.formatData(resp.Items);
        list = list.concat(l);
        that.setData({
          list:list,
          loading:false
        })
      } else {
        // 无数据
        that.setData({
          list:list,
          loading: false
        })
      }
    }).catch((err) => {
      console.error(err);
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    })
  },
  // format data
  formatData: function (d){
    // 
    let results = [];
    for(let i=0;i<d.length;i++){
      let item = {};
      if (Number(d[i].amount)>0){
        item.amount = '+'+String(d[i].amount);
      }else{
        item.amount = String(d[i].amount);
      }
      item.time = new Date(d[i].createdAt)
      item.time = item.time.toLocaleString();
      switch (d[i].type) {
        case 0:
          item.reason = d[i].detail;
          break;
        case 1:
          item.reason = d[i].detail;
          if (d[i].status === 0) {
            item.statusName = '-未结算';
          } else if (d[i].status === 1) {
            item.statusName = '-已到账';
          } else if (d[i].status === 2) {
            item.statusName = '-取消';
          }
          break;
        case 3:
          item.reason = d[i].detail + '储值';
          break;
        case 4:
          item.reason = d[i].detail + '退款';
          if (d[i].status === 0) {
            item.reason = item.reason + '未到账';
          } else if (d[i].status === 1) {
            item.reason = item.reason + '到账';
          } else if (d[i].status === 2) {
            item.reason = item.reason + '取消';
          }
          break;
      }
      results.push(item);
    }
    return results;
  },
  whatiscb: function (){
    wx.navigateTo({
      url: '../user/customer-service/customer-service?source=wallet',
    })
  },
  gocblist: function (){
    wx.navigateTo({
      url: './cashback/list',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
    list = [];
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
    list = [];
    var that = this;
    that.fetchData(that);
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
    total = '';
    list = [];
    last_key = '';
    that.fetchData(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    if (last_key) {
      that.fetchData(that);
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})