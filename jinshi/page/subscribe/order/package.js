// page/subscribe/order/package.js
const API = require('../../../api/api.js');
let that_;
let id = '';
let week = '';
let status = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    gif: '../../../image/loading.gif',
  },
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
  addCart: (e) => {
    let sku_id = e.currentTarget.dataset.sku;
    let spu_id = sku_id.split('-')[0];
    let options = {
      spu_id: spu_id,
      sku_id: sku_id,
      num: 1,
      price: e.currentTarget.dataset.price
    }
    API.addCart(options).then((resp) => {
      // 加入购物车成功
      wx.showToast({
        title: '已放入购物车',
      })
      wx.getStorage({
        key: 'cartMsg',
        success: function (res) {
          console.log(res.data)
          let newMsg = res.data;
          if (newMsg.length > 0) {
            for (var i = 0; i < newMsg.length; i++) {
              if (newMsg[i].spu_id === options.spu_id) {
                status = 1;
                newMsg[i].num = newMsg[i].num + 1;
                wx.setStorage({
                  key: 'cartMsg',
                  data: newMsg,
                })
                return;
              } else {
                status = 0
              }
            }
            if (status === 0) {
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
  receipt:()=>{
    wx.showModal({
      title: 'Hi!',
      content: '已经收到货了么!',
      showCancel: true,
      confirmColor: '#FF9080',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        API.subsPackageReceipt(id, week).then((resp) => {
          wx.showToast({
            title: '收货成功',
          })
          that_.fetchData();
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
  },
  logistic:()=>{
    wx.navigateTo({
      url: './logistic?id='+id+'&week='+week,
    })
  },
  fetchData: () => {
    if (id&&week) {
      API.getSubscribePackageDetail(id,week).then((resp) => {
        if (resp.status === 0) {
          resp.status = '未发货';
        } else if (resp.status === 1) {
          resp.status = '已发货';
        } else if(resp.status === 2){
          resp.status = '已完成';
        }else{
          resp.status = '已取消';
        }
        resp.createdAt = new Date(resp.createdAt).toLocaleString();
        that_.setData({
          order: resp,
          loading: false
        })
      })
    }
  },
  guessTap: (e) => {
    let goods_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?goods_id=' + goods_id,
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
    id = options.id;
    week = options.week;
    let that = this;
    that_ = this;
    that_.fetchData(); 
    that_.fetchGuess(that);
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