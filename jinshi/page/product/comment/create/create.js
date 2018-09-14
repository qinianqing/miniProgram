// page/index/parcel/history/historycomment/historycomment.js
const API = require('../../../../api/api.js');
const qiniuUploader = require("../../../../util/qiniuUploader.js");

let object_id = '';

var list = [];
var spuname = '';
var commentPicArray = [];
var numbers = 5;
var text = '';
var allimage = [];
var Images = [];
let spu_id;
let sku_id;
let type_id;
let proportion;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    spuName: '',
    height: 20,
    focus: false,
    flag: 5,
    flag1: false,
    flag2: false,
    flag3: false,
    flag4: false,
    flag5: false,
    satisfaction: '强力推荐',
    question: false,
    click: false,
    uploadimage: [],
    solecomment: [
      {
        url: 'https://cdn.jiyong365.com/DSC_7639%E7%BC%A9.jpg',
        solename: '牛奶饼干 酥脆可口味道浓厚',
        weidao: '百香果口味 230g',
      }
    ],
    questionlist: ['商品问题', '客服问题', '物流问题', '包装问题', '其他']
  },
  deletePic: function (newArray) {
    commentPicArray = newArray
    var that = this; 
    that.setData({
      commentPicArray: newArray
    })
  },
  back: function () {
    wx.navigateBack({

    })
  },
  click1: function (e) {
  
    var that = this;
    var flags = that.data.flag1;
    if (flags == false) {
      that.setData({
        flag1: true
      })
    };
    if (flags == true) {
      that.setData({
        flag1: false
      })
    }
  },
  click2: function () {

    var that = this;
    var flags = that.data.flag2;
    if (flags == false) {
      that.setData({
        flag2: true
      })
    };
    if (flags == true) {
      that.setData({
        flag2: false
      })
    }
  },
  click3: function () {

    var that = this;
    var flags = that.data.flag3;
    if (flags == false) {
      that.setData({
        flag3: true
      })
    };
    if (flags == true) {
      that.setData({
        flag3: false
      })
    }
  },
  click4: function () {
  
    var that = this;
    var flags = that.data.flag4;
    if (flags == false) {
      that.setData({
        flag4: true
      })
    };
    if (flags == true) {
      that.setData({
        flag4: false
      })
    }
  },
  click5: function () {

    var that = this;
    var flags = that.data.flag5;
    if (flags == false) {
      that.setData({
        flag5: true
      })
    };
    if (flags == true) {
      that.setData({
        flag5: false
      })
    }
  },

  changeColor1: function () {
    var that = this;
    that.setData({
      flag: 1,
      satisfaction: '强力不推荐',
      question: true,
    });
    numbers = 1;
  },
  changeColor2: function () {
    var that = this;
    that.setData({
      flag: 2,
      satisfaction: '不推荐',
      question: true,
    });
    numbers = 2;
  },
  changeColor3: function () {
    var that = this;
    that.setData({
      flag: 3,
      satisfaction: '一般',
      question: true,
    });
    numbers = 3;
  },
  changeColor4: function () {
    var that = this;
    that.setData({
      flag: 4,
      satisfaction: '推荐',
      question: false,
    });
    numbers = 4;
  },
  changeColor5: function () {
    var that = this;
    that.setData({
      flag: 5,
      satisfaction: '强力推荐',
      question: false,
    });
    numbers = 5;
  },
  list: function (e) {
    this.setData({
      click: true
    })
  },
  didPressChooseImage: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 9,
      success: function (res) {
        wx.showLoading({
          title: '图片上传中',
        })
        var filePaths = res.tempFilePaths;
        var imageall = [];
        for (let i = 0; i < filePaths.length; i++) {
          var filePath = filePaths[i];
          qiniuUploader.upload(filePath, (res) => {
            imageall.push("https://" + res.imageURL)
            commentPicArray = imageall

            that.setData({
              commentPicArray: imageall
            });
            if (commentPicArray.length === filePaths.length) {
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
  loadImg: (e)=>{
    let bindload = e.detail;
    proportion = bindload.width / bindload.height;
  },
  turn: function (e) {
    
    wx.navigateTo({
      url: '../showpicture/showpicture?image_id=' + e.currentTarget.id + '&&' + 'proportion=' + proportion
    })
  },
  fetchData: function (options) {
    var that = this;
    API.getGoodsDetail(options.spu_id).then((resp) => {
      for (var i = 0; i < resp[0].skus.length; i++) {
        if (options.sku_id == resp[0].skus[i].sku_id) {
          type_id = resp[0].skus[i].type_id;
          let item = {
            goods_id: options.spu_id,
            sku_id: options.sku_id,
            spu_name: resp[0].goods_name,
            type_id: resp[0].skus[i].type_id,
            image: resp[0].skus[i].image,
            price: resp[0].skus[i].price
          }
          list.push(item);
          that.setData({
            list: list
          })
        }

      }


    })
  },
  textvalue: function (e) {
    text = e.detail.value;
  },

  goCommit: function (e) {
    // console.log(getCurrentPages()[getCurrentPages().length - 1].options.sku_id)
    // API.getOnesku(getCurrentPages()[getCurrentPages().length - 1].options.sku_id).then((resp) => {
    if (text.length < 10) {
      return wx.showModal({
        title: 'Oops!',
        content: '一条评论至少有10个字哦！',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    }
    let options = {
      sku_id: sku_id,
      spu_id: spu_id,
      star_num: numbers,
      comment_content: text,
      comment_image: commentPicArray,
      type_id: type_id
    }
    API.createComment(options).then((resp) => {
      if (!object_id) {
        console.error('object_id cannot be get')
      } else {
        API.callbackHistoryCommit(object_id, resp.comment.comment_id).then((respp) => {

        }, (err) => {
          console.error(err.error_msg);
        })
      }
      wx.navigateBack({
        url: '../'
      })
    
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    object_id = options.object_id;
    sku_id = options.sku_id;
    spu_id = options.spu_id;
    commentPicArray = [];
    
    var that = this;
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
    that.fetchData(options)
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
    list.splice(0, list.length);
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