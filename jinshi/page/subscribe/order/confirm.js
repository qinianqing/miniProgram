// page/subscribe/order/confirm.js
const API = require('../../../api/api.js');

let that_;

let id = '';

let num = 1;

// 实际地址
let address;
let family_id = '';

let skus = [];

// 周
let weeks = [];
let weeksS = [];
let weeksStr = '';

let stages = 0;

let vip = 0;

let limit = 0;

let freight = 0;

let province = '北京市';

let params = {}; // 下单参数

let f = {};

let d = {};

let total = 0;
let cashback = 0;

let list = [];

//创建家庭名字列表
let familylist = [];
let updatelist;

let familyall = [];

// 临时地址锁
let addressLock = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    freight:30,
    num:1,
    index: 0,
    timeIndex: 0,
    address: '',
    status: 100,
    use: true
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
  setWeeks:function (w) {
    weeks = w;
    weeksS = [];
    let oneday = 1000 * 60 * 60 * 24;
    for(let i=0;i<w.length;i++){
      let date = new Date(Number(w[i]));
      let tmps = date.getTime();
      tmps = tmps+5*oneday;
      date = new Date(tmps);
      let month = date.getMonth()+1;
      let dat = date.getDate();
      if(month<10){
        month = '0'+month
      }
      if (dat < 10) {
        dat = '0' + dat
      }
      weeksS.push(month+'-'+dat);
      if(i === 0){
        weeksStr = w[i];
      }else{
        weeksStr = weeksStr + '#' + w[i];
      }
    }
    that_.setData({
      weeks:weeksS
    })
  },
  selectWeeks: function (){
    wx.navigateTo({
      url: '../calender/calender?weeks='+weeksStr+'&limit='+stages,
    })
  },
  fetchPrice: function () {
    API.getSubOrderPrice(id,family_id,province,num).then((resp)=>{
      wx.hideLoading();
      if(vip === 1){
        that_.setData({
          freight: resp.freight,
          total: resp.vip_total,
          cashback: resp.total - resp.vip_total
        })
      }else{
        that_.setData({
          freight: resp.freight,
          total: resp.total,
          cashback: resp.total - resp.vip_total
        })
      }
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
        wx.showModal({
          title: '订阅订单支付成功!',
          content: '您可以在订阅日历中查看订阅计划',
          showCancel: false,
          confirmColor: '#FF9080',
          confirmText: '知道了',
          success:(resp)=>{
            if(resp.confirm){
              wx.redirectTo({
                url: '../calender/check',
              })
            }
          }
        })
       
      },
    })
  },
  pay: function () {
    // 构建参数
    if (!id) {
      wx.showModal({
        title: 'Oops!',
        content: '请确认订阅ID',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
      return;
    } 
    if (!province) {
      wx.showModal({
        title: 'Oops!',
        content: '请确认家庭地址',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
      return;
    }
    if (!family_id) {
      wx.showModal({
        title: 'Oops!',
        content: '至少选择一个家庭',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
      return;
    }
    if (weeks.length !== stages) {
      wx.showModal({
        title: 'Oops!',
        content: '请选择'+stages+'周',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
      return;
    }
    wx.showLoading({
      title: '创建中',
    })
    API.paySub(id,province,family_id,weeks,num).then((resp)=>{
      wx.hideLoading();
      that_.requestPay(resp);
    })
   
  },
  // 改变数量
  // 编辑状态行为
  minus: function (e) {
    if (that_.data.num > 1){
      wx.showLoading({
        title: '计算价格',
      })
      num = that_.data.num-1;
      that_.fetchPrice();
      that_.setData({
        num: that_.data.num-1
      })
    }
  },
  plus: function (e) {
    if (that_.data.num < limit) {
      num = that_.data.num + 1;
      wx.showLoading({
        title: '计算价格',
      })
      that_.fetchPrice();
      that_.setData({
        num: that_.data.num + 1
      })
    }else{
      wx.showToast({
        title: '最多可订'+limit+'件',
      })
    }
  },
  // 家庭中心
  goVipCenter: function (e) {
    wx.navigateTo({
      url: '../../user/vip/vip?family_id=' + family_id,
    })
   
  },
  // 选择送达家庭
  bindPickerChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value,
    })
    var indexS = e.detail.value;
    //选择临时地址，非会员状态，将创建的第一个家庭作为没更新的地址
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
    vip = familyall[indexS].vip;
    that_.fetchPrice();
    that.setData({
      address: address,
      status: familyall[indexS].vip,
      use: true,
      total: total,
    })
   
  },
  back: function () {
    wx.navigateBack({

    })
  },
  fetchFamilylist: function () {
    // 处理免邮券
    var that = this;
    wx.getStorage({
      key: 'families',
      success: function(res) {
        if (familylist) {
          familylist.splice(0, familylist.length);
        }
        familyall = res.data;
        for (var i = 0; i < familyall.length; i++) {
          familylist.push(familyall[i].name)
        }
        updatelist = familylist;

        let statusAddressSet;
        if (addressLock) {
          statusAddressSet = 400;
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
          vip = familyall[0].vip;
          that_.fetchPrice();
          statusAddressSet = familyall[0].vip;
        }
        that.setData({
          familylist: familylist,
          address: address,
          status: statusAddressSet,
          stages: stages
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;
    stages = Number(options.stages);
    limit = Number(options.limit);
    weeks = [];
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
    wx.getStorage({
      key: 'selectSubscribeSku',
      success: function (res) {
        list = res.data.list;
        that.setData({
          list: list,
        })

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
    // familylist.splice(0, familylist.length);
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    that.fetchFamilylist();
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
