// page/subscribe/order/reverse.js
let applyReason = ['不需要了', '发现了更好商品', '商品与描述不符', '其他原因'];
const API = require('../../../api/api.js');

let reason = '';

let order;
let that_;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyCancel: applyReason,
  },
  back:()=>{
    wx.navigateBack({
      
    })
  },
  apply:()=>{
    if(reason){
      wx.showModal({
        title: '确定要取消订阅么!',
        content: '申请后立刻通过!',
        showCancel: true,
        confirmColor: '#FF9080',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
            API.cancelSub(order.subs_order_id, reason).then((resp) => {
              wx.showToast({
                title: '取消成功',
                complete:()=>{
                  wx.navigateBack({
                    
                  })
                }
              })
            }, (err) => {
              wx.showModal({
                title: 'Oops!',
                content: err,
                showCancel: false,
                confirmText: '知道了',
                confirmColor: '#FD8075'
              })
            })
        }
      })
    }else{
      wx.showModal({
        title: 'Oops!',
        content: '请选择取消原因',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    }
  },
  formatData:()=>{
    let already = 0;
    for(let i=0;i<order.sku_detail.length;i++){
      already = already + order.sku_detail[i].price * order.sku_detail[i].num;
    }
    already = already * order.exec_stages;
    let payB = order.actual_payment - already;
    if(payB<=0){
      payB = 0;
    }
    that_.setData({
      aStages:order.exec_stages,
      stages:order.stages,
      actPay:order.actual_payment,
      already:already,
      payBack: payB
    })
  },
  bindPickerChanges:(e)=>{
    reason = applyReason[Number(e.detail.value)];
    that_.setData({
      index:Number(e.detail.value)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that_ = this;
    wx.getStorage({
      key: 'reverseSubs',
      success: function(res) {
        order = res.data;
        that_.formatData();
      },
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})