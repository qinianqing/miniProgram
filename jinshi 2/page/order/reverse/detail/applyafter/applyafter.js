// page/order/reverse/detail/applyafter/applyafter.js
const API = require('../../../../../api/api.js')
const qiniuUploader = require('../../../../../util/qiniuUploader.js');
var commentPicArray = [];
var allimage = [];
var Images = [];
//订单id
var orderId;
//发起退款理由
var reason;
//发起状态
var applyStatus;
//退款内容
var content;
//商品退款数量
var applynum;
//skuid
var skuId;
//目前数量
var currentNum;
//发货退款理由
var Creason;
//发货订单
var Corder;
//传递数据
var goodsdetail;
var that_;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 申请退货商品数据
    goods: {},
    //申请退货原因
    applyReason: ['商品损坏，包装不完整', '物流太慢', '商品与描述不符', '其他原因'],
    //未发货，申请退款
    applyCancel: ['买重了', '不喜欢，不想要了', '信息填写错误，重新拍', '其他原因'],
    //商品数量
    numApply: '',
    //最大数量
    maxnum: ''
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
  //选择退货原因
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    Creason = this.data.applyReason[e.detail.value]
    this.setData({
      index: e.detail.value
    })
  },
  //未发货退货原因
  bindPickerChanges: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    reason = this.data.applyCancel[e.detail.value]
    this.setData({
      index: e.detail.value
    })
  },
  back: () => {
    wx.setStorage({
      key: 'reverseStatus',
      data: 'no',
    })
    wx.navigateBack({

    })

  },
  //jia
  plus: function (e) {
    console.log("eee", e)
    var that = this;
    if (this.data.numApply < applynum) {
      this.data.numApply++;
      currentNum = this.data.numApply
      that.setData({
        numApply: this.data.numApply
      })
    }
  },
  //jian
  minus: function (e) {
    var that = this;
    if (this.data.numApply > 1) {
      this.data.numApply--;
      currentNum = this.data.numApply
      that.setData({
        numApply: this.data.numApply
      })
    }
  },
  //放大传递页面数据
  deletePic: function (newArray) {
    commentPicArray = newArray
    var that = this;
    that.setData({
      commentPicArray: newArray
    })
  },
  //评论内容
  textvalue: function (e) {
    content = e.detail.value
  },
  //查看售后大图
  turn: function (e) {
    let bindload = e.detail;
    let proportion = bindload.x / bindload.y;
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
  formSubmit: (e) => {
    var that = this;
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

    if (applyStatus) {
      if (!reason) {
        wx.showModal({
          title: '提示',
          content: '请选择退款原因',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        reason = reason;
        if (commentPicArray.length == 0) {
          commentPicArray.push('-')
        } else {
          commentPicArray = commentPicArray
        }
        if (content == '') {
          content = '-'
        } else {
          content = content
        }
        wx.getStorage({
          key: 'applyAll',
          success: function(res) {
              goodsdetail = {
              default_image: res.data.cancelpics,
              goods_name: res.data.sku_name,
              num: res.data.cancelnum.replace(/[^0-9]/ig, ""),
              type_id:res.data.type_id,
              goods_price: res.data.cancelprice
            }
              let params = {
                order_id: orderId,
                item: {
                  sku_id: res.data.type_id,
                  num: res.data.cancelnum.replace(/[^0-9]/ig, ""),
                  goodsdetail: goodsdetail
                },
                type: 'REFUND',
                content: content,
                pics: commentPicArray,
                reason: reason
              }
              API.createReverseList(params).then((resp) => {
                wx.navigateTo({
                  url: '../../detail?apply=auto',
                })
                wx.setStorage({
                  key: 'reverseStatus',
                  data: 'yes',
                })
              })
          },
        })       
      }
    } else {
      if (!Creason) {
        wx.showModal({
          title: '提示',
          content: '请选择退款原因',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        reason = Creason;
        if (commentPicArray.length == 0) {
          commentPicArray.push('-')
        } else {
          commentPicArray = commentPicArray
        }
        if (content == '') {
          content = '-'
        } else {
          content = content
        }
        goodsdetail.num = currentNum;
        let params = {
          order_id: Corder,
          item: {
            sku_id: skuId,
            num: currentNum,
            goodsdetail: goodsdetail
          },
          type: 'RETURN',
          content: content,
          pics: commentPicArray,
          reason: Creason
        }
        goodsdetail.num = currentNum;
        wx.setStorage({
          key: 'applygoods',
          data: goodsdetail,
        })
        API.createReverseList(params).then((resp) => {
          wx.navigateTo({
            url: '../../detail?apply=apply&reverse_Id=' + resp,
          })
        })
      }
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    applynum = Number(options.num);
    currentNum = Number(options.num);
    skuId = String(options.skuid);
    Corder = String(options.orderids);
    var that = this;
    let goods = {
      default_image: options.cover,
      goods_name: options.spu_name,
      num: Number(options.num),
      type_id: options.sku_name,
      goods_price: options.price
    }
    goodsdetail = goods;
    orderId = options.order_id
    that.setData({
      goods: goods,
      numApply: applynum,
      maxnum: applynum
    })

    if (options.applycancel) {
      that.setData({
        applycancel: true
      })
      applyStatus = true
    } else {
      that.setData({
        applycancel: false
      })
      applyStatus = false
    }
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