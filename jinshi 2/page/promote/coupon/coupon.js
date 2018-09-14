// page/promote/coupon/coupon.js
const API = require('../../../api/api.js');
let list = [];
let that_;
let status = 1;// 展示，-1是选择状态
let payment = 0;
let spu_list = [];

let skusList = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    use: true,
    unuse: false,
    loading:true
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
  // test:()=>{
  //   wx.navigateTo({
  //     url: './getCoupon?coupon_id=468f14e63ae348c79ac1cde44c088ab7',
  //   })
  // },
  goSelect:function(e){
    let pages = getCurrentPages();
    pages[pages.length-2].setCoupon(e.currentTarget.dataset.item);
    wx.navigateBack({
      
    })
  },
  back: function () {
    wx.navigateBack({

    })
  },
  fetchData:(that)=>{
    list = [];
    API.getCouponList().then((resp)=>{
      console.log("555",resp)
      wx.stopPullDownRefresh();
      if(resp.valid){
        list = resp.valid.Items;
        let list_ = resp.inactive.Items;
        let listA = [];
        let listB = [];
        for (let i = 0; i < list.length; i++) {
          let bImage = '';
          switch(i%3){
            case 0:
              bImage = 'https://cdn.jiyong365.com/%E4%BC%98%E6%83%A0%E5%88%B81.png'
              break
            case 1:
              bImage = 'https://cdn.jiyong365.com/%E4%BC%98%E6%83%A0%E5%88%B82.png';
              break
            case 2:
              bImage = 'https://cdn.jiyong365.com/%E4%BC%98%E6%83%A0%E5%88%B83.png';
              break
          }
          let item = {
            amount: list[i].price,
            condition: list[i].condition,
            price: '￥' + list[i].price,
            dl: '满' + list[i].condition + '减' + list[i].price,
            time: that.formatTime(list[i].activeAt, list[i].expiredAt),
            describe: list[i].information,
            code:list[i].code,
            status: 'OK',
            background:bImage,
            coupon_id:list[i].coupon_id,
            fit:list[i].fit
          }
          listA.push(item);
        }
        for (let i = 0; i < list_.length; i++) {
          let item = {
            price: '￥' + list_[i].price,
            dl: '满' + list_[i].condition + '减' + list_[i].price,
            time: that.formatTime(list_[i].activeAt, list_[i].expiredAt),
            describe: list_[i].information,
            background: 'https://cdn.jiyong365.com/%E4%BC%98%E6%83%A0%E5%88%B8%E7%BD%AE%E7%81%B0.png',
            status: 'NOT',
            activeAt: that.formatTime(list_[i].activeAt, list_[i].expiredAt).split('-')[0]
          }
          listB.push(item);
        }

        if(status > 0){
          listA = listA.concat(listB);
          that.setData({
            loading: false,
            uselist: listA
          })
        }else{
          // 选择状态，判断可以使用的优惠券
          let fitList = [];
          let price = payment;

          for (let i = 0; i < listA.length; i++) {
            if (listA[i].fit[0] === '*') {
              if (listA[i].amount < price && listA[i].condition <= price) {
                fitList.push(listA[i]);
              }
            } else {
              // 校验券是否可用
              for (let n = 0; n < listA[i].fit.length; n++) {
                for (let m = 0; m < spu_list.length; m++) {
                  if (listA[i].fit[n] === spu_list[m] && listA[i].amount < price && listA[i].condition <= price) {
                    let pris = 0;
                    for (let t = 0; t < skusList.length; t++) {
                      if (skusList[t].sku_id.split('-')[0] === spu_list[m]) {
                        pris = pris + skusList[t].price * skusList[t].num;
                      }
                    }
                    if (pris >= listA[i].condition){
                      fitList.push(listA[i]);
                    }
                  }
                }
              }
            }
          }
          that.setData({
            loading: false,
            uselist: fitList
          })
        }
      }else{
        that.setData({
          loading: false,
          uselist: []
        })
      }
    },(err)=>{
      if (err.error_code) {
        wx.showModal({
          title: 'Oops!',
          content: err.error_msg,
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#FD8075'
        })
      }
    })
  },
  formSubmit: (e)=>{
    // 提交form_id
    if(e.detail.formId){
      let tDate = Date.now() + 7 * 1000 * 60 * 60 * 24;
      let p = {
        form_id: e.detail.formId,
        quota: 1,
        expiredAt: tDate
      }
      API.addFormId(p).then((resp)=>{
      },(err)=>{
        console.error(err.message);
      })
    };
    // 校验优惠码
    if (e.detail.value.code) {
      API.exchangeCouponCode(e.detail.value.code).then((resp)=>{
        // 刷新页面
        list = [];
        that_.setData({
          loading: true
        })
        that_.fetchData(that_);
      },(err)=>{
        if(err.error_code){
          wx.showModal({
            title: 'Oops!',
            content: err.error_msg,
            showCancel: false,
            confirmText: '朕知道了',
            confirmColor: '#FD8075'
          })
        }
      })
    };
  },
  goUse: function(e){
    // 去使用
    // 进入一个包含可用商品的商品列表
    if(e.currentTarget.dataset.status){
      wx.showModal({
        title: '激活提醒',
        content: '该券将在' + e.currentTarget.dataset.status+'自动激活',
        showCancel: false,
        confirmText: '朕知道了',
        confirmColor: '#FD8075'
      })
    }else{
      if (e.currentTarget.dataset.fit === '*'){
        wx.redirectTo({
          url: '../../category/index',
        })
      }else{
        wx.navigateTo({
          url: '../valid-list/valid-list?coupon_id=' + e.currentTarget.dataset.coupon,
        })
      }
    }
  },
  use: function () {
    var that = this;
    that.setData({
      use: true,
      unuse: false
    })
  },
  unuse: function () {
    var that = this;
    that.setData({
      use: false,
      unuse: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    list = [];
    status = 1;// 展示，-1是选择状态
    payment = 0;
    spu_list = [];
    skusList = [];

    if(options.select){
      status = -1;
      payment = options.payment;

      if(options.direct){
        wx.getStorage({
          key: 'DselectCartSkus',
          success: function (res) {
            for (let i = 0; i < res.data.length; i++) {
              spu_list.push(res.data[i].sku_id.split('-')[0])
            }
          },
        })
      }else{
        wx.getStorage({
          key: 'selectCartSkus',
          success: function (res) {
            skusList = res.data;
            for (let i = 0; i < res.data.length; i++) {
              spu_list.push(res.data[i].spu_id)
            }
          },
        })
      }
    }

    let that = this;
    API.setPage(that);
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
    if(status > 0){
      that.setData({
        go:'去使用',
        status:status
      })
    }else{
      that.setData({
        go: '使用',
        status: status
      })
    }
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
    let that = this;
    that.fetchData(that);
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
    list = [];
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
  // onShareAppMessage: function () {

  // },
  formatTime: (ta, tb) => {
    let timeA = new Date(Number(ta));
    let timeB = new Date(Number(tb));
    let timeC;
    if (timeA.getMonth() + 1 < 10) {
      timeC = '0' + (timeA.getMonth() + 1);
    } else {
      timeC = timeA.getMonth() + 1;
    }

    let timeE;
    if (timeA.getDate()< 10) {
      timeE = '0' + (timeA.getDate() + 1);
    } else {
      timeE = timeA.getDate();
    }

    let timeD;
    if (timeB.getMonth() + 1 < 10) {
      timeD = '0' + (timeB.getMonth() + 1);
    } else {
      timeD = timeB.getMonth() + 1;
    }

    let timeF;
    if (timeB.getDate()< 10) {
      timeF = '0' + (timeB.getDate() + 1);
    } else {
      timeF = timeB.getDate();
    }
    return timeA.getFullYear() + '.' + timeC + '.' + timeE + '-' + timeB.getFullYear() + '.' + timeD + '.' + timeF;//'2018.03.08-2018.04.01',
  }
})