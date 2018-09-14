// page/order/reverse/detail.js
const API = require('../../../api/api.js')
//格式化时间方法
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
var days = (new Date()).Format("yyyy.MM.dd hh:mm:ss");
//退货信息列表
var reserverMessage = [];
//倒序信息
var unmessage = [];
//发起退款退货的id
var cancelId = '';
var that_;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //申请状态
    apply: '',
    // 申请退货商品数据
    goods: {

    },
    //页面数据
    reserverMessage: {messages: ['1']},
    gif:'../../../image/loading.gif',
    address: '',
    contact: '',
    phone: '',
    //申请须知
    applyDescribe: [
      '1、客服同意之后，请按照给出的退货地址进行退货，并请记录退货订单号。',
      '2、若客服拒绝，您可以修改申请后再次发起，商家会重新处理。'
    ],
    //商家处理时间
    time: {
      day: 5,
      hour: 23,
      minute: 39
    },
    //未发货，直接退款
    auto: [],
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

  //撤销请求
  cancelReq: function () {
    var that = this;
    API.getReverseProcess(cancelId).then((resp) => {
      reserverMessage = resp;
      that.fetchData();
      that.setData({
        apply: 'cancel'
      })
    })
  },
  //撤销申请
  cancelApply: function () {
    var that = this;
    wx.showModal({
      content: '是否撤销申请',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          API.cancelReverse(cancelId).then((resp) => {
            that.cancelReq();
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //我已寄出
  mail: function () {
    wx.navigateTo({
      url: './detail/logistics/logistics?reverse_id='+ cancelId,
    })
  },
  //返回
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
  //请求页面数据
  fetchData: function () {
    var that = this;
    that.setData({
      loading:false
    })
    unmessage.splice(0, unmessage.length)
    switch (reserverMessage.status) {
      case '_INIT':
         that.setData({
           apply:'apply'
         })
        break;
      case '_SENDBACK':
        that.setData({
          apply: 'logistics'
        })
        break;
      case '*CANCEL':
        that.setData({
          apply: 'cancel'
        })
        break;
       case '*SUCCESS':
       that.setData({
         apply:'success'
       })
    }

    API.getJinshiAddress().then((resp) => {
      that.setData({
        address: resp.address,
        contact: resp.contact,
        phone: resp.phone
      })
    })
    var that = this;
    switch (reserverMessage.type) {
      case 'REFUND':
        reserverMessage.typeName = '退款'
        break;
      case 'RETURN':
        reserverMessage.typeName = '退货'
        break;
      case 'RECHANGE':
        typeName = '换货';
        reserverMessage.typeName = '换货'
        break;
    }
    for (var i = 0; i < reserverMessage.messages.length; i++) {
      reserverMessage.messages[i].time = (new Date(reserverMessage.messages[i].time)).Format("yyyy.MM.dd hh:mm:ss");
      reserverMessage.messages[i].status = true;
    }
    for (var j = reserverMessage.messages.length - 1; j >= 0; j--) {
      unmessage.push(reserverMessage.messages[j])

    }
    reserverMessage.messages = unmessage;
    that.setData({
      reserverMessage: reserverMessage
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that_ = this;
    API.setPage(that);
    that.setData({
      loading:true
    })
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that_.setData({
            iphonex: true
          })
        } else {
          // 不是iPhone X
          that_.setData({
            iphonex: false
          })
        }
      },
    });
    cancelId = options.reverse_Id;
    let applyStatus = options.apply;
    if (applyStatus !== 'auto') {
      API.getReverseProcess(cancelId).then((resp) => {
      
        reserverMessage = resp;
        that_.fetchData();
      })
      wx.getStorage({
        key: 'applygoods',
        success: function (res) {
          that_.setData({
            goods: res.data
          })
        },
      })
    } else {
      that_.setData({
        loading:false
      })
      let message = [{
        day: days,
        status: true,
        details: '退款成功'
      }, {
        day: days,
        status: true,
        details: '已提交申请，商家已处理'
      }]
      that_.setData({
        apply: applyStatus,
        auto: message
      })
    }
    wx.getStorage({
      key: 'applygoods',
      success: function (res) {
        that_.setData({
          goods: res.data
        })
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