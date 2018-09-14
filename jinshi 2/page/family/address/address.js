// page/family/address/address.js
let that_;
let res = {

};
let create = false;
let province;
let city;
let county;
let R = [];
let index = [0,0,0];
let newIndex = [];

let regionM = {};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    create: false,
    init:false
  },
  inputName:(e)=>{
    res.userName = e.detail.value;
  },
  inputTel: (e)=>{
    res.telNumber = e.detail.value;
  },
  tapPick: ()=>{
    that_.setData({
      init: false
    })
  },
  bindRegionChange: (e)=>{
    newIndex = index;

    let changeC = e.detail.column;
    let changeI = e.detail.value;

    switch(changeC){
      case 0:
        if(changeI !== newIndex[0]){
          newIndex[0] = changeI;
          regionM.province = province[changeI];
          let a = that_.data.address;
          a.contact = res.userName;
          a.phone = res.telNumber;
          a.province = province[changeI];
          for (let i = 0; i < city.length; i++) {
            if (regionM.province === city[i].province) {
              R[1] = city[i].list;
              newIndex[1] = 0;
              regionM.city = city[i].list[0];
              a.city = city[i].list[0];
              break;
            }
          }
          for (let i = 0; i < county.length; i++) {
            if (regionM.city === county[i].city) {
              R[2] = county[i].list;
              newIndex[2] = 0;
              regionM.county = county[i].list[0];
              a.county = county[i].list[0];
              break;
            }
          }
          that_.setData({
            create: false,
            region:R,
            address:a,
            index:newIndex
          })
        }
      break;
      case 1:
        if(changeI !== newIndex[1]){
          newIndex[1] = changeI;
          regionM.city = R[1][changeI];
          let a = that_.data.address;
          a.contact = res.userName;
          a.phone = res.telNumber;
          a.city = R[1][changeI];
          for (let i = 0; i < county.length; i++) {
            if (regionM.city === county[i].city) {
              R[2] = county[i].list;
              newIndex[2] = 0;
              regionM.county = county[i].list[0];
              a.county = county[i].list[0];
              break;
            }
          }
          that_.setData({
            create:false,
            region: R,
            address: a,
            index:newIndex
          })
        }
      break;
      case 2:
        if (changeI !== newIndex[2]) {
          let a = that_.data.address;
          a.county = R[2][changeI];
          a.contact = res.userName;
          a.phone = res.telNumber;
          newIndex[2] = changeI;
          regionM.county = R[2][changeI]
          that_.setData({
            create: false,
            address:a,
            index:newIndex
          })
        }
      break;
    }
  },
  inputDetail: (e)=>{
    res.detailInfo = e.detail.value;
    let a = that_.data.address;
    a.address = e.detail.value;
    a.contact = res.userName;
    a.phone = res.telNumber;
    that_.setData({
      address:a
    })
  },
  confirm:()=>{
    if(that_.data.address){
    res.provinceName = that_.data.address.province;
    res.cityName = that_.data.address.city;
    res.countyName = that_.data.address.county;
    }
    if (res.userName) {
    } else {
      return wx.showModal({
        title: 'Oops!',
        content: '需要联系人',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    }
    if (res.detailInfo) {
    } else {
      return wx.showModal({
        title: 'Oops!',
        content: '需要街道信息',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    }
    if (res.provinceName && res.cityName && res.countyName) {
    } else {
      return wx.showModal({
        title: 'Oops!',
        content: '需要地区信息',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    }
    if (res.telNumber && res.telNumber.length === 11 && res.telNumber[0] === '1') {
    } else {
      return wx.showModal({
        title: 'Oops!',
        content: '手机号码不正确',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    }
    that_.done();
  },
  done:()=>{
    let pages = getCurrentPages();
    let lastP = pages[pages.length-2];
    lastP.setAddress(res);
    wx.navigateBack({
      
    })
  },
  back: function () {
    wx.navigateBack({

    })
  },
  setIndexCreate: ()=>{
    let changeI = 0;
    newIndex[0] = changeI;
    regionM.province = province[changeI];
    let a = {};
    a.province = province[changeI];
    R = [];
    R[0] = province;
    for (let i = 0; i < city.length; i++) {
      if (regionM.province === city[i].province) {
        R[1] = city[i].list;
        newIndex[1] = 0;
        regionM.city = city[i].list[0];
        a.city = city[i].list[0];
        break;
      }
    }
    for (let i = 0; i < county.length; i++) {
      if (regionM.city === county[i].city) {
        R[2] = county[i].list;
        newIndex[2] = 0;
        regionM.county = county[i].list[0];
        a.county = county[i].list[0];
        break;
      }
    }
    that_.setData({
      region: R,
      address: a,
      index: newIndex
    })
  },
  setIndex: ()=>{
    let proL = that_.data.address.province;
    let citL = that_.data.address.city;
    let couL = that_.data.address.county;
    R = [];
    R[0] = province;
    let pi = 0;
    let ci = 0;
    let ri = 0; 
    for(let i=0;i<province.length;i++){
      if(proL === province[i]){
        pi = i;
        break;
      }
    }
    for(let i = 0;i<city.length;i++){
      if(proL === city[i].province){
        R[1] = city[i].list;
        for (let t = 0; t < city[i].list.length; t++) {
          if(citL === city[i].list[t]){
            ci = t;
            break;
          }
        }
      }
    }
    for (let i = 0; i < county.length; i++) {
      if (citL === county[i].city) {
        R[2] = county[i].list;
        for (let t = 0; t < county[i].list.length; t++) {
          if (couL === county[i].list[t]) {
            ri = t;
            break;
          }
        }
      }
    }
    index = [pi, ci, ri];
    regionM = {
      province:R[0][pi],
      city:R[1][ci],
      county:R[2][ri]
    }
    that_.setData({
      region:R,
      index: index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that_ = this;
    create = false;
    if (options.create !== '0') {
      create = true;
      that.setData({
        create:true,
        init:true
      })
    }else{
      wx.getStorage({
        key: 'Address',
        success: function(resp) {
          that_.setData({
            address:resp.data
          });
          resp = resp.data;
          res.detailInfo = resp.address;
          res.userName = resp.contact;
          res.telNumber = resp.phone;
        },
      })
    }
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
      key: 'Region',
      success: function (res) {
        province = res.data.province;
        city = res.data.city;
        county = res.data.county;
        if (!create) {
          that_.setIndex()
        }else{
          that_.setIndexCreate()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})