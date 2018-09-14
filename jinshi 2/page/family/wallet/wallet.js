// page/family/wallet/wallet.js
const API = require('../../../api/api.js');

let family_id = '';

let last_key = '';

let bills = [];

let vip = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true,
  },
  gocblist: function () {
    wx.navigateTo({
      url: './cashback?family_id='+family_id,
    })
  },
  whatiscb: function () {
    wx.navigateTo({
      url: '../../user/customer-service/customer-service',
    })
  },
  gofreecoupon: function () {
    wx.navigateTo({
      url: './coupon?family_id='+family_id,
    })
  },
  back: function () {
    wx.navigateBack({

    })
  },
  fetchData(that){
    // 获取家庭基金余额
    API.getFamilyWalletBalance(family_id).then((resp)=>{
      that.setData({
        balance:resp
      })
    })
    // 获取家庭消费列表
    API.getFamilyWalletList('all', family_id, last_key).then((resp)=>{
      let items = [];
      if (resp.LastEvaluatedKey){
        last_key = resp.LastEvaluatedKey;
      }
      for(let i=0;i<resp.Items.length;i++){
        let t = resp.Items[i];
        let money = '';
        let statusName = '';
        switch(t.status){
          case 0:
            statusName = '未结算';
            break;
          case 1:
            statusName = '已结算';
            break;
          case 3:
            statusName = '取消';
            break;
        }
        switch(t.type){
          case 0:
            money = t.amount;
            break;
          case 1:
            money = '+' + t.amount;
            break;
          case 3:
            money = '+' + t.amount ;
            break;
          case 4:
            money = '+' + t.amount;
            break;
        }
        let item = {
          detail:t.detail,
          createdAt: new Date(t.createdAt).toLocaleString() + '-' + statusName,
          amount:money
        }
        items.push(item);
      }
      bills = bills.concat(items);
      that.setData({
        list:bills,
        loading:false
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    family_id = options.family_id;

    bills = [];
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