// 小程序入口 锦时+
const API = require('./api/api.js');
const LogIn = require('./util/login.js');

App({
  onLaunch: function (options) {
    console.log('App Launch');

    // 获取手机型号，对iPhone X做好适配
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf('iPhone X') >= 0) {
          // iPhone X
          wx.setStorage({
            key: 'iPhoneX',
            data: true,
          })
        } else {
          // 非iPhone X
          wx.setStorage({
            key: 'iPhoneX',
            data: false,
          })
        }
        wx.setStorage({
          key: 'inviteMemberUser',
          data: '',
        })

        wx.login({
          success: function (data) {
            API.login(data.code).then((resp) => {
              // 如果是新用户直接通过接口领券
              // if (resp.new_user) {
              //   API.getNewUser().then((resp) => {
              //     wx.setStorageSync('newUserCoupon', resp);
              //     wx.setStorage({
              //       key: 'showNewUserGuide',
              //       data: 0,
              //     })
              //   })
              // }
              wx.setStorage({
                key: 'user_Id',
                data: resp.user_id,
              })
              wx.setStorage({
                key: 'isNewUser',
                data: resp.new_user,
              })
              API.getFamilylist().then((resp) => {
                wx.setStorage({
                  key: 'families',
                  data: resp.Items || [],
                })
              })
              API.getCartUntoken().then((resp) => {
               if(resp.count){
                 wx.setStorage({
                   key: 'cartMsg',
                   data: resp.valid,
                 })
               }else{
                 wx.setStorage({
                   key: 'cartMsg',
                   data:[] ,
                 })
               }
             
              })
              wx.setStorage({
                key: 'access_token',
                data: resp.token,
                complete: () => { }
              })
              // 存储union_id，作为锦时唯一登录凭证
              wx.setStorage({
                key: 'unionId',
                data: resp.union_id,
              })
              wx.setStorage({
                key: 'fwh_user',
                data: resp.fwh_user,
              })
              wx.setStorage({
                key: 'new_user',
                data: resp.new_user,
              })
            }, (err) => {
              console.error('>>>>>', err)
            })
            //获取各地配送时效
            API.getAging().then((resp) => {
              wx.setStorage({
                key: 'aging',
                data: resp,
              })
            }, (err) => {
              console.error('>>>>>', err)
            })
            wx.getStorage({
              key: 'RegionVersion',
              success: function(res) {
                API.getRegionVersion().then((resp)=>{                
                  if(res.data !== resp){
                    wx.setStorage({
                      key: 'RegionVersion',
                      data: res.data,
                    })
                    API.getRegion().then((resp) => {
                      wx.setStorage({
                        key: 'Region',
                        data: resp,
                      })
                    })
                  }
                })
              },
              fail: function(res){
                API.getRegionVersion().then((resp) => {
                  wx.setStorage({
                    key: 'RegionVersion',
                    data: resp,
                  })
                })
                API.getRegion().then((resp)=>{
                  wx.setStorage({
                    key: 'Region',
                    data: resp,
                  })
                })
              }
            })
            // 获取各省份与仓库对应关系
            // 暂未启用分仓发货策略
            // API.getWarehouseMapping().then((resp) => {
            //   wx.setStorage({
            //     key: 'warehouseMapping',
            //     data: resp,
            //   })
            // }, (err) => {
            //   console.error('>>>>>', err)
            // })
          }
        })

        let ciu = wx.canIUse('getUpdateManager');
        if (ciu) {
          // 开启更新
          const updateManager = wx.getUpdateManager()

          updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
          })

          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示!',
              content: '新版本已经准备好，将重启应用？',
              showCancel: false,
              confirmColor: '#FF9080',
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      },
    })
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    openid: null
  }
})