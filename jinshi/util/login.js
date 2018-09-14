// 绑定unionId，实现通用性登录
const host = 'https://api.jiyong365.com';
const API = {
  checkUnionIdBinded: () => {
    let options = {
      path: '/passport/user/have-unionid',
      params: {

      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  bindUnionId: (p) => {
    let options = {
      path: '/passport/user/bind-unionid-wa',
      params: {
        iv: p.iv,
        encryptedData: p.encryptedData
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
};

const req = (options)=>{
  return new Promise((resolve,reject)=>{
    wx.getStorage({
      key: 'access_token',
      success: function (res) {
        let token = res.data;
        wx.request({
          url: host + options.path,
          data: options.params,
          header: {
            'x-access-token': token
          },
          method: options.method,
          success: (res) => {
            if (res.statusCode == 200) {
              if (res.data.error_code) {
                return reject(res.data);
              } else {
                return resolve(res.data.data);
              }
            } else {
              return reject(res.data);
            }
          },
          fail: (res) => {
            return reject(res);
          }
        })
      }
      // },
      // fail: function (res) {
      //   throw new Error('get local token wrong');
      // }
    })
  })
}

// 调用示例
/*
LogIn.check((resp)=>{
  console.log(resp);
});
*/
let user_info;

module.exports = {
  checkLocal:(callback)=>{
    wx.getStorage({
      key: 'unionId',
      success: function(res) {
        callback(res.data)
      },
      fail:function(err){
        callback(0);
      }
    })
  },
  check: (callback) => {
    // 判断用户是否已经绑定了union_id
    API.checkUnionIdBinded().then((resp) => {
      if(resp.union_id){
        callback(1);
      }else{
        callback(0);
      }
     
      wx.setStorage({
        key: 'unionId',
        data: resp.union_id,
      })
    },(err)=>{
      callback(0);
    })
  },
  // 在最新版本中bind方法没有被使用
  bind: (callback) => {
    // 获取用户授权并绑定union_id
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: (res) => {
        callback(1);
        // 存储用户信息
        wx.setStorage({
          key: 'user_info',
          data: res.userInfo,
        })
        user_info = res.userInfo;
        if(res.userInfo.gender === 1){
          user_info.gender = '男';
        }else if(res.userInfo.gender === 0){
          user_info.gender = '女';
        }else{
          user_info.gender = '不确定';
        }
        // 绑定微信
        let pa = {
          iv: res.iv,
          encryptedData: res.encryptedData
        }
        API.bindUnionId(pa).then((resp)=>{
          wx.setStorage({
            key: 'unionId',
            data: 1,
          })
        });
      },
      fail: () => {
        // 出弹窗
        callback(0);
      }
    });
  },
  // 再用户拒绝授权后再次获得授权
  reBind: (userInfo,callback) => {
    if (userInfo){
      // 授权成功
      user_info = userInfo;
      wx.setStorage({
        key: 'user_info',
        data: userInfo.userInfo,
      })
      // 绑定微信
      let pa = {
        iv: userInfo.iv,
        encryptedData: userInfo.encryptedData
      }
      API.bindUnionId(pa).then((resp) => {
        wx.setStorage({
          key: 'unionId',
          data: 1,
        })
        callback(1);
      });
    }
    // wx.getSetting({
    //   success: (res) => {
    //     if (!res.authSetting['scope.userInfo']) {
    //       // 去获取授权
    //       wx.openSetting({
    //         complete: () => {
    //           wx.getSetting({
    //             success: (res) => {
    //               if (!res.authSetting['scope.userInfo']) {
    //                 callback(0);
    //               } else {
    //                 wx.getUserInfo({
    //                   withCredentials: true,
    //                   lang: 'zh_CN',
    //                   success: (res) => {
    //                     callback(1);
    //                     // 存储用户信息

    //                   }
    //                 });
    //               }
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  }
}