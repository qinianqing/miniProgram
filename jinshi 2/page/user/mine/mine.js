// page/user/mine/mine.js
const API = require('../../../api/api.js');
var current = 0;
const hSwiper = require("../../../component/hSwiper/hSwiper.js");
let n = 0;
let that_;

// 构建出user和family两个对象
// current user通过一个util来获取
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFwhUser: true,
    Ustatus:false,
    familyVar: {
      msg: 'hah',
    },
    open_type:'',
    gif: '../../../image/loading.gif',
    showLoginModal: false,
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
  createFamily: () => {
    wx.navigateTo({
      url: '../../family/create/create',
    })
  },
  familyVip: function (e) {
    wx.navigateTo({
      url: '../vip/vip?family_id=' + e.currentTarget.id,
    })
  },

  // 校验是不是公众号用户
  checkIsFwhUser: () => {
    wx.getStorage({
      key: 'fwh_user',
      success: function (res) {
        if (!res.data) {
          API.checkIsFwhUser().then((resp) => {
            wx.setStorage({
              key: 'fwh_user',
              data: resp.is_fwh_user
            })
            if (resp.is_fwh_user) {
              that_.setData({
                isFwhUser: 1
              })
            } else {
              that_.setData({
                isFwhUser: 0
              })
            }
          })
        } else {
          that_.setData({
            isFwhUser: 1
          })
        }
      },
    })
  },
  // 客服回调
  followFwh: () => {
    that_.setData({
      showFwhModal:true
    })
    // API.followFwhCallback();

    // // setTimeout(() => {
    // //   API.followFwhCallback();
    // // }, 150);
  },
  followFwhCallback:()=>{
    that_.setData({
      showFwhModal: false
    })
  },
  onGotUserInfo:function(e){
    that_.setData({
       user: {
         name: e.detail.userInfo.nickName,
         avatar: e.detail.userInfo.avatarUrl
       },
       Ustatus:false,
       loading:false
     })

  },
  // 更新用户信息
  updateUserInfo: (that) => {
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: (res) => {
        // 存储用户信息
        wx.setStorage({
          key: 'user_info',
          data: res.userInfo,
        })
        // 更新用户信息
        let p = {
          avatar: res.userInfo.avatarUrl,
          user_name: res.userInfo.nickName,
          gender: res.userInfo.gender
        }
        API.updateUserInfo(p);
        // 设置默认头像
        that_.setData({
          user: {
            name: res.userInfo.nickName,
            avatar: res.userInfo.avatarUrl
          },
          loading: false
        })
        // 绑定微信
        wx.getStorage({
          key: 'unionId',
          success: function (res) {
            if (!res.data) {
              let pa = {
                iv: res.iv,
                encryptedData: res.encryptedData
              }
              API.bindUnionId(pa);
            }
          },
        })
      },
      fail: (r) => {
       
        that_.setData({
          user: {
            name: '点击设置头像',
            avatar: 'https://cdn.jiyong365.com/%E5%A4%B4%E5%83%8F%E5%8D%A0%E4%BD%8D%E5%9B%BE2.png'
          },
          loading: false,
          Ustatus:true
        })
        // 判断权限
        // 绑定union_id
        // wx.getSetting({
        //   success: (res) => {
        //     if (!res.authSetting['scope.userInfo']) {
        //       wx.showModal({
        //         title: '登录失败',
        //         content: '您可以点击默认头像重新登录',
        //         showCancel: false,
        //         confirmColor: '#FF9080',
        //         confirmText: '知道了'
        //       })
        //     } else {
        //       // 去获取授权
        //       wx.openSetting({

        //       })
        //     }
        //   }
        // })
      },
      complete: () => {
      }
    });
  },
  goCollection: () => {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  goEvaluate: () => {
    wx.navigateTo({
      url: '../evaluate/evaluate?status=already',
    })
  },
  goService: () => {
    wx.navigateTo({
      url: '../customer-service/customer-service',
    })
  },
  // 点了订单入口
  orderEntranceTap: (e) => {
    switch (e.currentTarget.id) {
      case 'dfk':
        wx.navigateTo({
          url: '../../order/list/list?status=dfk',
        });
        break;
      case 'dsh':
        wx.navigateTo({
          url: '../../order/list/list?status=dsh',
        });
        break;
      case 'oall':
        wx.navigateTo({
          url: '../../order/list/list?status=all',
        });
        break;
      case 'dpj':
        wx.navigateTo({
          url: '../evaluate/evaluate?status=goingto',
        });
        break;
      case 'all':
        wx.navigateTo({
          url: '../../order/reverse/list?status=ing',
        });
        break;
    }
  },
  goWallet: function () {
    wx.navigateTo({
      url: '../../wallet/wallet',
    })
  },
  goquan: function () {
    wx.navigateTo({
      url: '../../promote/coupon/coupon',
    })
  },
  getDskNum:function(){
    var that = this;
    API.getDfkNum().then((resp)=>{
      that.setData({
        dfkNum: resp
      }
      )
    })
  },
  getDshNum:function(){
    var that = this;
    API.getDshNum().then((resp) => {
      that.setData({
        dshNum: resp
      }
      )
    })
  },
  familyDetails: function (e) {
    wx.navigateTo({
      url: '../../family/detail/detail?family_id=' + e.currentTarget.id,
    })
  },
  familyVip: function (e) {
    wx.navigateTo({
      url: '../vip/vip?family_id=' + e.currentTarget.id,
    })
  },
  gofund: function (e) {
    wx.navigateTo({
      url: '../../family/wallet/wallet?family_id=' + e.currentTarget.id,
    })
  },
  gocollect: function () {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  shareBtn: () => {
    wx.navigateTo({
      url: './invite/invite',
    })
  },
  fetchData: function () {
    // 设置横滑swiper
    var that = this;
    // 获取用户家庭列表
    API.getFamilylist().then((resp) => {
      wx.setStorage({
        key: 'families',
        data: resp.Items,
      })
      wx.hideLoading();
      that.setData({
        loading: false
      })
      let f = resp.Items;
      let setF = [];
      for (let i = 0; i < f.length; i++) {
        let eAt = new Date(Number(f[i].vip_expiredAt));
        let eAtY = eAt.getFullYear();
        let eAtM = eAt.getMonth();
        let eAtD = eAt.getDate();
        if ((eAtM + 1) < 10) {
          eAtM = '0' + (eAtM + 1);
        }
        if (eAtD < 10) {
          eAtD = '0' + eAtD;
        }
        let status = '';
        switch (f[i].vip) {
          case 0:
            status = 'no';
            break;
          case 1:
            status = 'member';
            break;
          case 2:
            status = 'try';
            break;
        }
        let item = {
          family_id: f[i].family_id,
          family_balance: f[i].balance,
          family_name: f[i].name,
          family_time: eAtY + '-' + eAtM + '-' + eAtD,
          free_ticket: f[i].fsc_num,
          status: status
        }
        setF.push(item);
      }
      if (setF.length < 3) {
        setF.push({
          status: 'create'
        })
      }
      let items = setF;
      for (let i = 0; i < items.length; i++) {
        if (i === 0) {
          items[i].style = 'f'
        } else {
          items[i].style = 'b'
        }
      }
      var swiper = new hSwiper({ reduceDistance: 23, varStr: 'familyVar', list: items });
      swiper.afterViewChange = function (data, index) {
        items[index].current = index;
        for (let i = 0; i < items.length; i++) {
          if (i === index) {
            items[i].style = 'f'
          } else {
            items[i].style = 'b'
          }
        }
        swiper.updateList(items);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that_ = this;
    n = 0;
    API.setPage(that);
    that.setData({
      loading: true
    })
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
    })
    that.updateUserInfo(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  back: function () {
    wx.navigateBack({
      
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.getDskNum();
    that.getDshNum();
    that.checkIsFwhUser();
    if (n !== 0) {
      // wx.showLoading({
      //   title: '更新数据',
      // })
    }
    n++;
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
      title: '家庭采购上锦时',
      path: '/page/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})