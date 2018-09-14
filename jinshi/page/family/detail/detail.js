// page/category/level2/level2.js
const API = require('../../../api/api.js');
var father = false;
var mother = false;
var husband = false;
var wife = false;
var that_;
let family_id = '';

let params;

let name = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false
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
  goVip: () => {
    wx.navigateTo({
      url: '../../user/vip/vip?family_id=' + family_id,
    })
  },
  // 跳转
  enTap: (e) => {
    switch (e.currentTarget.id) {
      case 'jijin':
        wx.navigateTo({
          url: '../wallet/wallet?family_id=' + family_id,
        })
        break;
      case 'dingyue':
        // TODO
        // wx.navigateTo({
        //   url: '../../subscribe/calender/check',
        // })
       wx.showToast({
         title: '敬请期待...',
         icon:'none'
       })
        break;
      case 'quan':
        wx.navigateTo({
          url: '../wallet/coupon?family_id=' + family_id,
        })
        break;
    }
  },
  // 编辑
  editName: () => {
    that_.setData({
      focus: true
    })
  },
  nameInput: (e) => {
    if (e.detail.value.split('').length <= 10) {
      params.name = e.detail.value;
      name = e.detail.value;
      let nameLength = name.split('').length;
      that_.setData({
        nameWidth: nameLength * 60
      })
    } else {
      wx.showToast({
        title: '最多10个字',
      })
    }
  },
  nameConfirm: () => {
    that_.update('name');
  },
  update: (t) => {
    switch (t) {
      case 'name':
        if (!params.name) {
          return wx.showModal({
            title: 'Oops!',
            content: '您的家庭至少要有一个名字',
            showCancel: false,
            confirmColor: '#FF9080',
            confirmText: '知道了',
            success: function (res) {

            }
          })
        }
        break;
      case 'member':
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
        break;
      case 'address':
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
        break;
    }
    params.family_id = family_id;
    wx.showLoading({
      title: '修改中',
    })
    API.updateFamily(params).then((resp) => {
      API.getFamilylist().then((resp) => {
        wx.hideLoading();
        wx.setStorage({
          key: 'families',
          data: resp.Items,
          complete: () => {
            wx.showToast({
              title: '修改成功',
            })
          }
        })
      })
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
    that.update('member');
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
    that.update('member');
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
    that.update('member');
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
    that.update('member');
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
    that_.update('address');
    that_.setData({
      address: {
        name: name,
        address: res.detailInfo,
        contact: res.userName,
        province: res.provinceName,
        city: res.cityName,
        county: res.countyName,
        phone: res.telNumber
      }
    })
  },
  familyMessage: function () {
    wx.setStorage({
      key: 'Address',
      data: {
        county:params.county,
        contact:params.contact,
        address:params.address,
        city: params.city,
        province: params.province,
        phone: params.phone
      },
      success:()=>{
        wx.navigateTo({
          url: '../address/address?create=0',
        })
      }
    })
    // var that = this;
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
    //     that.update('address');
    //     that.setData({
    //       address: {
    //         name:name,
    //         address: res.detailInfo,
    //         contact: res.userName,
    //         province: res.provinceName,
    //         city: res.cityName,
    //         county: res.countyName,
    //         phone: res.telNumber
    //       }
    //     })
    //   },
    //   fail: () => {
    //     // 获取授权失败
    //     // 去获取授权
    //     that.setData({
    //       noAuth: true
    //     })
    //   }
    // })
  },
  // reGet: () => {
  //   wx.openSetting({
  //     complete: () => {
  //       wx.getSetting({
  //         success: (res) => {
  //           if (res.authSetting['scope.address']) {
  //             that.familyMessage();
  //           }
  //         }
  //       })
  //     }
  //   })
  // },
  fetchData: function () {
    var that = this;
    API.getFamily(family_id).then((resp) => {
      resp = resp.family;
      params = resp;
      family_id = resp.family_id;
      name = resp.name;
      let eAtS = '';
      if (resp.vip_expiredAt && resp.vip_expiredAt > 0) {
        let eAt = new Date(Number(resp.vip_expiredAt));
        let eAtY = eAt.getFullYear();
        let eAtM = eAt.getMonth();
        let eAtD = eAt.getDate();
        if ((eAtM + 1) < 10) {
          eAtM = '0' + (eAtM + 1);
        }
        if (eAtD < 10) {
          eAtD = '0' + eAtD;
        }
        eAtS = eAtY + '年' + eAtM + '月' + eAtD + '日过期';
      }else{
        resp.vip_expiredAt = ''
      }
      let nameLength = name.split('').length;
      that.setData({
        eAt: resp.vip_expiredAt,
        id: resp.family_id,
        expiredAt: eAtS,
        vip: resp.vip,
        address: resp,
        father: resp.members.father,
        mother: resp.members.mother,
        husband: resp.members.man,
        wife: resp.members.woman,
        nameWidth: nameLength * 60
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that_ = this;
    family_id = options.family_id;
    var that = this;
    that.fetchData();

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
    API.setPage(that);
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