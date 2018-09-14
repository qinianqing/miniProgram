// page/wallet/cashback/list.js
const API = require('../../../api/api.js');

var onthewayList = [];

var alreadyList = [];

let last_key = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true
  },
  back:()=>{
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // that.setData({
    //   onthewayList: onthewayList,
    //   alreadyList: alreadyList
    // })
  },
  fetchData: function (that){
    API.getUserWalletList('pre-cb','').then((resp) => {
      console.log(resp)
      if (resp.Count) {
        console.log(resp)
        let l = that.formatData(resp.Items);
        console.log(l)
        that.setData({
          onthewayList: l,
          loading:false
        })
      } else {
        // 无数据
        that.setData({
          onthewayList: [],
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
    API.getUserWalletList('already-cb', last_key).then((resp) => {
      if (resp.Count) {
        last_key = resp.LastEvaluatedKey;
        let l = that.formatData(resp.Items);
        alreadyList = alreadyList.concat(l);
        that.setData({
          alreadyList: alreadyList
        })
      } else {
        // 无数据
        that.setData({
          alreadyList: []
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
  formatData: function (d) {
    // 
    let results = [];
    for (let i = 0; i < d.length; i++) {
      let item = {};
      if (Number(d[i].amount) > 0) {
        item.amount = '+' + String(d[i].amount);
      } else {
        item.amount = '-' + String(d[i].amount);
      }
      item.time = new Date(d[i].createdAt)
      item.time = item.time.toLocaleString();
      switch (d[i].type) {
        case 0:
          item.reason = '消费';
          break;
        case 1:
          item.reason = d[i].detail;
          break;
        case 3:
          item.reason = d[i].detail + '储值';
          break;
        case 4:
          item.reason = '退款';
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    this.fetchData(this);
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
    onthewayList = [];

    alreadyList = [];

    last_key = '';
    that = this;
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