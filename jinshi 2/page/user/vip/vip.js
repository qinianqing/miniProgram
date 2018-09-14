// page/user/vip/vip.js
const API = require('../../../api/api.js');

let that_;

let family_id = '';

let families;

let family_name = '';

let inviteMemberUser = '';

let memberPrice = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //版本控制
    showGift: false,
    Status: true,
    //维护一个会员列表
    vipLevel: []
  },
  codeRequest: (e) => {
    wx.showModal({
      title: 'Oops!',
      content: '优惠码不正确！',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#FD8075'
    })
  },
  fetchData: () => {
    wx.showLoading({
      title: '加载中',
    })
    API.getMemberPrice().then((resp) => {
      wx.hideLoading();
      memberPrice = resp;
      if (resp.length) {
        that_.setData({
          Status: true,
          vipLevel: resp
        })
      } else {
        that_.setData({
          Status: false,
        })
      }
    })
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
  closeGiftTap:()=>{
    that_.setData({
      showGift: false
    })
  },
  skuTap:(e)=>{
    let sku_id = e.currentTarget.id;
    if(sku_id){
      wx.navigateTo({
        url: '../../product/goodsdetail/goodsdetail?sku_id='+sku_id,
      })
    }
  },
  checkGift: (e) => {
    let index = e.currentTarget.dataset.index;
    that_.setData({
      showGift: true,
      gifts: memberPrice[index].giftInfo,
      worth: memberPrice[index].send
    })
  },
  payMember: (e) => {
    wx.showLoading({
      title: '加载中',
    })
    API.payMember(family_id, e.currentTarget.id, inviteMemberUser).then((resp) => {
      wx.hideLoading();
      wx.requestPayment({
        timeStamp: resp.timeStamp,
        nonceStr: resp.nonceStr,
        package: resp.package,
        signType: resp.signType,
        paySign: resp.paySign,
        success: () => {
          wx.showToast({
            title: '会员购买成功',
            success: () => {
              setTimeout(() => {
                wx.redirectTo({
                  url: '../mine/mine',
                })
              }, 1000)
            }
          })
        }
      })
    })
  },
  goVip: function () {
    wx.navigateTo({
      url: '../family-member/right-info/right-info',
    })
  },
  fSelect: (e) => {
    that_.setData({
      fIndex: e.detail.value
    })
    family_id = families[e.detail.value].family_id;
  },
  getFamilies: (that) => {
    wx.getStorage({
      key: 'families',
      success: function (res) {
        families = res.data;
        if (families.length > 0) {
          let f = [];
          let n = 0;
          if (!family_id) {
            family_id = families[0].family_id;
            for (let i = 0; i < families.length; i++) {
              f.push(families[i].name);
            }
          } else {
            for (let i = 0; i < families.length; i++) {
              if (families[i].family_id === family_id) {
                n = i;
              }
              f.push(families[i].name);
            }
          }
          that.setData({
            fNames: f,
            fIndex: n
          })
        } else {
          wx.showModal({
            title: '还没有创建家庭',
            confirmText: '去创建',
            confirmColor: '#FD8075',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../family/create/create',
                })
              } else if (res.cancel) {
                wx.navigateBack({

                })
              }
            }
          })
        }

      },
      fail: function (res) {
        wx.showModal({
          title: '还没有创建家庭',
          confirmText: '去创建',
          confirmColor: '#FD8075',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../family/create/create',
              })
            } else if (res.cancel) {
              wx.navigateBack({

              })
            }
          }
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'user_Id',
      success: function (res) {
        let uId = res.data;
        if (options.invite_user) {
          if (uId !== options.invite_user) {
            inviteMemberUser = options.invite_user;
            wx.setStorage({
              key: 'inviteMemberUser',
              data: options.invite_user,
            })
          } else {
            wx.showModal({
              title: 'Oops!',
              content: '自己邀请自己不享受返现优惠哦！',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#FD8075'
            })
          }
        } else {
          wx.getStorage({
            key: 'inviteMemberUser',
            success: function (res) {
              inviteMemberUser = res.data;
            },
          })
        }
      },
    })
    let that = this;
    API.setPage(that);
    that_ = that;
    that_.fetchData();
    family_id = options.family_id;
    // iPhone X适配
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphonex: true,
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphonex: false,
          })
        }
      },
    });
    that.getFamilies(that);
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
    // that_.fetchData();
    that_.getFamilies(that_);
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