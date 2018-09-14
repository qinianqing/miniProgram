// page/subscribe/calender/check.js
const API = require('../../../api/api.js');

let showOrder = 1;// 控制页面状态

let that_;
let f = [];
let family_id = '';
let selectWeek = '';

let list = [];

// 状态控制
let orderStatus = 0;// 0进行中 1已完成

let weekList = [{
  week: 's',
  alias: '本周送达',
  class: 'na'
}, {
  week: 'ss',
  alias: '下周送达',
  class: 'na'
}];

  let orderLastKey = '';
  let packageLastKey = '';

  let weekIndex = 10;// 保存时间选择器

  let weekArray = ['上十周', '上九周', '上八周', '上七周', '上六周', '上五周', '上四周', '上三周', '上二周', '上周', '选择周', '下周', '下二周', '下三周', '下四周', '下五周', '下六周', '下七周', '下八周', '下九周', '下十周'];// 时间数组

Page({

  /**
   * 页面的初始数据
   */
  data: {
    allSelectClass:'a',
    edSelectClass:'na',
    weekPickerClass:'na',
    weekIndex:10,
    weekArray:weekArray,
    weekList: [{
      week: 's',
      alias: '本周送达',
      class: 'na'
    }, {
      week: 'ss',
      alias: '下周送达',
      class: 'na'
    }]
  },
  back: function () {
    wx.navigateBack({

    })
  },
  familyClick:function(e){
    let index = e.currentTarget.dataset.index;
    index = Number(index);
    for (let i = 0; i < f.length; i++) {
      f[i].select = 0;
      f[i].show = 0;
    }
    f[index].select = 1;
    f[index].show = 1;
    family_id = f[index].family_id;
    // set header
    that_.setData({
      familyList:f,
    })
    that_.allClick();
  },
  // 全部订单
  allClick: function (e){
    for(let i=0;i<weekList.length;i++){
      weekList[i].class = 'na';
    }
    that_.fetchOrder(0);
    that_.setData({
      allSelectClass: 'a',
      edSelectClass: 'na',
      weekPickerClass: 'na',
      weekIndex: 10,
      weekArray: weekArray,
      weekList: weekList
    })
  },
  edClick: function (e) {
    for (let i = 0; i < weekList.length; i++) {
      weekList[i].class = 'na';
    }
    that_.fetchOrder(1);
    that_.setData({
      allSelectClass: 'na',
      edSelectClass: 'a',
      weekPickerClass: 'na',
      weekIndex: 10,
      weekArray: weekArray,
      weekList: weekList
    })
  },
  // 时间选择器
  bindWeekPick: function (e){
    let wIndex = Number(e.detail.value);
    let wwwIndex = 0;
    switch(wIndex){
      case 0:
        wwwIndex = -10;
      break;
      case 1:
        wwwIndex = -9;
        break;
      case 2:
        wwwIndex = -8;
        break;
      case 3:
        wwwIndex = -7;
        break;
      case 4:
        wwwIndex = -6;
        break;
      case 5:
        wwwIndex = -5;
        break;
      case 6:
        wwwIndex = -4;
        break;
      case 7:
        wwwIndex = -3;
        break;
      case 8:
        wwwIndex = -2;
        break;
      case 9:
        wwwIndex = -1;
        break;
      case 10:
        wwwIndex = 0;
      case 11:
        wwwIndex = 1;
        break;
      case 12:
        wwwIndex = 2;
        break;
      case 13:
        wwwIndex = 3;
        break;
      case 14:
        wwwIndex = 4;
        break;
      case 15:
        wwwIndex = 5;
        break;
      case 16:
        wwwIndex = 6;
        break;
      case 17:
        wwwIndex = 7;
        break;
      case 18:
        wwwIndex = 8;
        break;
      case 19:
        wwwIndex = 9;
        break;
      case 20:
        wwwIndex = 10;
        break;
    }
    selectWeek = that_.calWeekSign(wwwIndex);
    that_.fetchPackage(selectWeek);
    for (let i = 0; i < weekList.length; i++) {
      weekList[i].class = 'na';
    }
    that_.setData({
      allSelectClass: 'na',
      edSelectClass: 'na',
      weekPickerClass: 'a',
      weekIndex: wIndex,
      weekArray: weekArray,
      weekList: weekList
    })
  },
  // 选择周
  weekClick: function (e){
    let wIndex = Number(e.currentTarget.dataset.index);
    for (let i = 0; i < weekList.length; i++) {
      if(i === wIndex){
        weekList[i].class = 'a';
      }else{
        weekList[i].class = 'na';
      }
    }
    let wwwIndex = 0;
    switch(wIndex){
      case 0:
        wwwIndex = 0;
        break;
      case 1:
        wwwIndex = 1;
        break;
    }
    selectWeek = that_.calWeekSign(wwwIndex);
    that_.fetchPackage(selectWeek);
    that_.setData({
      allSelectClass: 'na',
      edSelectClass: 'na',
      weekPickerClass: 'na',
      weekIndex: 10,
      weekArray: weekArray,
      weekList: weekList
    })
  },
  // 计算周标记
  calWeekSign: (n) => {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    let oneday = 1000 * 60 * 60 * 24;
    let day = today.getDay();
    today = today.getTime();
    let mon;
    if (day) {
      mon = today - (day - 1) * oneday;
    } else {
      // 周日
      mon = today - 6 * oneday;
    }
    return String(mon + n * 7 * oneday)
  },
  // 获取数据
  fetchOrder: function (status){
    wx.showLoading({
      title: '加载中',
    })
    if(!orderLastKey){
      list = [];
    }
    API.getSubscribeOrderList(family_id,status,orderLastKey).then((resp)=>{
      wx.hideLoading();
      if (resp.LastEvaluatedKey){
        orderLastKey = resp.LastEvaluatedKey;
      }else{
        orderLastKey = '';
      }
      showOrder = 1;
      list = list.concat(resp.Items);
      that_.setData({
        list:list,
        showOrder:showOrder
      })
    })
  },
  fetchPackage: function (w){
    wx.showLoading({
      title: '加载中',
    })
    if (!packageLastKey) {
      list = [];
    }
    API.getSubscribePackageList(family_id,w,packageLastKey).then((resp)=>{
      wx.hideLoading();
      if (resp.LastEvaluatedKey) {
        packageLastKey = resp.LastEvaluatedKey;
      } else {
        packageLastKey = '';
      }
      showOrder = 0;
      list = list.concat(resp.Items);
      that_.setData({
        list: resp.Items,
        showOrder: showOrder
      })
    })
  },
  fetchFamilies: function (){
    let familyList = [];
    wx.getStorage({
      key: 'families',
      success: function(res) {
        familyList = res.data;
      },
      complete:()=>{
        if(familyList.length===0){
          API.getFamilylist().then((resp) => {
            familyList = resp.Items;
            if(familyList.length === 0){
              wx.showModal({
                title: 'Oops!',
                content: '您还没有家庭！',
                showCancel: false,
                confirmText: '去创建',
                confirmColor: '#FD8075',
                success:(resp)=>{
                  if(resp.confirm){
                    wx.redirectTo({
                      url: '../../family/create/create',
                    })
                  }
                }
              })
            }else{
              f = [];
              for (let i = 0; i < familyList.length; i++) {
                if (i === 0) {
                  f.push({
                    name: familyList[i].name,
                    family_id: familyList[i].family_id,
                    select: 1,
                    show: 1
                  })
                  family_id = familyList[i].family_id;
                } else {
                  f.push({
                    name: familyList[i].name,
                    family_id: familyList[i].family_id,
                    select: 0,
                    show: 0
                  })
                }
              }
              that_.fetchOrder(0);
              // that_.fetchPackage('1525622400000')
              that_.setData({
                familyList: f
              })
              wx.setStorage({
                key: 'families',
                data: resp.Items,
              })
            }
          })
        }else{
          f = [];
          for (let i = 0; i < familyList.length; i++) {
            if (i === 0) {
              f.push({
                name: familyList[i].name,
                family_id: familyList[i].family_id,
                select: 1,
                show: 1
              })
              family_id = familyList[i].family_id;
            } else {
              f.push({
                name: familyList[i].name,
                family_id: familyList[i].family_id,
                select: 0,
                show: 0
              })
            }
          }
          that_.fetchOrder(0);
          // that_.fetchPackage('1525622400000')
          that_.setData({
            familyList: f
          })
        }
      }
    })
  },
  goPackageDetail:(e)=>{
    wx.navigateTo({
      url: '../order/package?id=' + e.currentTarget.dataset.id + '&week=' + e.currentTarget.dataset.week,
    })
  },
  goOrderDetail:(e)=>{
    wx.navigateTo({
      url: '../order/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that_ = this;
    weekIndex = 10;
    let that = this;
    orderLastKey = '';
    packageLastKey = '';
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphonex: true,
            weekIndex : 10
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphonex: false,
            weekIndex: 10
          })
        }
      },
    })
    that_.fetchFamilies();
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
    if(showOrder){
      if(orderLastKey){
        that_.fetchOrder(orderStatus);
      }
    }else{
      if (packageLastKey) {
        that_.fetchPackage(selectWeek);
      }
    }
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }
})