// page/promote/coupon/getCoupon.js
let that_;
let background;
let o;
let pages;
const API = require('../../../api/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true
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
  couponTap: (e)=>{
    wx.showLoading({
      title: '领取中',
    })
    if(e.currentTarget.dataset.s === '领取'){
      API.getCouponByUser(e.currentTarget.id).then((resp)=>{
        wx.hideLoading();
        wx.showToast({
          title: '领取成功',
        })
      },(err)=>{
        wx.hideLoading();
        wx.showModal({
          title: 'Oops!',
          content: err.message,
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#FD8075'
        })
      })
    }
  },
  back:()=>{
    wx.navigateBack({
      delta: 1,
    })
  },
  backHome:()=>{
    wx.navigateTo({
      url: '../../index/indexs',
    })
  },
  fetchData:(that,coupons)=>{
    // 拉取优惠券
    API.getCouponTemplates(coupons).then((resp)=>{
      if(resp.length){
        background = 'https://cdn.jiyong365.com/%E8%83%8C%E6%99%AF%E5%9B%BE@2x.png';
        // 背景图将设置为第一张券的背景图
        for(let i=0;i<resp.length;i++){
          if (resp[i].background !== '-' && resp[i].background){
            background = resp[i].background;
            break;
          }
        }
        // 格式化数据
        let list = [];
        for (let i = 0; i < resp.length; i++) {
          let item = {};
          item.coupon_id = resp[i].coupon_id;
          if (resp[i].status === 'OK') {
            item.statusName = '领取';
            item.background = 'https://cdn.jiyong365.com/%E5%88%B8%E6%9C%89%E6%95%88.png';
          }else{
            item.statusName = '暂时不能领取';
            item.background = 'https://cdn.jiyong365.com/%E5%88%B8%E5%A4%B1%E6%95%88.png';
          }
          if(resp[i].fit[0] === '*'){
            item.fitInfo = '全品类,'
          }else{
            item.fitInfo = '指定商品,'
          }
          // 构建价格
          item.priceInfo = '满'+resp[i].condition+'可用';
          if(resp[i].mode === 'RANDOM'){
            item.price = '￥' + resp[i].price.split('&')[0] + '-' + resp[i].price.split('&')[1];
          }else{
            item.price = '￥'+resp[i].price;
          }
          list.push(item);
        }
        that.setData({
          list: list,
          background:background,
          loading:false
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    API.setPage(that);
    // 格式为coupon_id=xxxxxxxxx||yyyyyyyyyyyyyy
    // 如果为多张就只展现第一张
    o = options.coupon_id;
    if(options.coupon_id){
      let coupons = options.coupon_id.split('||');
      if(coupons.length){
        // 获取数据
        this.fetchData(this,coupons);
      }
    }
    let that = this;
    that_ = this;
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
    pages = getCurrentPages().length;
    if (pages === 1) {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/huidaoshouye.png'
      })
    } else {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/Group%20ss4.png'
      })
    }
    // 判断是不是首次送达
    // wx.getStorage({
    //   key: 'loginFromIndex',
    //   success: function (res) {
    //     if (res.data) {
    //       that.setData({
    //         navBack: 'https://cdn.jiyong365.com/%E8%BF%94%E5%9B%9E%E6%8C%89%E9%92%AE@2x.png'
    //       })
    //     } else {
    //       fromIndex = 0;
    //       that.setData({
    //         navBack: 'https://cdn.jiyong365.com/huidaoshouye.png'
    //       })
    //       wx.setStorage({
    //         key: 'loginFromIndex',
    //         data: 1,
    //       })
    //     }
    //   },
    // });

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
    return {
      title: '送你一张优惠券，离精致幸福感近一步',
      path: '/page/promote/coupon/getCoupon?coupon_id='+o,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})