// page/order/reverse/detail/logistics/logistics.js
const API = require('../../../../../api/api.js');
const qiniuUploader = require('../../../../../util/qiniuUploader.js');
var commentPicArray = [];
var allimage = [];
var Images = [];
var code = [];
var name = [];
var reason;
var logisticId;
var phone;
var reverseMessage;
var pics;
var reverseId;
var that_;
let proportion;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //物流
    applyReason: []
  },
//返回
back:()=>{
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

//放大传递页面数据
deletePic: function (newArray) {
  commentPicArray = newArray
  var that = this;
  that.setData({
    commentPicArray: newArray
  })
},
loadImg: (e) => {
  let bindload = e.detail;
  proportion = bindload.width / bindload.height;
},
//查看售后大图
turn: function (e) {
  wx.navigateTo({
    url: '../showapply/showapply?image_id=' + e.currentTarget.id + '&&' + 'proportion=' + proportion
  })
},
//七牛云上传图片
didPressChooseImage: function () {
  var that = this;
  // 选择图片
  wx.chooseImage({
    count: 9,
    success: function (res) {
      var filePaths = res.tempFilePaths;
      var imageall = [];
      wx.showLoading({
        title: '图片上传中',
      })
      for (let i = 0; i < filePaths.length; i++) {
        var filePath = filePaths[i];
        qiniuUploader.upload(filePath, (res) => {
          imageall.push("https://" + res.imageURL)
          commentPicArray = imageall
          that.setData({
            commentPicArray: imageall
          });
          if (i === imageall.length - 1) {
            wx.hideLoading();
          }
        }, (error) => {
          console.log('error: ' + error);
        }, {
            region: 'NCN',
            domain: 'img1.jiyong365.com', // // bucket 域名，下载资源时用到。如果设置，会
            uptoken: 'FcAROZO49rjG2WK1GMqgK_-mU3z9rif5ql43BHJe:fuq5Ka9BQ3Rh6WTHMMyYgBZQlU4=:eyJzY29wZSI6ImppbnNoaS11Z2MiLCJkZWFkbGluZSI6NzM1MTUzOTc4MjV9',

          });
      }

    }
  })

},
bindKeyInput: function (e) {
  logisticId = e.detail.value
},
bindKeyInputOne: function (e) {
  phone = e.detail.value
},
bindKeyInputTwo: function (e) {
 reverseMessage = e.detail.value
},
bindPickerChange: function (e) {
  var that = this;
  reason = code[name[e.detail.value]]
 that.setData({
   index: e.detail.value
 })
},
fetchData:function(){
  var that = this;
  API.getLogistics().then((resp)=>{
    console.log(">>>>",resp)
       code = resp.code;
       name = resp.list
       that.setData({
         applyReason:resp.list
       })
  })
},
formSubmit: (e) => {
  // 提交form_id
  if (e.detail.formId) {
    let tDate = Date.now() + 7 * 1000 * 60 * 60 * 24;
    let p = {
      form_id: e.detail.formId,
      quota: 1,
      expiredAt: tDate
    }
    API.addFormId(p).then((resp) => {
    }, (err) => {
      console.error(err.message);
    })
  };
  if (!reason){
    wx.showModal({
      content: '请选择物流',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }else{
    reason = reason
  }
  if (!logisticId) {
    wx.showModal({
      content: '请填写物流单号',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  } else {
    logisticId = logisticId
  }
  if (!phone) {
    wx.showModal({
      content: '请填写手机号',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  } else {
    phone = phone
  }
  if (!commentPicArray) {
    wx.showModal({
      content: '请上传凭证',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  } else {
    commentPicArray = commentPicArray
  }
  if (!reverseMessage) {
    reverseMessage = '-';
  } else {
    reverseMessage = reverseMessage
  }
  let parm = {
   reverse_id: reverseId,
    express_id: logisticId,
    express_brand: reason,
    tel: phone,
    logistics_pic: commentPicArray,
    reverse_detail: reverseMessage 
  }
  API.createUpdateOrder(parm).then((resp)=>{
    wx.navigateTo({
      url: '../../detail?reverse_Id=' + reverseId,
    })
  })

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  
  reverseId = options.reverse_id
  that.fetchData();
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