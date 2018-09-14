// page/order/detail/detail.js
const API = require('../../../api/api.js');
let a = [];
let order_id = '';
let status = '';
let parcel;
let that_;
let goods;
let new_status = 0;
let shareUserId;
let user_name;
let canShare = false;
const pay = () => {
  // 发起支付
  API.pay(order_id).then((respp) => {
    if (!respp.all_balance) {
      respp = respp.payload;
      // 未能全能抵扣
      wx.requestPayment({
        timeStamp: respp.timeStamp,
        nonceStr: respp.nonceStr,
        package: respp.package,
        signType: respp.signType,
        paySign: respp.paySign,
        success: (res) => {
          // 支付成功跳转
          wx.redirectTo({
            url: './payresult/payresult?order_id=' + order_id,
          })
        },
      })
    } else {
      respp = respp.payload;
      // 全额抵扣
      wx.showModal({
        title: 'Oops!',
        content: '你的订单可由余额全部抵扣，还需支付1分钱确认身份',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了',
        success: (resssss) => {
          if (resssss.confirm) {
            wx.requestPayment({
              timeStamp: respp.timeStamp,
              nonceStr: respp.nonceStr,
              package: respp.package,
              signType: respp.signType,
              paySign: respp.paySign,
              success: (res) => {
                // 支付成功跳转
                wx.redirectTo({
                  url: './payresult/payresult?order_id=' + order_id,
                })
              },
            })
          }
        }
      })
    }
  }, (err) => {
    console.error(err.message);
    wx.showModal({
      title: 'Oops!',
      content: err.error_msg,
      showCancel: false,
      confirmColor: '#FF9080',
      confirmText: '知道了'
    })
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    reverseS: '',
    loading: true,
    sendPLuck:false
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

  goLogistic: () => {
    if (status != 'INIT' && status != 'PENDING_') {
      wx.navigateTo({
        url: '../logistic/logistic?order_id=' + order_id,
      })
    }
  },

  tocomment: function () {
    wx.navigateTo({
      url: '../../user/evaluate/evaluate',
    })
  },
  contact: () => {

  },
  goP: () => {
    canShare=true;
  },
  back: function () {
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
  pay: () => {
    // 发起支付
    pay();
  },
  tuikuan: (e) => {
    a.push(goods.items[0].cover)
    let goodsDetail = {
      cancelnum: "共" + goods.items.length + '件',
      cancelpics: a,
      cancelprice: goods.payment,
      sku_name: '订单已退款',
      type_id: '全单'
    };
    wx.setStorage({
      key: 'applyAll',
      data: goodsDetail,
    })
    wx.navigateTo({
      url: '../reverse/detail/applyafter/applyafter?applycancel=true&order_id=' + order_id,
    })
  },
  cancel: () => {
    wx.showModal({
      title: 'Oops',
      content: '确定要取消订单么!',
      showCancel: true,
      confirmColor: '#FF9080',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          API.cancelOrder(order_id).then((resp) => {
            // 刷新页面
            setTimeout(() => {
              wx.hideLoading();
              that_.fetchOrder(that_);
            }, 1000)
          })
        }
      }
    })
  },
  shouhou: () => {
    // 发起售后
    wx.navigateTo({
      url: '../reverse/detail/applyafter/applyafter?applycancel=true&order_id=' + order_id,
    })
  },
  confirm: () => {
    // 确认收货
    wx.showModal({
      title: 'Hi!',
      content: '已经收到货了么!',
      showCancel: true,
      confirmColor: '#FF9080',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        API.confirmReceipt(order_id).then((resp) => {
          wx.showToast({
            title: '收货成功',
          })
          that_.fetchOrder(that_);
        })
      }
    })
  },
  mainTap: () => {
    switch (status) {
      case 'INIT':
        // 发起支付
        pay();
        break;
      case 'DELIVERED_':
      case 'SUCCESS':
        // 进入物流信息页
        wx.navigateTo({
          url: '../../parcel/logistic/logistic?order_id=' + order_id,
        })
        break;
      case 'REFUNDING':
      // 查询退款进度
      case 'REFUNDING':
        break;
      case 'RETURNING':
      case 'RETURNED':
        // 查询退货进度
        break;
      case 'RECHANGING':
      case 'RECHANGED':
        // 查询退货进度
        break;
    }
  },
  applyAfter: (e) => {

    wx.navigateTo({
      url: '../reverse/detail/applyafter/applyafter?cover=' + e.currentTarget.dataset.cover + '&spu_name=' + e.currentTarget.dataset.spu + '&sku_name=' + e.currentTarget.dataset.sku + '&num=' + e.currentTarget.dataset.num + '&price=' + e.currentTarget.dataset.price + '&orderids=' + e.currentTarget.dataset.orderid + '&skuid=' + e.currentTarget.dataset.skuid,
    })
    // let goodsdetail = {
    //   default_image: e.currentTarget.dataset.cover,
    //   goods_name: e.currentTarget.dataset.spu,
    //   num: e.currentTarget.dataset.num,
    //   type_id: e.currentTarget.dataset.sku,
    //   goods_price: e.currentTarget.dataset.price
    // }
    // wx.setStorage({
    //   key: 'applygoods',
    //   data: goodsdetail,
    // })
  },
  applyAfters: function (e) {
    wx.navigateTo({
      url: '../reverse/detail/detail?reverse_Id=' + e.currentTarget.dataset.orderid,
    })
  },
  addCart: (e) => {
    let sku_id = e.currentTarget.dataset.sku;
    let new_price = e.currentTarget.dataset.price;
    let spu_id = sku_id.split('-')[0];
    let options = {
      spu_id: spu_id,
      sku_id: sku_id,
      num: 1,
      price: new_price
    }
    API.addCart(options).then((resp) => {
      // 加入购物车成功
      wx.showToast({
        title: '已放入购物车',
      })
      wx.getStorage({
        key: 'cartMsg',
        success: function (res) {
          let newMsg = res.data;
          if (newMsg.length > 0) {
            for (var i = 0; i < newMsg.length; i++) {
              if (newMsg[i].spu_id === options.spu_id) {
                new_status = 1;
                newMsg[i].num = newMsg[i].num + 1;
                wx.setStorage({
                  key: 'cartMsg',
                  data: newMsg,
                })
                return;
              } else {
                new_status = 0
              }
            }
            if (new_status === 0) {
              newMsg.push(options);
            }
          } else {
            newMsg.push(options);
          }
          wx.setStorage({
            key: 'cartMsg',
            data: newMsg,
          })
        },
      })

    }, (err) => {
      console.error(err.error_msg);
    })
  },
  shareRight: () => {
    that_.setData({
      shareW: true
    })
    canShare = true;
  },
  selectCancel: () => {
    that_.setData({
      shareW: false
    })
    canShare = false
  },
  fetchOrder: (that) => {
    API.getOrderDetail(order_id).then((res) => {
      goods = res.order;
      let data = res.order;
      data.cashback = data.cashback.toFixed(2)
      let statusName = '';
      status = data.status;
      data.createdAt = new Date(data.createdAt);
      data.createdAt = data.createdAt.toLocaleString();
      data.reverseShow = false;
      let main = '';
      switch (data.status) {
        // 待支付
        case 'INIT':
          statusName = '待付款';
          main = '去付款';
          that.timeCountDown(data, that);
          that.setData({
            init: true
          })
          break;
        // 已处理，代发货
        case 'PENDING_':
          statusName = '订单准备中';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            pending: true,
            order: data,
            items: data.items,
            shouhou: true,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 已发货
        case 'DELIVERED_':
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '订单已发货';
          main = '物流追踪';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            delivery: true,
            order: data,
            items: data.items,
            confirm: true,
            shouhou: true,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 订单成功
        case 'SUCCESS':
          if (data.actual_payment >= 30){
                  that_.setData({
                    sendPLuck: true
                  })
          }
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '订单已完成';
          main = '去评价';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            shouhou: true,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 发起退款  
        case 'REFUNDING':
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '退款进行中';
          main = '退款进度';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 退款成功
        case 'REFUNDED':
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '退款已完成';
          main = '退款进度';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 发起退货
        case 'RETURNING':
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '退货进行中';
          main = '退货进度';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 退货成功  
        case 'RETURNED':
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '退货已完成';
          main = '退货进度';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 发起换货 
        case 'RECHANGING':
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '换货进行中';
          main = '换货进度';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 换货成功
        case 'RECHANGED':
          if (data.success_time) {
            data.success_time = Number(data.success_time);
            let now = Date.now();
            if ((now - data.success_time) < 30 * 1000 * 60 * 60 * 24) {
              data.reverseShow = true;
            } else {
              data.reverseShow = false;
            }
          } else {
            data.reverseShow = false;
          }
          statusName = '换货已完成';
          main = '换货进度';
          data.main = main;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
        // 订单取消
        case 'CANCEL':
          statusName = '订单取消';
          data.main = main;
          data.reverseShow = false;
          data.statusName = statusName;
          that.setData({
            order: data,
            items: data.items,
            loading: false
          });
          wx.stopPullDownRefresh();
          break;
      }
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
  fetchData: (that) => {
    that.fetchGuess(that);
    that.fetchOrder(that);
  },
  guessTap: (e) => {
    let goods_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?goods_id=' + goods_id,
    })
  },
  timeCountDown: (d, that) => {
    let time = new Date(d.updatedAt);
    let targetTime = time.getTime() + 2 * 60 * 60 * 1000;
    // 1秒执行一次
    const timer = () => {
      setTimeout(() => {
        handle();
      }, 1000);
    }
    const handle = () => {
      let now = new Date().getTime();
      let outTime = parseInt((targetTime - now) / 1000);
      let hour = Number(Math.floor(outTime / 60));
      let sec = Number(outTime % 60);
      let targetS;
      if (hour >= 0 && sec >= 0) {
        targetS = '支付  ' + hour + ':' + sec;
        d.main = targetS;
        d.statusName = '待付款';
        that.setData({
          order: d,
          items: d.items,
          // package: d.parcel,
          loading: false
        });
        timer();
      } else {
        targetS = '订单已取消';
        d.main = '';
        d.statusName = '已取消';
        status = 'CANCEL';
        that.setData({
          order: d,
          items: d.items,
          // package: d.parcel,
          loading: false
        });
      }
    };
    handle();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that_ = this;
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
    });
    wx.getStorage({
      key: 'user_Id',
      success: function (res) {
        shareUserId = res.data;
      }
    })
    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        user_name = res.data.nickName
      },
    });
    API.setPage(that);
    wx.getStorage({
      key: 'reverseStatus',
      success: function (res) {
        if (res.data == 'yes') {
          that.setData({
            reverseS: true
          })
        } else {
          that.setData({
            reverseS: false
          })
        }

      },
      fail: function (err) {
        that.setData({
          reverseS: false
        })
      }
    })
    order_id = options.order_id;

    that.fetchData(that);
    // fetch data
    // 获取数据
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
    let that = this;
    that.fetchData(that);
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