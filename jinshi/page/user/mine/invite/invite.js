// page/user/mine/invite/invite.js
const API = require('../../../../api/api.js');
// 适配iphone
var iphonex;
//二维码
var wxCode;
//分享
var msg;
//分享id
var codeId;

let user_name = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../../image/loading.gif',
    iphonex: '',
    scollMarginTop: '',
    statusLeft: true,
    statusRight: false,
    showPic: false,
    showUrl: '',
    myself: [],
    ranking: [],
    NoUserAvatar: '',
    NoUserName: '',
    loading: false,
    selectShare: false,
    ss: false
  },
  //活动规则
  goRule: function () {
    wx.navigateTo({
      url: './activerule/activerule',
    })
  },
  selectC: function () {
    var that = this;
    that.setData({
      selectShare: false
    })
  },
  cancelS: function () {
    var that = this;
    that.setData({
      selectShare: false
    })
  },
  shareSelect: function () {
    var that = this;
    that.setData({
      selectShare: true
    })
  },
  selectO: function () {
    var that = this;
    msg = 'invite';
    that.setData({
      selectShare: false
    })
  },
  selectT: function () {
    var that = this;
    that.inviteFriend();
  },
  //TAB切换
  left: function () {
    var that = this;
    that.fetchRanking()
    that.setData({
      statusLeft: true,
      statusRight: false
    })
  },
  //TAB切换
  right: function () {
    var that = this;
    that.fetchMyself()
    that.setData({
      statusLeft: false,
      statusRight: true
    })
  },
  fetchData: function () {
    var that = this;
    that.setData({
      loading: false
    })
    if (that.data.statusLeft == true) {
      that.fetchRanking()
    } else {
      that.fetchMyself()
    }
  },
  //得到我的邀请
  fetchMyself: function () {
    var that = this;
    API.getMself().then((resp) => {
      that.setData({
        myself: resp
      })
    })

  },
  //没有排行榜
  Nomine: function () {
    var that = this;
    API.getCurrentUser().then((resp)=>{
      that.setData({
        NoUserAvatar: resp.user.avatar,
        NoUserName: resp.user.user_name
      })
    })

  },
  //得到排行榜
  fetchRanking: function () {
    var that = this;
    API.getRanking().then((resp) => {
      that.setData({
        ranking: resp
      })
      that.Nomine();
    })
  },
  //发起本地保存图片
  saveCode: function () {
    var that = this;
    wx.downloadFile({
      url: wxCode,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              showPic: false
            })

          },
          fail: function (res) {
            wx.getSetting({
              success: (res) => {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                  // 去获取授权
                  wx.openSetting({
                    complete: () => {
                      wx.getSetting({
                        success: (res) => {
                          if (res.authSetting['scope.writePhotosAlbum']) {
                            wx.downloadFile({
                              url: wxCode,
                              success: function (res) {
                                wx.saveImageToPhotosAlbum({
                                  filePath: res.tempFilePath,
                                  success: function (res) {
                                    wx.showToast({
                                      title: '保存成功',
                                      icon: 'success',
                                      duration: 2000
                                    })
                                    that.setData({
                                      showPic: false
                                    })
                                  },
                                  fail: function (res) {
                                    wx.showToast({
                                      title: '保存失败',
                                      icon: 'success',
                                      duration: 2000
                                    })
                                    that.setData({
                                      shareShow: false
                                    })
                                  }
                                })
                              }
                            })
                          }
                        }
                      });


                    }
                  })

                }
              }
            })

          }
        })
      }
    })


  },
  //返回
  back: function () {
    wx.navigateBack({

    })
  },
  //隐藏好友分享
  hidden: function () {
    var that = this;
    that.setData({
      showPic: false
    })
  },
  //立即邀请好友
  inviteFriend: function () {
    var that = this;
    wx.showLoading({
      title: '二维码生成中...',
    })
    API.getWXcode().then((resp) => {
      wxCode = resp;
      that.setData({
        showUrl: resp,
        showPic: true

      })
      wx.hideLoading();
      that.setData({
        selectShare: false,

      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      loading: true
    })
    that.fetchData();
    that.Nomine();
    wx.getStorage({
      key: 'user_Id',
      success: function (res) {
        codeId = res.data
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    let XS = that.data.windowWidth / 375;
    that.setData({
      caleh: XS
    })
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          iphonex = true;
          that.setData({
            iphonex: true,
            scollMarginTop: 182
          })
        } else {
          // 不是iPhone X
          iphonex = false;
          that.setData({
            iphonex: false,
            scollMarginTop: 132
          })
        }
      },
    });
    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        user_name = res.data.nickName
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
    return {
      title: user_name+'送你5元现金券',
      path: '/page/index/index?user_Id=' + codeId, 
      imageUrl: 'https://cdn.jiyong365.com/20%281%29dfgfgfgfgf.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})