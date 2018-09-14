// page/order/confirm.js
const API = require('../../api/api.js');

let that_;

let order_id = '';

// 这是临时地址
let laddress;
// 实际地址
let address;
let family_id = '-';

let skus = [];
let order_id_ = '';
let coupon_code = '';
let fsc_code = '';
let use_fsc_code = true;

let freight = 0;

let haveFsc = false;

let province = '北京市';
// 订单履约信息
let aging;
let handle = 1;

// 订单处理日，字符串
let arrivleDate = '';
let arrivelDay = '';

let params = {}; // 下单参数

let f = {};

let d = {};

let total = 0;
let cashback = 0;

let list = [];

//创建家庭名字列表
let familylist = [];

let familyall = [];
//是否有免邮券
let have = '';
let updatelist = [];
// 临时地址锁
let addressLock = 0;
//厂家直发
let isDerict = false;
let Dsku;
let Dnum;
//钱包余额
var balances;
//家庭余额
var familyBalances;
//优惠额
var couponBalances;
var Ftotal;
var Ctotal;
let onshowLock = false;
let useFscCode = false;
let payMoney = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    package: {
      has: true,
      time: '选择送达时间'
    },
    index: 0,
    timeIndex: 0,
    address: '',
    status: 100,
    use: true,
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
  fetchPriceDirect: function (that) {
    let sku = Dsku;
    let num = Dnum;
    // wx.showLoading({
    //   title: '加载中',
    // })
    let calTotal = Number((list[0].price * list[0].num).toFixed(2));
    let calCashback = Number((list[0].cashback * list[0].num).toFixed(2));
    let calWeight = list[0].weight * list[0].num;
    let calFre = calFreight(calWeight / 1000, province);

    payMoney = calTotal;
    that.fetchBestCoupon(calTotal);

    freight = calFre;
    d.crossedFee = calFre;
    total = calTotal;
    cashback = calCashback;

    d.fee = '￥' + calFre
    

    if (haveFsc) {
      if (freight) {
        let freF = {};
        if (payMoney > 99) {
          // 超过99，免邮费
          freF = {
            fee: 0,
            notice: '已享顺丰包邮'
          }
        } else {
          // 不超过99，看看是否是抵扣基础运费
          freF = {
            fee: freight > 10 ? '￥' + (freight - 10) : '￥0',
            notice: freight > 10 ? '邮券抵10元,再买' + (99 - payMoney).toFixed(2) + '顺丰包邮' : '再买' + (99 - payMoney).toFixed(2) + '，即享顺丰包邮'
          }
        }
        that.setData({
          use: true,
          deliveryFee: freF
        })
        that_.setPayment(couponBalances);
      } else {
        let freF = {};
        if (payMoney > 99) {
          // 超过99，免邮费
          freF = {
            fee: '￥0',
            notice: '使用邮券即享顺丰包邮'
          }
        } else {
          // 不超过99，看看是否是抵扣基础运费
          freF = {
            fee: '￥' + freight,
            notice: '再买' + (99 - payMoney).toFixed(2) + '，普通快递包邮'
          }
        }

        that.setData({
          use: false,
          deliveryFee: freF
        })
        that_.setPayment(couponBalances);
      }
    }
  },
  //获得个人钱包余额
  fetchBancel: function () {
    API.getUserWalletBalance().then((blance) => {
      balances = blance;
    })
  },
  //获得家庭余额
  fetchFamilyBancel: function (family_id) {
    if (family_id) {
      API.getFamilyWalletBalance(family_id).then((resp) => {
        familyBalances = resp;
      })
    } else {
      familyBalances = 0;
    }
  },
  fetchPrice: function (that) {
    // 获取购物车总价
    // 拼凑参数获取购物车总价和运费
    let reqItemss = [];
    // for (let i = 0; i < list.length; i++) {
    //   reqItemss.push(list[i].id);
    // }
    let calTotal = 0;
    let calWeight = 0;
    let calCashback = 0;
    for (let i = 0; i < list.length; i++) {
      reqItemss.push(list[i].id);

      calTotal = Number((list[i].price * list[i].num + calTotal).toFixed(2));
      calWeight = list[i].weight * list[i].num + calWeight;
      calCashback = Number((list[i].cashback * list[i].num + calCashback).toFixed(2));
    }
    let calFre = 0;
    if (province) {
      calFre = calFreight(calWeight / 1000, province);
    }
    params.items = reqItemss;
    // wx.showLoading({
    //   title: '加载中',
    // })

    payMoney = calTotal;
    that.fetchBestCoupon(calTotal);

    freight = calFre;
    d.crossedFee = calFre;
    total = calTotal;
    cashback = calCashback;
    d.fee = '￥' + calFre
    // if (calFre) {
    //   d.fee = '￥' + calFre
    // } else {
    //   d.fee = '未确定目的地';
    // }

    if(haveFsc){
      if(freight){
        let freF = {};
        if (payMoney > 99) {
          // 超过99，免邮费
          freF = {
            fee: 0,
            notice: '已享顺丰包邮'
          }
        } else {
          // 不超过99，看看是否是抵扣基础运费
          freF = {
            fee: freight > 10 ? '￥' + (freight - 10) : '￥0',
            notice: freight > 10 ? '邮券抵10元,再买' + (99 - payMoney).toFixed(2) + '顺丰包邮' : '再买' + (99 - payMoney).toFixed(2) + '，即享顺丰包邮'
          }
        }
        that.setData({
          use: true,
          deliveryFee: freF
        })
        that_.setPayment(couponBalances);
      }else{
        let freF = {};
        if (payMoney > 99) {
          // 超过99，免邮费
          freF = {
            fee: '￥0',
            notice: '使用邮券即享顺丰包邮'
          }
        } else {
          // 不超过99，看看是否是抵扣基础运费
          freF = {
            fee: '￥' + freight,
            notice: '再买' + (99 - payMoney).toFixed(2) + '，普通快递包邮'
          }
        }

        that.setData({
          use: false,
          deliveryFee: freF
        })
        that_.setPayment(couponBalances);
      }
    }else{
      let freF = {};
      if (payMoney > 99) {
        // 超过99，免邮费
        freF = {
          fee: '￥0',
          notice: '会员家庭使用邮券即享顺丰包邮'
        }
      } else {
        // 不超过99，看看是否是抵扣基础运费
        freF = {
          fee: '￥' + freight,
          notice: '再买' + (99 - payMoney).toFixed(2) + '，普通快递包邮'
        }
      }

      that.setData({
        use: false,
        deliveryFee: freF
      })
      that_.setPayment(couponBalances);
    }
  },
  direct: function (options) {
    API.directGoods(options).then((resp) => {
      // 发起支付
      if (resp) {
        order_id_ = resp.order_id;
        // 清空本地存储
        wx.setStorage({
          key: 'DselectCartSkus',
          data: [],
        })
        // 发起支付
        API.pay(order_id_).then((respp) => {
          wx.hideLoading();
          if (!respp.all_balance) {
            // 未能全能抵扣
            that_.requestPay(respp.payload);
          } else {
            // 全额抵扣
            wx.showModal({
              title: 'Oops!',
              content: '你的订单可由余额全部抵扣，还需支付1分钱确认身份',
              showCancel: false,
              confirmColor: '#FF9080',
              confirmText: '知道了',
              success: (resssss) => {
                if (resssss.confirm) {
                  that_.requestPay(respp.payload);
                }

              }
            })
          }
        }, (err) => {
          console.error(err.message);
          wx.hideLoading();
          wx.showModal({
            title: 'Oops!',
            content: err.error_msg,
            showCancel: false,
            confirmColor: '#FF9080',
            confirmText: '知道了'
          })
        })
      }
    }, (err) => {
      console.error(err.error_msg);
      wx.hideLoading();
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    })
  },
  requestPay: (respp) => {
    wx.requestPayment({
      timeStamp: respp.timeStamp,
      nonceStr: respp.nonceStr,
      package: respp.package,
      signType: respp.signType,
      paySign: respp.paySign,
      success: (res) => {
        // 支付成功跳转
        wx.redirectTo({
          url: './payresult/payresult?order_id=' + order_id_,
        })
      },
    })
  },
  pay: function () {
    var that = this;
    params.arrival_date = arrivleDate;
    // 构建参数
    if (family_id === '-' || !family_id) {
      params.province = laddress.province;
      params.city = laddress.city;
      params.county = laddress.county;
      params.address = laddress.address;
      params.contact = laddress.user_name;
      params.phone = laddress.tel;
    } else {
      params.province = address.province;
      params.city = address.city;
      params.county = address.county;
      params.address = address.address;
      params.contact = address.user_name;
      params.phone = address.tel;
    }
    if (!params.province || !params.city || !params.county || !params.address || !params.contact || !params.phone || params.province === '省份') {
      wx.showModal({
        title: 'Oops!',
        content: '请确认地址信息',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
      return;
    }
    params.coupon_code = coupon_code;
    params.family_id = family_id;

    if (useFscCode) {
      params.fsc_code = fsc_code;
    } else {
      params.fsc_code = '';
    }
    if (params.phone) {
      // 发起支付
      // 三个阶段
      // 创建订单
      if (!order_id_) {
        // 没有订单号，创建订单，再支付
        wx.showLoading({
          title: '订单创建中',
        })
        if (!use_fsc_code) {
          params.fsc_code = undefined;
        }

        let options = {
          family_id: params.family_id,
          arrival_date: params.arrival_date,
          fsc_code: params.fsc_code,
          coupon_code: params.coupon_code,
          items: params.items,
          province: params.province,
          city: params.city,
          county: params.county,
          address: params.address,
          contact: params.contact,
          phone: params.phone,
          sku: Dsku || '',
          num: Dnum || ''
        }
        if (isDerict) {
          that.direct(options);
        } else {
          API.createOrder(options).then((resp) => {
            // 发起支付
            if (resp) {
              order_id_ = resp.order_id;
              // 清空本地存储
              wx.setStorage({
                key: 'selectCartSkus',
                data: [],
              })
              // 发起支付
              API.pay(order_id_).then((respp) => {
                wx.hideLoading();
                that_.requestPay(respp.payload);
                // if (!respp.all_balance) {
                //   // 未能全能抵扣
                //   that_.requestPay(respp.payload);
                // } else {
                //   // 全额抵扣
                //   wx.showModal({
                //     title: 'Oops!',
                //     content: '你的订单可由余额全部抵扣，还需支付1分钱确认身份',
                //     showCancel: false,
                //     confirmColor: '#FF9080',
                //     confirmText: '知道了',
                //     success: (resssss) => {
                //       if (resssss.confirm) {
                //         that_.requestPay(respp.payload);
                //       }

                //     }
                //   })
                // }
              }, (err) => {
                console.error(err.message);
                wx.hideLoading();
                wx.showModal({
                  title: 'Oops!',
                  content: err.error_msg,
                  showCancel: false,
                  confirmColor: '#FF9080',
                  confirmText: '知道了'
                })
              })
            }
          }, (err) => {
            console.error(err.error_msg);
            wx.hideLoading();
            wx.showModal({
              title: 'Oops!',
              content: err.error_msg,
              showCancel: false,
              confirmColor: '#FF9080',
              confirmText: '知道了'
            })
          })
        }
      } else {
        // 有order_id直接发起支付
        // order_id_ = order_id;
        // 发起支付
        API.pay(order_id_).then((respp) => {
          if (respp) {
            that_.requestPay(respp.payload);
          } else {
            console.error(err.message);
            wx.showModal({
              title: 'Oops!',
              content: err.error_msg,
              showCancel: false,
              confirmColor: '#FF9080',
              confirmText: '知道了'
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
    } else {
      wx.showModal({
        title: 'Oops!',
        content: '请确认地址信息',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    }
  },
  // 优惠券相关方法
  setCoupon: (coupon) => {
    // 用户自行选择优惠券，回调
    // 注意订单列表页应展现订单可用优惠券
    coupon_code = coupon.code;
    onshowLock = true;
    setTimeout(() => {
      onshowLock = false;
    }, 1500)
    that_.setData({
      dl: coupon.dl
    })
    that_.setPayment(coupon.amount)
  },
  selectCoupon: function () {
    if (isDerict){
      wx.navigateTo({
        url: '../promote/coupon/coupon?select=1&payment=' + payMoney+'&direct=1',
      })
    }else{
      wx.navigateTo({
        url: '../promote/coupon/coupon?select=1&payment=' + payMoney,
      })
    }
  },
  setPayment: (couponBalances) => {
    if (useFscCode) {
      // 更新页面变量
      Ftotal = balances + familyBalances;
      Ctotal = total - Ftotal - couponBalances;
      if (Ctotal > 0) {
        that_.setData({
          total: (Math.round((Ctotal) * 100)) / 100,
          // deliveryFee: d,
          cashback: cashback,
          Cpay: (Ftotal).toFixed(2)
        })
      } else {
        that_.setData({
          total: 0.01,
          // deliveryFee: d,
          cashback: cashback,
          Cpay: (total - couponBalances - 0.01).toFixed(2)
        })
      }
    } else {
      // 更新页面变量
      Ftotal = balances + familyBalances;
      if(payMoney>99){
        Ctotal = total - Ftotal - couponBalances;
      }else{
        Ctotal = total + freight - Ftotal - couponBalances;
      }
      if (Ctotal > 0) {
        that_.setData({
          total: (Math.round(Ctotal * 100)) / 100,
          // deliveryFee: d,
          cashback: cashback,
          Cpay: (Ftotal).toFixed(2)
        })
      } else {
        if(payMoney>99){
          that_.setData({
            total: 0.01,
            // deliveryFee: d,
            cashback: cashback,
            Cpay: (total - couponBalances - 0.01).toFixed(2)
          })
        }else{
          that_.setData({
            total: 0.01,
            // deliveryFee: d,
            cashback: cashback,
            Cpay: (total + freight - couponBalances - 0.01).toFixed(2)
          })
        }
      }
    }
  },
  // 计算最佳可用优惠券，改为本地计算
  fetchBestCoupon: function (payment) {
    var that = this;
    if (order_id) {
      order_id = '';
    }
    let skuss = [];
    for (let i = 0; i < list.length; i++) {
      skuss.push({
        sku_id: list[i].sku_id,
        price: list[i].price,
        num: list[i].num
      });
    }
    API.getBestCoupon(payment, skuss).then((resp) => {
      if (resp.code) {
        coupon_code = resp.code;
        couponBalances = resp.price;
        that_.setData({
          dl: '满' + resp.condition + '减' + resp.price
        })
      } else {
        couponBalances = 0;
        that_.setData({
          dl: '无可用'
        })
      }
      wx.hideLoading();
      that_.setPayment(couponBalances);
    })
  },
  // 计算送达日期
  setArrivalData: function () {
    if (province === '省份') {
      province = '北京市';
    }
    let today = new Date();
    let pAging = aging[province];
    // 下午3点之后就在加一天
    if (today.getHours() >= 15) {
      handle = handle++;
    }
    pAging = pAging + handle;
    today = today.getTime();
    let targetTime = today + 60 * 60 * 1000 * 24 * (pAging);
    let targetD = new Date(targetTime);
    let targetY = targetD.getFullYear();
    let targetM = targetD.getMonth() + 1;
    let targetDate = targetD.getDate();
    let targetDay = targetD.getDay();
    arrivleDate = targetY + '-' + targetM + '-' + targetDate;
    let arrivelDay;

    switch (targetDay) {
      case 0:
        arrivelDay = '周日（' + targetDate + '号）'
        break;
      case 1:
        arrivelDay = '周一（' + targetDate + '号）'
        break;
      case 2:
        arrivelDay = '周二（' + targetDate + '号）'
        break;
      case 3:
        arrivelDay = '周三（' + targetDate + '号）'
        break;
      case 4:
        arrivelDay = '周四（' + targetDate + '号）'
        break;
      case 5:
        arrivelDay = '周五（' + targetDate + '号）'
        break;
      case 6:
        arrivelDay = '周六（' + targetDate + '号）'
        break;
    }
    this.setData({
      arrivel_date: arrivelDay
    })
  },
  //判断是否有免邮券
  getFscCode: (family_id) => {
    API.getFscList(family_id).then((resp) => {
      if (resp.valid) {
        if (resp.valid.Items.length == 0) {
          fsc_code = '';
          useFscCode = false;
          haveFsc = false;
          that_.setData({
            have: false
          })
        } else {
          useFscCode = true;
          fsc_code = resp.valid.Items[0].code;
          haveFsc = true;
          that_.setData({
            have: true
          })
        }
      } else {
        useFscCode = false;
        fsc_code = '';
        haveFsc = false;
        that_.setData({
          have: false
        })
      }
      if (isDerict) {
        that_.fetchPriceDirect(that_);
      } else {
        that_.fetchPrice(that_);
      }

    })
  },
  goCreateFamily: function (e) {
    if (familylist.length === 4){
      wx.navigateTo({
        url: '../user/vip/vip?family_id=' + family_id,
      })
    }else{
      wx.navigateTo({
        url: '../family/create/create',
      })
    }
  },
  goVipCenter: function (e) {
    wx.navigateTo({
      url: '../user/vip/vip?family_id=' + family_id,
    })
  },
  // 选择送达家庭
  bindPickerChange: function (e) {
    var that = this;
    if (order_id) {
      order_id = '';

    }
    that.setData({
      index: e.detail.value,
    })
    var indexS = e.detail.value;
    //选择临时地址，非会员状态，将创建的第一个家庭作为没更新的地址
    if (e.detail.value == familylist.length - 1) {
      family_id = '-';
      laddress = {
        province: familyall[familylist.length - 1].province,
        city: familyall[familylist.length - 1].city,
        county: familyall[familylist.length - 1].county,
        address: familyall[familylist.length - 1].address,
        user_name: familyall[familylist.length - 1].user_name,
        tel: familyall[familylist.length - 1].tel
      }
      province = familyall[familylist.length - 1].province || '北京市';
      that.setData({
        laddress: laddress,
        status: 400,
        have: false,
        use: false,
        total: total + freight
      })
      that.setArrivalData();
      fsc_code = '';
      useFscCode = false;
      haveFsc = false;
      that_.setPayment(couponBalances);
      if (isDerict) {
        that_.fetchPriceDirect(that_);
      } else {
        that_.fetchPrice(that_);
      }
    } else {
      family_id = familyall[indexS].family_id;
      address = {
        province: familyall[indexS].province,
        city: familyall[indexS].city,
        county: familyall[indexS].county,
        address: familyall[indexS].address,
        user_name: familyall[indexS].contact,
        tel: familyall[indexS].phone
      }
      province = familyall[indexS].province;
      that.setData({
        address: address,
        status: familyall[indexS].vip,
        use: true,
        total: total,
      })
      that.setArrivalData();
      that.getFscCode(family_id);
      that.fetchFamilyBancel(family_id);
      that_.setPayment(couponBalances);
    }
  },
  updateAddress: function () {
    var that = this;
    addressLock = 1;
    wx.chooseAddress({
      success: function (res) {
        laddress = {
          province: res.provinceName,
          city: res.cityName,
          county: res.countyName,
          address: res.detailInfo,
          user_name: res.userName,
          tel: res.telNumber
        }
        familyall[familyall.length - 1] = laddress;
        family_id = '-';
        if (res.provinceName){
          province = res.provinceName;
        }
        if (isDerict) {
          that_.fetchPriceDirect(that_);
        } else {
          that_.fetchPrice(that_);
        }
        that.setArrivalData();
        that.setData({
          laddress: laddress,
        })
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();

        if (res.errMsg == 'chooseAddress:fail cancel' || res.errMsg == 'chooseAddress:cancel') {
          // wx.hideLoading();
        }

      },
      complete: () => {
        wx.hideLoading();
      }
    })

  },
  arrivetime: function (e) {
    this.setData({
      timeIndex: e.detail.value
    })
  },
  isUse: function (e) {
    if (order_id) {
      order_id = '';
    }
    var that = this;
    if (this.data.use == false) {
      // 使用免邮券，抵扣10元
      use_fsc_code = true;
      useFscCode = true;

      let freF = {};
      if (payMoney > 99) {
        // 超过99，免邮费
        freF = {
          fee:0,
          notice:'已享顺丰包邮'
        }
      } else {
        // 不超过99，看看是否是抵扣基础运费
        freF = {
          fee: freight > 10 ? '￥'+(freight - 10) : '￥0',
          notice: freight > 10 ? '邮券抵10元,再买'+(99 - payMoney)+'顺丰包邮' : '再买' + (99 - payMoney) + '，即享顺丰包邮'
        }
      }
      that.setData({
        use: true,
        deliveryFee: freF
      })
      that_.setPayment(couponBalances);
    } else {
      // 不使用免邮券
      use_fsc_code = false;
      useFscCode = false;

      let freF = {};
      if (payMoney > 99) {
        // 超过99，免邮费
        freF = {
          fee: '￥0',
          notice: '使用邮券即享顺丰包邮'
        }
      } else {
        // 不超过99，看看是否是抵扣基础运费
        freF = {
          fee: '￥'+freight,
          notice: '再买' + (99 - payMoney).toFixed(2) + '，普通快递包邮'
        }
      }

      that.setData({
        use: false,
        deliveryFee: freF
      })
      that_.setPayment(couponBalances);
    }
  },
  back: function () {
    wx.navigateBack({

    })
  },
  fetchFamilylist: function () {
    // 处理免邮券
    var that = this;
    API.getFamilylist().then((resp) => {
      if (familylist) {
        familylist.splice(0, familylist.length);
      }
      familyall = resp.Items;
      for (var i = 0; i < familyall.length; i++) {
        familylist.push(familyall[i].name)
      }
      familylist.push("临时地址")
      updatelist = familylist;
      if (!laddress) {
        laddress = {
          province: '省份',
          city: '城市',
          county: '地区',
          address: '详细地址',
          user_name: '点击编辑地址',
          tel: ''
        }
      } else {
        laddress = laddress
      }
      familyall.push(laddress);
      if (familylist.length === 1) {
        family_id = '';
        if (laddress.tel == '') {
          laddress = {
            province: '省份',
            city: '城市',
            county: '地区',
            address: '详细地址',
            user_name: '点击编辑地址',
            tel: ''
          }
        } else {
          laddress = laddress
        }
        province = '北京市';
        fsc_code = '';
        that.setData({
          familylist: familylist,
          laddress: laddress,
          status: 400,
          have: false
        })
        if (isDerict) {
          that_.fetchPriceDirect(that_);
        } else {
          that_.fetchPrice(that_);
        }

      } else {
        let statusAddressSet;
        let freequan;
        if (addressLock) {
          statusAddressSet = 400;
          freequan = false;
          addressLock = 0;
        } else {
          address = {
            province: familyall[0].province,
            city: familyall[0].city,
            county: familyall[0].county,
            address: familyall[0].address,
            user_name: familyall[0].contact,
            tel: familyall[0].phone
          }
          province = familyall[0].province
          family_id = familyall[0].family_id;
          statusAddressSet = familyall[0].vip;
          that.getFscCode(family_id);
          that.fetchFamilyBancel(family_id);
          freequan = true;
        }
        that.setData({
          familylist: familylist,
          address: address,
          status: statusAddressSet,
          have: freequan
        })
      }
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    order_id = '';
    family_id = '';
    skus = [];
    order_id_ = '';
    coupon_code = '';
    fsc_code = '';
    use_fsc_code = true;
    province = '北京市';
    params = {};
    isDerict = false;
    onshowLock = false;
    useFscCode = false;
    payMoney = 0;
    haveFsc = false;

    let freight = 0;
    if (options.isDirect) {
      isDerict = true;
      Dsku = options.sku_id;
      Dnum = options.num;
    } else {
      isDerict = false
    }
    order_id = options.order_id;
    var that = this;
    that_ = this;
    API.setPage(that);
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
    // 获取订单履约信息
    wx.getStorage({
      key: 'aging',
      success: function (res) {
        aging = res.data.aging;
        handle = res.data.handle;
        that.setArrivalData();
      },
    })
    if (isDerict) {
      wx.getStorage({
        key: 'DselectCartSkus',
        success: function (res) {
          list = res.data;
          that.setData({
            list: list,
            showPackageChangeAlert: false
          })

        },
      });
    } else {
      wx.getStorage({
        key: 'selectCartSkus',
        success: function (res) {
          list = res.data;
          that.setData({
            list: list,
            showPackageChangeAlert: false
          })

        },
      });
    }
    that.fetchBancel();
  },

  //个人中心
  goK: function () {
    wx.navigateTo({
      url: '../user/customer-service/customer-service',
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
    wx.hideLoading();
    // familylist.splice(0, familylist.length);
    if (!onshowLock) {
      var that = this;
      // wx.showLoading({
      //   title: '加载中',
      // })
      if(that.data.status !== 400){
        that.fetchFamilylist();
        fsc_code = '';
      }
    }
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

  // },
})

const packageFee = 2;

let calFreight = (weight, prov) => {
  if (prov) {
    if (weight) {
      switch (province) {
        case '北京市':
          return 7;
          // if (weight <= 1) {
          //   return 10;
          // } else {
          //   return (Math.ceil(weight) - 1) * 2 + 10 + packageFee
          // }
          break;
        case '天津市':
          return 8;
          // if (weight <= 1) {
          //   return 12;
          // } else {
          //   return (Math.ceil(weight) - 1) * 2 + 12 + packageFee
          // }
          break;
        case '河北省':
          return 8;
          // if (weight <= 1) {
          //   return 12;
          // } else {
          //   return (Math.ceil(weight) - 1) * 2 + 12 + packageFee
          // }
          break;

        case '山西省':
          return 10;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '山东省':
          return 10;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '内蒙古自治区':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '河南省':
          return 10;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '江苏省':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '浙江省':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '上海市':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '辽宁省':
          return 10;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 8 + 18 + packageFee
          // }
          break;
        case '陕西省':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '宁夏回族自治区':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '湖北省':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '安徽省':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '湖南省':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '吉林省':
          return 11;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '黑龙江省':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '甘肃省':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '福建省':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '四川省':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '重庆市':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '江西省':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '广东省':
          return 12;
          // if (weight <= 1) {
          //   return 18;
          // } else {
          //   return (Math.ceil(weight) - 1) * 10 + 18 + packageFee
          // }
          break;
        case '青海省':
          return 12;
          // if (weight <= 1) {
          //   return 20;
          // } else {
          //   return (Math.ceil(weight) - 1) * 12 + 20 + packageFee
          // }
          break;
        case '海南省':
          return 13;
          // if (weight <= 1) {
          //   return 20;
          // } else {
          //   return (Math.ceil(weight) - 1) * 12 + 20 + packageFee
          // }
          break;
        case '云南省':
          return 13;
          // if (weight <= 1) {
          //   return 20;
          // } else {
          //   return (Math.ceil(weight) - 1) * 12 + 20 + packageFee
          // }
          break;
        case '贵州省':
          return 12;
          // if (weight <= 1) {
          //   return 20;
          // } else {
          //   return (Math.ceil(weight) - 1) * 12 + 20 + packageFee
          // }
          break;
        case '广西壮族自治区':
          return 12;
          // if (weight <= 1) {
          //   return 20;
          // } else {
          //   return (Math.ceil(weight) - 1) * 12 + 20 + packageFee
          // }
          break;
        case '新疆维吾尔自治区':
          return 17;
          // if (weight <= 1) {
          //   return 23;
          // } else {
          //   return (Math.ceil(weight) - 1) * 16 + 23 + packageFee
          // }
          break;
        case '西藏自治区':
          return 17;
          // if (weight <= 1) {
          //   return 23;
          // } else {
          //   return (Math.ceil(weight) - 1) * 16 + 23 + packageFee
          // }
          break;
        default:
          return new Error('other province is not supported')
          break;
      }
    } else {
      return 0;
    }
  } else {
    return new Error('province is needed');
  }
}