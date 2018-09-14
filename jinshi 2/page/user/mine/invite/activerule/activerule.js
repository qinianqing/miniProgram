// page/user/mine/invite/activerule/activerule.js
var iphonex;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iphonex:'',
    scollMarginTop:'',
    listOne:[
      '分享给好友专属邀请卡的优惠（全场折扣券或直减券，具体优惠券金额以页面实际显示为准),仅限新用户领用，每位新用户只能使用一张新人券，每天限量，领完为止。领取您专属邀请的好友即为您的邀请好友。',
      '可用于返现的首单结算金额仅包含现金支付的部分，礼品卡均不参与计算。',
      '返现奖励在确认收货后发放。若冻结期发生退款，则需要从冻结的返现中扣除相应的奖励。返现解冻后可兑换礼品卡消费。',
      '礼品卡每次最低10元起兑。'
    ],
    listTwo:[
      '通过不正当手段获得奖励，锦时优选有权撤销奖励及相关订单。',
      '同一登录账号、同一手机号、同一终端设备号、同支付账户、同一收获地址等合理显示为同一用户的情形，均视为同一用户。'
    ]
  },
 back:function(){
  wx.navigateBack({
    
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
          iphonex = true;
          that.setData({
            iphonex: true,
            scollMarginTop: 182
          })
        } else {
          // 不是iPhone X
          iphonex = false;
          that.setData({
            iphonex: false,
            scollMarginTop: 132
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
  onShareAppMessage: function () {
  
  }
})