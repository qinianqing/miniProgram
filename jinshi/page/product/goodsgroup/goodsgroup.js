// page/product/goodsgroup/goodsgroup.js
const API = require('../../../api/api.js');

let group_id = '';
let that_;
let list = [];
let theFrom = 0;
let new_id;
// let dotList = [];
let title = '';
let couponId = '';
let shareImage = '';
let coupon_condition;
let coupon_price;
let cartList = [];
let cacl = {};
let status = 0;
let fit = [];
let limit = -1;

let coupon_num = -1;
let valid_num = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 100,
    loading: true,
    gif: '../../../image/loading.gif',
    autoplay: false,
    interval: 5000,
    duration: 200,
    circular: true,
    indicatorDots: true,
    //是否有优惠券
    haveCoupon: false,
    //优惠券信息
    coupon: {

    },
    //是否使用优惠券
    useCoupon: false,
    //购物车商品
    cart: {


    }
  },
  letLoginModalShow: function(f) {
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
  goReLogin: function(e) {
    let userInfo = e.detail;
    API.rebind(userInfo);
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
  //加入购物车
  addCart: function(e) {
    let parm = {
      spu_id: e.currentTarget.dataset.spu,
      sku_id: e.currentTarget.dataset.sku,
      num: 1,
      price: e.currentTarget.dataset.price
    }
    API.addCart(parm).then((resp) => {
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
      wx.getStorage({
        key: 'cartMsg',
        success: function(res) {

          let newMsg = res.data;
          if (newMsg.length > 0) {
            for (var i = 0; i < newMsg.length; i++) {
              if (newMsg[i].spu_id === parm.spu_id) {
                status = 1;
                newMsg[i].num = newMsg[i].num + 1;
                wx.setStorage({
                  key: 'cartMsg',
                  data: newMsg,
                  success:()=>{
                    that_.updateIndictor();
                  }
                })
                return;
              } else {
                status = 0
              }
            }
            if (status === 0) {
              newMsg.push(parm);
              wx.setStorage({
                key: 'cartMsg',
                data: newMsg,
                success: () => {
                  that_.updateIndictor();
                }
              })
            }
          } else {
            newMsg.push(parm);
            wx.setStorage({
              key: 'cartMsg',
              data: newMsg,
              success: () => {
                that_.updateIndictor();
              }
            })
          }
         
        },
      })

    }, (err) => {
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    })
  },
  //跳商品详情
  goGoods: function(e) {
    if (e.currentTarget.dataset.sku) {
      wx.navigateTo({
        url: '../goodsdetail/goodsdetail?sku_id=' + e.currentTarget.dataset.sku,
      })
    } else {
      wx.navigateTo({
        url: '../goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.spu,
      })
    }
  },
  godetailss: function(e) {
    let spu_id = e.currentTarget.id;
    let sku_id = e.currentTarget.dataset.sku;
    if (sku_id) {
      wx.navigateTo({
        url: '../goodsdetail/goodsdetail?sku_id=' + e.currentTarget.dataset.sku,
      })
    } else {
      wx.navigateTo({
        url: '../goodsdetail/goodsdetail?goods_id=' + e.currentTarget.id,
      })
    }

  },
  swiperChange: function(e) {
    var that = this;
    let index = parseInt(e.currentTarget.dataset.index);
  },
  //领取优惠券
  getCoupon: () => {
    API.getCouponByUser(couponId).then((resp) => {
      that_.getOneCouponNum(resp.coupon_id);
      wx.showToast({
        title: '领取成功',
      })
    }, (err) => {
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    })
  },
  // 更新指示条
  updateIndictor: () => {
    wx.getStorage({
      key: 'cartMsg',
      success: function (res) {
        cartList = res.data;
        if (!coupon_condition) {
          that_.getDetail();
        }
        if (fit[0] === '*') {
          let newCart = cartList;
          if (newCart.length > 0) {
            let head_nums = 0;
            let head_price = 0;
            for (var i = 0; i < newCart.length; i++) {
              head_nums += newCart[i].num;
              head_price += (Number(newCart[i].price) * newCart[i].num);
            }
            if (head_price > coupon_condition) {
              cacl = {
                num: head_nums,
                cp: -1,
                contain: coupon_price,
              }
            } else {
              cacl = {
                num: head_nums,
                cp: coupon_condition - head_price,
                contain: coupon_price,
              }
            }
          } else {
            cacl = {
              num: 0,
              cp: coupon_condition,
              contain: coupon_price,
            }
          }
          that_.setData({
            cart: cacl
          })
        } else {
          let newCart = [];
          for (var i = 0; i < fit.length; i++) {
            for (var j = 0; j < cartList.length; j++) {
              if (fit[i] === cartList[j].spu_id) {
                newCart.push(cartList[j]);
                break;
              }
            }
          }
          if (newCart.length > 0) {
            let head_nums = 0;
            let head_price = 0;
            for (var i = 0; i < newCart.length; i++) {
              head_nums += newCart[i].num;
              head_price += (Number(newCart[i].price) * newCart[i].num);
            }
            if (head_price > coupon_condition) {
              cacl = {
                num: head_nums,
                cp: -1,
                contain: coupon_price,
              }
            } else {
              cacl = {
                num: head_nums,
                cp: coupon_condition - head_price,
                contain: coupon_price,
              }
            }
          } else {
            cacl = {
              num: 0,
              cp: coupon_condition,
              contain: coupon_price,
            }
          }
          that_.setData({
            cart: cacl
          })
        }
      },
    })
  },
  // 得到具体数值
  getDetail: () => {
    API.getCouponTemplates(couponId).then((resp) => {
      coupon_condition = resp[0].condition;
      coupon_price = resp[0].price;
      limit = resp[0].limit;
      fit = resp[0].fit;
   
    
      if (resp[0].status === 'OK') {
        that_.updateIndictor();
        let couponMsg = {
          title: '优惠券',
          price: resp[0].price,
          full: `满${resp[0].condition}可用`,
          limit: '仅限本组商品使用'
        }
        if(valid_num>0){
          that_.setData({
            cc: coupon_condition,
            coupon: couponMsg,
            haveCoupon: true,
            loading: false,
            useCoupon: true
          })
        }else{
          that_.setData({
            cc: coupon_condition,
            coupon: couponMsg,
            haveCoupon: true,
            loading: false,
            useCoupon: false
          })
        }
      } else {
        that_.setData({
          useCoupon: false,
         
          haveCoupon: true,

        })
      }
    
      if(limit === coupon_num){
        if (valid_num > 0){
          that_.setData({
            haveCoupon: true,
            useCoupon: true,
            loading: false,
          })
        }else{
          that_.setData({
            haveCoupon: false,
            useCoupon: false,
            loading: false,
          })
        }
      }else{
        if (valid_num > 0) {
          that_.setData({
            haveCoupon: true,
            useCoupon: true,
            loading: false,
          })
        }else{
          that_.setData({
            haveCoupon: true,
            useCoupon: false,
            loading: false,
          })
        }
       
      }
    })
  },
  handleCouponNum: (cid)=>{
    API.getOneCouponNumber(cid).then((resp) => {
      coupon_num = resp.count;
      valid_num = resp.valid;
      if (valid_num > 0) {
        wx.getStorage({
          key: 'cartMsg',
          success: function (res) {
            cartList = res.data;
            if (!coupon_condition) {
              that_.getDetail();
            }
          },
        })
        that_.setData({
          useCoupon: true,
          loading: false,
          haveCoupon: true,
        })
      } else {
        that_.setData({
          useCoupon: false,
        
          haveCoupon: true,
        })
        that_.getDetail();
      }
    })
  },
  //得到某一类优惠券数量
  getOneCouponNum: (cid) => {
    let t = API.getToken();
    if (t){
      that_.handleCouponNum(cid);
    }else{
      setTimeout(()=>{
        that_.getOneCouponNum(cid);
      },200)
    }
  },
  //跳转购物车
  goCart: () => {
    wx.navigateTo({
      url: '../../cart/navcart',
    })
  },
  fetchData: () => {
    theFrom = list.length;
    if (group_id) {
      API.getGoodGroup(group_id, theFrom).then((resp) => {
        if (resp.coupon_id && resp.coupon_id != '-') {
          couponId = resp.coupon_id;
          that_.getOneCouponNum(couponId);
        } else {
          that_.setData({
            loading: false
          })
        }
        if (resp.share_image && resp.share_image !== '-'){
          shareImage = resp.share_image;
        }else{
          shareImage = '';
        }
        wx.stopPullDownRefresh();
        list = list.concat(resp.list);
        if (!resp.nextFrom) {
          theFrom = -1;
        }else{
          theFrom = resp.nextFrom;
        }
        if (group_id === '1524627377398') {
          resp.focus = '直连产地新鲜';
          resp.title = '锦时优鲜';
        }
        if (group_id === '1524627377397') {
          resp.focus = '本周新品';
          resp.title = '新品推荐';
        }
        title = resp.title;
        that_.setData({
          list: list,
          title: resp.title,
          describe: resp.describe,
          focus: resp.focus,
          cover: resp.cover,
        })
      }, (err) => {
        console.error(err.error_msg)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    cartList = [];
    fit = [];
    group_id = options.group_id;
    if (options.scene) {
      group_id = decodeURIComponent(options.scene);
    }
    that_ = this;
    coupon_condition = '';
    shareImage = '';
    API.setPage(that_);
    list = [];
    cacl = {};
    title = '';
    theFrom = 0;
    valid_num = -1;
    couponId = '';
    that_.fetchData();
    let that = this;
    wx.getStorage({
      key: 'iPhone',
      success: function(res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphone: true
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphone: false
          })
        }
      },
    })
    wx.getStorage({
      key: 'iPhoneX',
      success: function(res) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // dotList = [];
    if (couponId) {
     
      that_.getOneCouponNum(couponId);
      that_.updateIndictor();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    list = [];
    theFrom = 0;
    that_.fetchData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (theFrom > 0) {
      theFrom = list.length;
      that_.fetchData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: title,
      imageUrl: shareImage,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})