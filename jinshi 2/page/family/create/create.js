// page/category/level2/level2.js
const API = require('../../../api/api.js');

let that_;

var params = {
  members: {
    father: false,
    mother: false,
    man: false,
    woman: false
  }
};

var father = false;
var mother = false;
var husband = false;
var wife = false;

let source = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goCreate: function () {
    // 创建信息
    if (!params.address || !params.contact || !params.province || !params.city || !params.county || !params.phone) {
      return wx.showModal({
        title: 'Oops!',
        content: '您的家庭需要一个地址',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了',
        success: function (res) {

        }
      })
    }
    if (!params.members.father && !params.members.mother && !params.members.man && !params.members.woman) {
      return wx.showModal({
        title: 'Oops!',
        content: '您的家庭至少要有一个成员',
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了',
        success: function (res) {

        }
      })
    }
    wx.showLoading({
      title: '家庭创建中',
    })
    API.createFamily(params).then((resp) => {
      // 获取用户是否试用过
      let fid = resp;
      API.isUserTried().then((resp) => {
        if (!resp.tried) {
          // 没有试用过
          API.tryMember(fid).then((resp) => {
            that_.setData({
              showTryModal: 1
            })
          })
        } else {
          wx.navigateBack({

          })
        }
      })
      if (source === 'cbc') {
        let pages = getCurrentPages();
        pages[pages.length - 2].setInitFamily(fid);
        wx.navigateBack({

        })
      }
      API.getFamilylist().then((resp) => {
        wx.setStorage({
          key: 'families',
          data: resp.Items,
          complete: () => {
            wx.hideLoading();
          }
        })
      })
    })
  },
  backTo: function () {
    wx.navigateBack({

    })
  },
  father: function (e) {
    var that = this;
    if (that.data.father == false) {
      that.setData({
        father: true
      })
      params.members.father = true;

    } else {
      that.setData({
        father: false
      })
      params.members.father = false;
    }

  },
  mother: function () {
    var that = this;
    if (that.data.mother == false) {
      that.setData({
        mother: true
      })
      params.members.mother = true;
    } else {
      that.setData({
        mother: false
      })
      params.members.mother = false;
    }

  },
  husband: function () {
    var that = this;
    if (that.data.husband == false) {
      that.setData({
        husband: true
      })
      params.members.man = true;
    } else {
      that.setData({
        husband: false
      })
      params.members.man = false;
    }

  },
  wife: function () {
    var that = this;
    if (that.data.wife == false) {
      that.setData({
        wife: true
      })
      params.members.woman = true;
    } else {
      that.setData({
        wife: false
      })
      params.members.woman = false;
    }

  },
  back: function () {
    wx.navigateBack({

    })
  },
  setAddress: (res) => {
    params = {
      address: res.detailInfo,
      contact: res.userName,
      province: res.provinceName,
      city: res.cityName,
      county: res.countyName,
      phone: res.telNumber,
      remark: res.remark || ''
    }
    params.members = {
      father: false,
      mother: false,
      man: false,
      woman: false
    }
    that_.setData({
      userName: res.userName,
      telNumber: res.telNumber,
      provinceName: res.provinceName,
      cityName: res.cityName,
      countyName: res.countyName,
      detailInfo: res.detailInfo,
    })
  },
  familyMessage: function () {
    var that = this;
    wx.navigateTo({
      url: '../address/address?create=1',
    })
    // TODO 授权失败时的处理逻辑
    // wx.chooseAddress({
    //   success: function (res) {
    //     params = {
    //       address: res.detailInfo,
    //       contact: res.userName,
    //       province: res.provinceName,
    //       city: res.cityName,
    //       county: res.countyName,
    //       phone: res.telNumber,
    //       remark: res.remark || ''
    //     }
    //     params.members = {
    //       father: false,
    //       mother: false,
    //       man: false,
    //       woman: false
    //     }
    //     that.setData({
    //       userName: res.userName,
    //       telNumber: res.telNumber,
    //       provinceName: res.provinceName,
    //       cityName: res.cityName,
    //       countyName: res.countyName,
    //       detailInfo: res.detailInfo,
    //     })
    //   },
    //   fail: function (res) {
    //     if (res.errMsg == 'chooseAddress:fail cancel' || res.errMsg == 'chooseAddress:cancel' ) {

    //     } else {
    //       that.reGet();
    //     }
    //   }
    // })
  },
  reGet: () => {
    var that = this;
    wx.openSetting({
      complete: () => {
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.address']) {

            } else {
            }
          }
        })
      }
    })
  },
  fetchData: function () {
    var that = this;
    that.setData({
      father: father,
      mother: mother,
      husband: husband,
      wife: wife
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that_ = that;
    that.fetchData();

    source = options.source;

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

  // }
})