// page/order/list/list.js
// 熟练超过4，显示等几件，没超过4显示共几件
const API = require('../../../api/api.js');

let that_;
var notPayList = [];
var refundList = [];
var deliveryList = [];
var allList = [];

let s = 'a';
let last_keyA = '';
let last_keyB = '';
let last_keyC = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true
  },
  back: () => {
    wx.navigateBack({
      
    })
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
  goDelete: function (e) {
    wx.showModal({
      title: '删除后不可恢复!',
      content: '确定要删除么!',
      showCancel: true,
      confirmColor: '#FF9080',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
          })
          API.deleteOrder(e.currentTarget.id).then((resp) => {
            setTimeout(() => {
              wx.hideLoading();
              notPayList = [];
              refundList = [];
              deliveryList = [];
              allList = [];
              that_.fetchData(that_);
            }, 1000)
          })
        }
      }
    })
  },
  goDetail: function (e) {
    // 点击卡片
    wx.navigateTo({
      url: '../../order/detail/detail?order_id=' + e.currentTarget.id,
    })
  },
  itemLeftGo: function (e) {
    let oid = e.currentTarget.dataset.id;
    switch (e.currentTarget.dataset.go) {
      case '去付款':
        // 发起支付
        API.pay(oid).then((resp) => {
          resp = resp.payload;
          wx.requestPayment({
            timeStamp: resp.timeStamp,
            nonceStr: resp.nonceStr,
            package: resp.package,
            signType: resp.signType,
            paySign: resp.paySign,
            success: (res) => {
              // 支付成功跳转
              wx.redirectTo({
                url: '../payresult/payresult?order_id=' + oid,
              })
            },
          })
        })
      break;
      case '确认收货':
        wx.showModal({
          title: 'Hi!',
          content: '已经收到货了么!',
          showCancel: true,
          confirmColor: '#FF9080',
          confirmText: '确定',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              API.confirmReceipt(oid).then((resp) => {
                wx.showToast({
                  title: '收货成功',
                })
                deliveryList = [];
                notPayList = [];
                allList = [];
                that_.fetchData(that_);
              })
            }
          }
        })
        break;
    }
  },
  itemGo: function (e) {
    // 点击item主按钮
    // 遍历确认订单状态，执行操作
    switch (e.currentTarget.dataset.go) {
      case '去付款':
        // 发起支付
        API.pay(e.currentTarget.id).then((resp) => {
          resp = resp.payload;
          wx.requestPayment({
            timeStamp: resp.timeStamp,
            nonceStr: resp.nonceStr,
            package: resp.package,
            signType: resp.signType,
            paySign: resp.paySign,
            success: (res) => {
              // 支付成功跳转
              wx.redirectTo({
                url: '../payresult/payresult?order_id=' + e.currentTarget.id,
              })
            },
          })
        })
        break;
      case '取消订单':
        wx.showModal({
          title: 'Oops',
          content: '确定要取消订单么!',
          showCancel: true,
          confirmColor: '#FF9080',
          confirmText: '确定',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              wx.showLoading({
                title: '操作中',
              })
              API.cancelOrder(e.currentTarget.id).then((resp) => {
                // 刷新页面
                setTimeout(() => {
                  wx.hideLoading();
                  notPayList = [];
                  refundList = [];
                  deliveryList = [];
                  allList = [];
                  that_.fetchData(that_);
                }, 1000)
              })
            }
          }
        })
        break;
      case '再次购买':
        wx.showLoading({
          title: '操作中',
        })
        API.buyOrderAgain(e.currentTarget.id).then((resp) => {
          wx.hideLoading();
          // 跳转购物车
          wx.navigateTo({
            url: '../../cart/navcart',
          })
        })
        break;
      case '查看详情':
        // 查看订单详情
        // wx.redirectTo({
        //   url: '../payresult/payresult?order_id=' + e.currentTarget.id,
        // })
        wx.navigateTo({
          url: '../detail/detail?order_id=' + e.currentTarget.id,
        })
        break;
      case '物流追踪':
        // 查看物流情况
        wx.navigateTo({
          url: '../logistic/logistic?order_id=' + e.currentTarget.id,
        })
        break;
      case '退款进度':
        // 查看退款进度页面
        wx.navigateTo({
          url: '../reverse/list?status=ing',
        })
        break;
      case '退货进度':
        // 查看退货进度页面
        wx.navigateTo({
          url: '../reverse/list?status=ing',
        })
        break;
      case '换货进度':
        // 查看换货进度页面
        wx.navigateTo({
          url: '../reverse/list?status=ing',
        })
        break;
      case '去评价':
        // 进入评价列表页
        wx.navigateTo({
          url: '../../user/evaluate/evaluate?status=goingto',
        })
        break;
    }
  },
  //发起退款
  goApply: function (e) {
   
    let goodsDetail = {
      cancelnum: e.target.dataset.num,
      cancelpics: e.target.dataset.pics,
      cancelprice: e.target.dataset.price,
      sku_name: '订单已退款',
      type_id: '全单'

    };
    wx.setStorage({
      key: 'applyAll',
      data: goodsDetail,
    })
    wx.navigateTo({
      url: '../reverse/detail/applyafter/applyafter?applycancel=true&order_id=' + e.currentTarget.id,
    })
  },
  formatData: function (d) {
    let results = [];
    for (let i = 0; i < d.length; i++) {
      let item = {};
      switch (d[i].status) {
        case 'INIT':
          item.status = '未付款';
          item.leftEntrance = '去付款';
          item.mainEntrance = '取消订单';
          item.deleteShow = false;
          break;
        case 'PENDING_':
          item.status = '待发货';
          item.mainEntrance = '查看详情';
          item.deleteShow = false;
          break;
        case 'DELIVERED_':
          item.status = '配送中';
          item.leftEntrance = '确认收货';
          item.mainEntrance = '物流追踪';
          item.deleteShow = false;
          break;
        case 'REFUNDING':
          item.status = '退款中';
          item.mainEntrance = '退款进度';
          item.deleteShow = false;
          break;
        case 'REFUNDED':
          item.status = '退款完成';
          item.mainEntrance = '退款进度';
          item.deleteShow = true;
          break;
        case 'RETURNING':
          item.status = '退货中';
          item.mainEntrance = '退货进度';
          item.deleteShow = false;
          break;
        case 'RETURNED':
          item.status = '退换完成';
          item.mainEntrance = '退货进度';
          item.deleteShow = true;
          break;
        case 'RECHANGING':
          item.status = '换货中';
          item.mainEntrance = '换货进度';
          item.deleteShow = false;
          break;
        case 'RECHANGED':
          item.status = '换货完成';
          item.mainEntrance = '换货进度';
          item.deleteShow = true;
          break;
        case 'CANCEL':
          item.status = '已取消';
          item.mainEntrance = '再次购买';
          item.deleteShow = true;
          break;
        case 'SUCCESS':
          item.status = '交易成功';
          item.mainEntrance = '去评价';
          item.deleteShow = true;
          break;
      }
      item.id = d[i].order_id;
      let picA = [];
      let n = 0;
      for (let k = 0; k < d[i].items.length; k++) {
        n = n + d[i].items[k].num;
        picA.push(d[i].items[k].cover)
      }
      item.num = '共' + n + '件';
      item.pics = picA;
      item.price = d[i].goods_total / 100;
      results.push(item);
    }
    return results;
  },
  fetchData: function (that) {
    let type = '';
    let last_key = '';
    if (s == 'a') {
      type = 'DFK';
      last_key = last_keyA;
    } else if (s == 'b') {
      type = 'DSH';
      last_key = last_keyB;
    } else {
      type = 'ALL';
      last_key = last_keyC;
    }
    API.getOrderList(type, last_key).then((resp) => {
      // 格式化数据格式用于订单显示
      let l = that.formatData(resp.orders.Items);
      wx.stopPullDownRefresh();
      // 赋值
      switch (s) {
        case 'a':
          notPayList = notPayList.concat(l);
          last_keyA = '';
          if (resp.orders.LastEvaluatedKey) {
            last_keyA = resp.orders.LastEvaluatedKey;
          }
          that.setData({
            list: notPayList,
            loading: false
          })
          break;
        case 'b':
          deliveryList = deliveryList.concat(l);
          last_keyB = '';
          if (resp.orders.LastEvaluatedKey) {
            last_keyB = resp.orders.LastEvaluatedKey;
          }
          that.setData({
            list: deliveryList,
            loading: false
          })
          break;
        case 'c':
          allList = allList.concat(l);
          last_keyC = '';
          if (resp.orders.LastEvaluatedKey) {
            last_keyC = resp.orders.LastEvaluatedKey;
          }
          that.setData({
            list: allList,
            loading: false
          })
          break;
      }
    }, (err) => {
      console.error(err.error_msg);
      // 弹窗提示
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    })
  },
  tabTap: function (options) {
    var that = this;
    switch (options.currentTarget.id) {
      case 'a':
        // 待付款
        s = options.currentTarget.id;
        if (notPayList.length == 0) {
          that.fetchData(that);
        }
        var taba = {
          select: ['-active', '', '']
        }
        that.setData({
          tab: taba,
          list: notPayList
        })
        break;
      case 'b':
        // 运送中
        s = options.currentTarget.id;
        if (deliveryList.length == 0) {
          that.fetchData(that);
        }
        var tabb = {
          select: ['', '-active', '']
        }
        that.setData({
          tab: tabb,
          list: deliveryList
        })
        break;
      case 'c':
        // 全部
        s = options.currentTarget.id;
        if (allList.length == 0) {
          that.fetchData(that);
        }
        var tabc = {
          select: ['', '', '-active'],
          hidden: [true, true, false]
        }
        that.setData({
          tab: tabc,
          list: allList
        })
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that_ = this;

    notPayList = [];
    deliveryList = [];
    allList = [];

    last_keyA = '';
    last_keyB = '';
    last_keyC = '';

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
    });
    API.setPage(that);
    let tab;
    switch (options.status) {
      case 'dfk':
        tab = {
          select: ['-active', '', '']
        }
        s = 'a';
        break;
      case 'dsh':
        tab = {
          select: ['', '-active', '']
        }
        s = 'b';
        break;
      case 'all':
        tab = {
          select: ['', '', '-active']
        }
        s = 'c';
        break;
    }
    that.setData({
      tab: tab
    })
    that.setData({
      loading: true
    })
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
    notPayList = [];
    refundList = [];
    deliveryList = [];
    allList = [];
    let that = this;
    that.fetchData(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    switch (s) {
      case 'a':
        if (last_keyA) {
          let that = this;
          that.fetchData(that);
        }
        break;
      case 'b':
        if (last_keyB) {
          let that = this;
          that.fetchData(that);
        }
        break;
      case 'c':
        if (last_keyC) {
          let that = this;
          that.fetchData(that);
        }
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})