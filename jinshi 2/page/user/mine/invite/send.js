// page/user/mine/invite/send.js
const API = require('../../../../api/api.js');
var that_;
//判断某人一天领取数量
var getStatus;
//存贮参数
var params;
let user_name = '';

let o;
var orderNum;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showLoginModal: false,
    gif: '../../../../image/loading.gif',
    moneyGet:'0.0',
    //拼手气红包
    money: {
      num: '0.0',
      discount: '',
      time: ''
    },
    //新人红包
    newMoney: {
      num: '0.0',
      discount: '',
      time: ''
    },
    //活动规则
    rule: [
      '每位用户每天至多可以领取5个红包',
      '红包仅限在线支付,每张订单仅限使用一个红包',
      '若分享用户取消订单，则由该订单分享红包所获得得返现金额也将退回',
      '若用户使用领取的红包下单，订单取消后，红包将会失效',
      '红包已放入个人中心-优惠券'
    ],
    //排行数据
    list: [],
    //控制新老用户
    Status: false,
    //已经领取红包状态
    Already:false
  },
  // 授权登录
  goReLogin: function (e) {
    let userInfo = e.detail;
    API.rebind(userInfo);
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
  //立即使用
  goIndex: function () {
    wx.navigateTo({
      url: '../../../index/index',
    })
  },
  backHome: function (){
    wx.redirectTo({
      url: '../../../index/index',
    })
  },
  //手气红包
  getLuckCoupon: function (options) {
    var that = this;
    API.getLuckCoupon().then((resp) => {
      if (options.invite_order && options.order_id) {
        let parm = {
          user_id: options.invite_order,
          order_id: options.order_id,
          invite_money: resp.price
        }
        that.createOldMessage(parm);
      }
      let lucky = {
        num: resp.price,
        discount: '满' + resp.condition + '元可用',
        time: JSON.stringify(new Date(Number(resp.expiredAt))).split('T')[0].slice(1) + '到期'
      }

      that.setData({
        money: lucky
      })
    })
  },
  //新人专享红包
  getNewUserCoupon: function (options) {
    var that = this;
    wx.getStorage({
      key: 'newUserCoupon',
      success: function(res) {
        let resp = res.data;
        if (options.invite_order && options.order_id) {
          let parm = {
            user_id: options.invite_order,
            order_id: options.order_id,
            invite_money: resp.price
          }
          that.createMessage(parm);
        }
        let newlucky = {
          num: resp.price,
          discount: '满' + resp.condition + '元可用',
          time: JSON.stringify(new Date(Number(resp.expiredAt))).split('T')[0].slice(1) + '到期'
        }
      },
    })
  },
  //新用户创建邀请信息
  createMessage: function (parm) {
    var that = this;
    API.createInvite(parm).then((res) => {
    })
  },
  //占位信息
  noneCoupon:function(){
    var that = this;
    let paramsR = {
      order_id:o.order_id,
      user_id:o.invite_order
    };
    that.getOrderRanking(paramsR);
  },
  //老用户创建
  createOldMessage: function (parm) {
    var that = this;
    API.createOldInvite(parm).then((res) => {
      that.getOrderRanking(parm)
    })
  },
  //得到本人下面的一天所获取的手气红包
  getOneCouponNum: function (options) {
    var that = this;
    API.getOneCouponNum().then((resp) => {
      getStatus = resp;
      if (getStatus == 'yes') {
        that.getAlready(options);
      } else {
        that.setData({
          Already: true
        })
        that.noneCoupon();
        wx.showModal({
          content: '今天领取已达上限',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../../../index/index',
              })
            } else if (res.cancel) {
              wx.redirectTo({
                url: '../../../index/index',
              })
            }
          }
        })
      }
    })
  },
  //判断是否领过此人的红包
  getAlready: function (options) {
    var that = this;
    if (options.invite_order && options.order_id) {
      let parm = {
        user_id: options.invite_order,
        order_id: options.order_id
      }
      API.checkSame(parm).then((resp) => {
        if (resp > 0) {
          that.setData({
            Already:true
          })
          that.noneCoupon();
          // wx.showModal({
          //   title: '已领取过该红包',
          //   content: '请在福利频道查看更多福利',
          //   showCancel: false,
          //   confirmText: '朕知道了',
          //   confirmColor: '#FD8075'
          // })
        } else {
          that.getLuckCoupon(options);

        }
      })
    }
  },
  //排行
  getOrderRanking: function (params) {
    var that = this;
    API.getOrderRanking(params).then((resp) => {
      wx.stopPullDownRefresh();
      that.setData({
        list: resp
      })
     
      wx.getStorage({
        key: 'user_info',
        success: function (res) {
          let uName = res.data.nickName;
          let uAvatar = res.data.avatarUrl;
          let c = 0;
          for (let i = 0; i < resp.length; i++) {
            console.log("22dsd22")
            if(resp[i].user_name === uName && resp[i].user_avatar === uAvatar){
              c++;
              that.setData({
                moneyGet: resp[i].invite_money,
                money: {
                  num: resp[i].invite_money
                }
              })
              break;
            }
          }
          if(c === 0){
            that.setData({
              moneyGet: '0.0',
              money: {
                num: '0.0'
              }
            })
          }
        },
      })
    })
  },
  //得到某人发的订单红包数量
  getOneOrdersNum:function(options){
    var that = this;
    API.getSendNum(options.invite_order,options.order_id).then((resp)=>{
      orderNum = resp;
      that.fetchData(options);
    })
  },
  //数据渲染
  fetchData: function (options) {
    var that = this;
    //判断是新用户还是老用户
    wx.getStorage({
      key: 'isNewUser',
      success: function (res) {
        if (res.data == 1) {
          that.setData({
            Status: true
          })
          let parm = {
            user_id: options.invite_order,
            order_id: options.order_id
          }
          if(orderNum > 9){
            that.getOrderRanking(parm);
            wx.showModal({
              title: '该红包已被领取完',
              content: '请在福利频道查看更多福利',
              showCancel: false,
              confirmText: '朕知道了',
              confirmColor: '#FD8075'
            })
          }else{
            that.getOneCouponNum(options);
          }
          that.getNewUserCoupon(options);
        } else {
          that.setData({
            Status: false
          })
          let parm = {
            user_id: options.invite_order,
            order_id: options.order_id
          }
          if (orderNum > 9) {
            that.getOrderRanking(parm);
            wx.showModal({
              title: '该红包已被领取完',
              content: '请在福利频道查看更多福利',
              showCancel: false,
              confirmText: '朕知道了',
              confirmColor: '#FD8075'
            })
          } else {
            that.getOneCouponNum(options);
          }

        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    API.setPage(this);
    that_ = this;
    o = options;
    that.getOneOrdersNum(options);
  //  that.setData({
  //      loading:true
  //  })
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
    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        user_name = res.data.nickName
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
    var that = this;
    let paramsR = {
      order_id: o.order_id,
      user_id: o.invite_order
    };
    that.getOrderRanking(paramsR);
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