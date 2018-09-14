// page/product/goodsdetails/goodsdetails.js

const API = require('../../../api/api.js');
let fromIndex = 1;
let _windowHeight = 0;
let that_;
let ls;
let transfering = false;
let iphonex = true;
let scrollTop;
var list = [];
let skuslist = [];
let goodQr = ''
var updateSkuid = '';
var shopNumber = '';
var goodsSpu = '';
let goodsSku = '';
let productName = '';
var newList = [];
var low = '';
let currentIndex = 0;
let loading;
let leng = '';
var imagelength;
var guigelength;
let imagesheight = 0;
let newskus = [];
var firstsku = 0;
var skuvalues = '';
var skuvalues1 = '';
var skuvalues2 = '';
var skuvalues3 = '';
var skuvalues4 = '';
var currentid = '';
var skunames = "请选择规格";
var startnum = 1;
var currentNum = 1;
var rename;
var skunams;
var firstnum;
var skuid;
var selectindexs = 0;
var spuid;
var checkSkuslist = [];
let y;
let h;
let h1;
var goods_id;
var collect_Id;
var pages;
var new_id;

let shareImage = '';
let shareMsg = '';

let _imageHeight = 0;
let _imageWidth = 0;
let _windowWidth = 0;
let suan = 0;
let suans = 0;
let subsShow = true; // 页面是否显示了订阅
let articleShow = false; // 页面是否显示了文章入口
let serviceLength = 1; // 服务长度
let speLength = 5; // 详情长度
let status = 0;
let new_price = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    newUser: false,
    quan: {
      price: 20,
      limit: 100,
      expiredAt: '2018-12-30'
    },
    shareSheetShow: false,
    gif: '../../../image/loading.gif',
    showLoginModal: false,
    showToIndex: true,
    startUrls: [
      "https://cdn.jiyong365.com/XINGXING%202.png",
      "https://cdn.jiyong365.com/XINGXING%202.png",
      "https://cdn.jiyong365.com/XINGXING%202.png",
      "https://cdn.jiyong365.com/XINGXING%202.png",
      "https://cdn.jiyong365.com/XINGXING%202.png",

    ],
    correlationList: [],
    share: {

    },
    shareShow: false,
    bottom: 3000,
    notice: false,
    xiala: false,
    sureshop: true,
    xuanzhong: false,
    contrast: '',
    vip: 'https://cdn.jiyong365.com/Groadasdup%202.png',
    suoDetails: [{
      url: 'https://cdn.jiyong365.com/DSC_7639%E7%BC%A9.jpg',
      price: 40,
      dlprice: 40,
      guige: '百香果味',
      weight: '369g'
    },],
    index: 0,
    selectShare: false,
    codeUrl: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 200,
    circular: true,
    selected: true,
    selected1: false,
    selected2: false,
    order1: true,
    order2: false,
    order3: false,
    order4: false,
    order5: false,
    indicatorActiveColor: "white",
    scrollTop: 0,
    hidden: false,
    nocancel: false,
    addshow: false,
    selectsku: true,
    buyNumber: 1,
    buyNumMin: 1,
    buyNumMax: 0,
    zidingyi: false,
    xieru: true,
    subNum: '',
    toView: 'kk',
    list: {},
    currentindex: 0,
    starNum: '',
    Xleft: '',
    Xright: '',
    Xwidth: '',
    Xheight: '',
    windowWidth: 0,
    windowHeight: 0,
    pixelRatio: 0,
    caleh: '',
    goodsPic: '',
    vipPics: '',
    codePic: '',
    isDirect: false,
    articleShow: false,
    subsShow: false,
    //好文
    article: [{
      image: 'https://img0.jiyong365.com/pic1527763780300e06b3zk6ei.jpg',
      title: '强烈推荐:不能错过巨好吃的零食',
      titleTwo: '【解馋篇】',
      describe: '热饮组合可乐香槟雪可乐香槟雪',
      avatar: 'https://wx.qlogo.cn/mmopen/vi_32/rN7bd68doskG2UqVbVSmbERibX3pS1a61JhZzxIwgW8G4MWNF6ICMkTdiaPy2U3nNMomFh8CcRoF8viavoLHLHd4A/132',
      num: 100,
      user: '多吃不胖的小仙女',
    }, {
      image: 'https://img0.jiyong365.com/pic1527763780300e06b3zk6ei.jpg',
      title: '强烈推荐:不能错过巨好吃的零食',
      titleTwo: '【解馋篇】',
      describe: '热饮组合可乐香槟雪可乐香槟雪',
      avatar: 'https://wx.qlogo.cn/mmopen/vi_32/rN7bd68doskG2UqVbVSmbERibX3pS1a61JhZzxIwgW8G4MWNF6ICMkTdiaPy2U3nNMomFh8CcRoF8viavoLHLHd4A/132',
      num: 100,
      user: '多吃不胖的小仙女',
    }],
    //订阅组合
    subList: [],
    //透明度
    opacity: 0
  },
  goReLogin: function (e) {
    let userInfo = e.detail;
    API.rebind(userInfo);
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
  goVip: function () {
    wx.navigateTo({
      url: '../../user/vip/vip',
    })
  },
  goSubs: function () {
    wx.navigateTo({
      url: '../../subscribe/list/spu_map?spu_id=' + goods_id + '&goods_name=' + productName,
    })
  },
  goSub: function (e) {
    wx.navigateTo({
      url: '../../subscribe/detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  tagTap: function (e) {
    wx.navigateTo({
      url: '../tag/tag?tag=' + e.currentTarget.dataset.tag,
    })
  },
  back: function () {
    if (pages === 1) {
      wx.redirectTo({
        url: '../../index/index',
      })
    } else {
      wx.navigateBack({})
    }
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
  //判断是否厂家直发
  // direct参数不能直接购买，也要加入购物车，direct为true的商品不会加入搜索引擎
  // 需要的时候改成true即可
  isDirect: function () {
    var that = this;
    that.setData({
      isDirect: false
    })
  },
  shareSelect: function () {
    var that = this;
    that.setData({
      selectShare: true
    })
  },
  goIndexs: function () {
    wx.redirectTo({
      url: '../../index/index',
    })
  },
  t: function () {
   
  },
  goshare: function () {
    var that = this;
    that.setData({
      selectShare: false
    })
    wx.showLoading({
      title: '二维码生成中...',
    })
    that.share();
    that.setData({
      shareSheetShow: true
    })
  },
  selectO: function () {
    var that = this;
    that.setData({
      selectShare: false
    })
  },
  selectT: function () {
    var that = this;
    that.goshare();
  },
  hideShare: function () {
    var that = this;
    that.setData({
      shareSheetShow: false
    })
    wx.hideLoading();
  },
  wxCreate: function () {
    var that = this;
    setTimeout(function () {
      that.toCreate()
    }, 100)
  },
  toCreate: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'codeCanvas',
      success: function (resp) {
        wx.saveImageToPhotosAlbum({
          filePath: resp.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              shareShow: false
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

                            wx.saveImageToPhotosAlbum({
                              filePath: resp.tempFilePath,
                              success: function (res) {
                                wx.showToast({
                                  title: '保存成功',
                                  icon: 'success',
                                  duration: 2000
                                })
                                that.setData({
                                  shareShow: false
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
                        }
                      });
                    }
                  })
                } else {
                  // wx.saveImageToPhotosAlbum({
                  //   filePath: resp.tempFilePath,
                  //   success: function (res) {
                  //     wx.showToast({
                  //       title: '保存成功',
                  //       icon: 'success',
                  //       duration: 2000
                  //     })
                  //     that.setData({
                  //       shareShow: false
                  //     })
                  //   },
                  //   fail: function (res) {
                  //     wx.showToast({
                  //       title: '保存失败',
                  //       icon: 'success',
                  //       duration: 2000
                  //     })
                  //     that.setData({
                  //       shareShow: false
                  //     })
                  //   }
                  // })
                }
              }
            })
          }
        })
      },
      fail: function () {
        console.log("err")
      }
    })
  },
  share: function (e) {
    var that = this;
    wx.downloadFile({
      url: skuslist[0].carousel_image[0], //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          that.setData({
            goodsPic: res.tempFilePath
          })
          wx.downloadFile({
            url: 'https://cdn.jiyong365.com/Groadasdup%202.png', //仅为示例，并非真实的资源
            success: function (resp) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (resp.statusCode === 200) {
                that.setData({
                  vipPic: resp.tempFilePath
                })
                wx.downloadFile({
                  url: goodQr, //仅为示例，并非真实的资源
                  success: function (resps) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (resps.statusCode === 200) {
                      that.setData({
                        codePic: resps.tempFilePath
                      })
                      let ctxW = that.data.windowWidth;
                      let pixelRatio = that.data.pixelRatio;
                      let XS = that.data.windowWidth / 375;
                      that.setData({
                        caleh: XS
                      })
                      var ctx = wx.createCanvasContext('codeCanvas');
                      ctx.setFillStyle("#FFFFFF");
                      ctx.fillRect(0, 0, 300, 800);
                      var al = skuslist[0].goods_name.length;
                      var bl = skuslist[0].describe.length;
                      ctx.drawImage(that.data.goodsPic, 0, 0, 300, 260 * XS);
                      ctx.setFillStyle('#333333');
                      ctx.setFontSize(15);
                      ctx.setTextAlign('center');
                      ctx.fillText(skuslist[0].goods_name, 150, 300 * XS - 5);
                      ctx.setFillStyle('#7F7F7F');
                      ctx.setFontSize(13);
                      ctx.fillText(skuslist[0].describe, 150, 320 * XS - 5);
                      ctx.setFillStyle('#FF7A7A');
                      ctx.setFontSize(15);
                      ctx.setTextAlign('center');
                      ctx.fillText('￥' + skuslist[0].mini_price, 145, 344 * XS - 7);
                      ctx.drawImage(that.data.vipPic, 153 - 60, 331 * XS + 15, 60, 15.5);
                      ctx.setStrokeStyle('#FFB18C');
                      ctx.setFillStyle('#FFB18C');
                      ctx.setFontSize(12);
                      ctx.strokeRect(150, 331 * XS + 16, 14 * ('￥' + skuslist[0].goods_cashback).split('').length, 14);
                      ctx.setTextAlign('left');
                      ctx.fillText('￥' + skuslist[0].goods_cashback, 155, 331 * XS + 27.5);
                      ctx.setFillStyle('#7F7F7F');
                      ctx.setFontSize(12);
                      ctx.setTextAlign('center');
                      ctx.fillText('长按识别小程序码进入商城', 150, 370 * XS + 10);
                      ctx.drawImage(that.data.codePic, 100, 380 * XS + 10, 100, 100);
                      ctx.draw();
                      wx.hideLoading();
                      that.setData({
                        shareShow: true
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })

  },
  hiddenShare: function () {
    var that = this;
    that.setData({
      shareShow: false
    })
  },
  goBrand: function (e) {
    wx.navigateTo({
      url: '../brand/brand?brand_id=' + e.currentTarget.dataset.brand,
    })

  },
  selectskuone: function (e) {
    var that = this;
    skuvalues = e.target.dataset.skuvalue;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    var newskuslist = skuslist[0].skus;
    for (var i = 0; i < newskuslist.length; i++) {
      if (newskuslist[i].type_id == skunams) {
        startnum = newskuslist[i].number;
        skuid = newskuslist[i].sku_id;

        new_price = newskuslist[i].price;
        that.setData({
          startnum: newskuslist[i].number,
          buyNumber: newskuslist[i].number,
          sureshop: false,
          selectindexs: i,
          xuanzhong: true
        })
        if (newskuslist[i].stock == 0 || newskuslist[i].show == false) {
          that.setData({
            notice: true
          })
        } else {
          that.setData({
            notice: false
          })
        }
      } else {
        console.log("param is short")
      }
    }
    that.setData({
      skuvalues: skuvalues,
      skunames: rename
    })
  },
  selectskuone1: function (e) {
    var that = this;
    skuvalues1 = e.target.dataset.skuvalueones;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    var newskuslist = skuslist[0].skus;
    for (var i = 0; i < newskuslist.length; i++) {
      if (newskuslist[i].type_id == skunams) {
        startnum = newskuslist[i].number;
        skuid = newskuslist[i].sku_id;
        new_price = newskuslist[i].price;
        that.setData({
          startnum: newskuslist[i].number,
          buyNumber: newskuslist[i].number,
          sureshop: false,
          selectindexs: i,
          xuanzhong: true
        })
        if (newskuslist[i].stock == 0 || newskuslist[i].show == false) {
          that.setData({
            notice: true
          })
        } else {
          that.setData({
            notice: false
          })
        }
      } else {
        console.log("param is short")
      }
    }
    that.setData({
      skuvalues1: skuvalues1,
      skunames: rename
    })
  },
  selectskuone2: function (e) {
    var that = this;
    skuvalues2 = e.target.dataset.skuvaluetwo;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    var newskuslist = skuslist[0].skus;
    for (var i = 0; i < newskuslist.length; i++) {
      if (newskuslist[i].type_id == skunams) {
        startnum = newskuslist[i].number;
        skuid = newskuslist[i].sku_id;
        new_price = newskuslist[i].price;
        that.setData({
          startnum: newskuslist[i].number,
          buyNumber: newskuslist[i].number,
          sureshop: false,
          selectindexs: i,
          xuanzhong: true
        })
        if (newskuslist[i].stock == 0 || newskuslist[i].show == false) {
          that.setData({
            notice: true
          })
        } else {
          that.setData({
            notice: false
          })
        }
      } else {
        console.log("param is short")
      }
    }
    that.setData({
      skuvalues2: skuvalues2,
      skunames: rename
    })
  },
  selectskuone3: function (e) {
    var that = this;
    skuvalues3 = e.target.dataset.skuvaluethree;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    var newskuslist = skuslist[0].skus;
    for (var i = 0; i < newskuslist.length; i++) {
      if (newskuslist[i].type_id == skunams) {
        startnum = newskuslist[i].number;
        skuid = newskuslist[i].sku_id;
        new_price = newskuslist[i].price;
        that.setData({
          startnum: newskuslist[i].number,
          buyNumber: newskuslist[i].number,
          sureshop: false,
          selectindexs: i,
          xuanzhong: true
        })
        if (newskuslist[i].stock == 0 || newskuslist[i].show == false) {
          that.setData({
            notice: true
          })
        } else {
          that.setData({
            notice: false
          })
        }
      } else {
        console.log("param is short")
      }
    }
    that.setData({
      skuvalues3: skuvalues3,
      skunames: rename
    })
  },
  selectskuone4: function (e) {
    var that = this;
    skuvalues4 = e.target.dataset.skuvaluefour;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    var newskuslist = skuslist[0].skus;
    for (var i = 0; i < newskuslist.length; i++) {
      if (newskuslist[i].type_id == skunams) {
        startnum = newskuslist[i].number;
        skuid = newskuslist[i].sku_id;
        new_price = newskuslist[i].price;
        that.setData({
          startnum: newskuslist[i].number,
          buyNumber: newskuslist[i].number,
          sureshop: false,
          selectindexs: i,
          xuanzhong: true
        })
        if (newskuslist[i].stock == 0 || newskuslist[i].show == false) {
          that.setData({
            notice: true
          })
        } else {
          that.setData({
            notice: false
          })
        }
      } else {
        console.log("param is short")
      }
    }
    that.setData({
      skuvalues4: skuvalues4,
      skunames: rename
    })
  },
  detailImageLoad: (e) => {
    _imageHeight = _imageHeight + e.detail.height * _windowWidth / e.detail.width;
  },
  calPageHeight: () => {
    if (!suan || !suans) {
      let sHeight = 0;
      if (serviceLength <= 2) {
        sHeight = 100 * _windowWidth / 750;
      } else {
        sHeight = 74;
      }
      suan = 750 + 320 + 100 - 90 - 90 - 50;
      if (subsShow) {
        suan = suan + 350;
      }
      if (articleShow) {
        suans = suans + 402;
        suans = suans * _windowWidth / 750
      }
      suan = suan * _windowWidth / 750 + sHeight;

      suans = suan + (102 + 30 + 31.7 + 30 + 110 * speLength) * _windowWidth / 750 + _imageHeight;
    }
  },
  scroll: function (e) {
    if (!transfering) {
      that_.calPageHeight(); // TODO 在获取文章或订阅后一个接口调用

      var that = this;

      scrollTop = that.data.scrollTop;

      if (scrollTop > 110 && scrollTop < 141) {
        that.setData({
          opacity: 0.1
        })
      } else if (scrollTop > 140 && scrollTop < 171) {
        that.setData({
          opacity: 0.3
        })
      } else if (scrollTop > 170 && scrollTop < 201) {
        that.setData({
          opacity: 0.5
        })
      } else if (scrollTop > 200 && scrollTop < 231) {
        that.setData({
          opacity: 0.7
        })
      } else if (scrollTop > 230 && scrollTop < 261) {
        that.setData({
          opacity: 0.9
        })
      } else if (scrollTop > 260) {
        that.setData({
          opacity: 1
        })
      } else {
        that.setData({
          opacity: 0
        })
      }
      // var imagesheight = 600 * imagelength; 
      // let suan = (imagesheight * 0.5 / y) + (367 / y) - 3000;
      // let suans = suan + (530 / y) + 4700;
      if (scrollTop < suan) {
        that.setData({
          selected1: false,
          selected2: false,
          selected: true,
          scrollTop: e.detail.scrollTop
        })
      } else if (suan <= scrollTop && scrollTop < suans) {
        that.setData({
          selected1: true,
          selected2: false,
          selected: false,
          scrollTop: e.detail.scrollTop
        })
      } else if (scrollTop >= suans) {
        that.setData({
          selected1: false,
          selected2: true,
          selected: false,
          scrollTop: e.detail.scrollTop
        })
      }
    }
  },
  dl: function (e) {
    this.setData({
      addshow: false,
      ordershow: true,
      zidingyi: true,
      xieru: true
    })
  },
  shangla: function (e) {
    this.setData({
      xiala: false
    })
  },
  xiala: function (e) {
    this.setData({
      xiala: true
    })
  },
  order: function (e) {
    this.setData({
      ordershow: false,
    })
  },
  kefu: function () {

  },
  gocart: function () {
    wx.navigateTo({
      url: '../../cart/navcart',
    })

  },
  addCart: function () {
    

    var that = this;
    console.log(this.data)
    skunams = this.data.skunames;
    that.setData({
      skunames: skunames,
      startnum: startnum,
      addshow: true,
      // buyNumber:startnum
    })

  },
  formSubmit: function (e) {
    if (e.detail.formId) {
      let tDate = Date.now() + 7 * 1000 * 60 * 60 * 24;
      let p = {
        form_id: e.detail.formId,
        quota: 1,
        expiredAt: tDate
      }
      API.addFormId(p).then((resp) => { }, (err) => {
        console.error(err.message);
      })
    };
    var that = this;
    var typelist = [];
    var newskuslist = skuslist[0].skus;
    for (var i = 0; i < newskuslist.length; i++) {
      typelist.push(newskuslist[i].type_id)
    }
  
    if (typelist.indexOf(skunams) != -1) {
      var newskuslist = skuslist[0].skus;
      for (var i = 0; i < newskuslist.length; i++) {
        if (newskuslist[i].type_id == skunams) {
          if (newskuslist[i].stock < 0 || newskuslist[i].stock == 0) {
            wx.showModal({
              content: '库存不足',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (newskuslist[i].show == false) {
            wx.showModal({
              content: '该规格商品已下架',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else if (newskuslist[i].stock < this.data.buyNumber) {
            wx.showModal({
              content: '库存不足',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          } else {
            if (that.data.isDirect) {
              var surenum = this.data.buyNumber;
              API.getSku(skuid).then((resp) => {
                let Ddata = {
                  cover: resp[0].image,
                  spu: resp[0].goods_name,
                  skuName: resp[0].type_id,
                  num: surenum,
                  price: resp[0].price,
                  sku_id: skuid,
                  weight: resp[0].weight,
                  cashback: resp[0].cashback,
                  spu_id: spuid
                }
                let Ndata = [];
                Ndata.push(Ddata)
                wx.setStorage({
                  key: 'DselectCartSkus',
                  data: Ndata,
                })
                wx.getStorage({
                  key: 'cartMsg',
                  success: function (res) {
                    console.log(res.data)
                    let newMsg = res.data;
                    if (newMsg.length > 0) {
                      for (var i = 0; i < newMsg.length; i++) {
                        if (newMsg[i].spu_id === Ddata.spu_id) {
                          status = 1;
                          newMsg[i].num = newMsg[i].num + 1;
                          wx.setStorage({
                            key: 'cartMsg',
                            data: newMsg,
                          })
                          return;
                        } else {
                          status = 0
                        }
                      }
                      if (status === 0) {
                        newMsg.push(Ddata);
                      }
                    } else {
                      newMsg.push(Ddata);
                    }
                    wx.setStorage({
                      key: 'cartMsg',
                      data: newMsg,
                    })
                  },
                })

                wx.navigateTo({
                  url: '../../order/confirm?isDirect=true&order_id=' + ' ' + '&sku_id=' + skuid + '&num=' + surenum,
                })
              })

            } else {
              var surenum = this.data.buyNumber;
              let options = {
                sku_id: skuid,
                spu_id: spuid,
                num: surenum,
                price: new_price,
              }
             
              API.addCart(options).then((resp) => {
                wx.showToast({
                  title: '加入购物车成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.getStorage({
                  key: 'cartMsg',
                  success: function (res) {
                    let newMsg = res.data;
                    if (newMsg.length > 0) {
                      for (var i = 0; i < newMsg.length; i++) {
                        if (newMsg[i].spu_id === options.spu_id) {
                          status = 1;
                          newMsg[i].num = newMsg[i].num + 1;
                          wx.setStorage({
                            key: 'cartMsg',
                            data: newMsg,
                          })
                          return;
                        } else {
                          status = 0
                        }
                      }
                      if (status === 0) {
                        newMsg.push(options);
                      }
                    } else {
                      newMsg.push(options);
                    }
                    wx.setStorage({
                      key: 'cartMsg',
                      data: newMsg,
                    })
                  },
                })

                that.setData({
                  addshow: false
                })
              }, (err) => {
                wx.showModal({
                  title: 'Oops!',
                  content: err.error_msg,
                  showCancel: false,
                  confirmText: '知道了',
                  confirmColor: '#FD8075'
                })
              })
            }

          }
        } else {
          console.log("param is short")
        }
      }
    } else {
      wx.showModal({
        content: '请选择正确规格的商品',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  tocomment: function (e) {
    wx.navigateTo({
      url: '../comment/comments' + '?goods_id=' + e.currentTarget.id,
    })

  },
  numJianTap: function (e) {
    currentNum = this.data.buyNumber;
    currentNum--;
    if (currentNum >= startnum) {
      this.setData({
        buyNumber: currentNum,
        shopNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    currentNum = this.data.buyNumber;
    currentNum++;
    this.setData({
      buyNumber: currentNum,
      shopNumber: currentNum

    })

  },
  selected: function (e) {
    let index = e.currentTarget.dataset.index;
    transfering = true;
    setTimeout(() => {
      transfering = false;
    }, 1000);
    this.setData({
      selected1: false,
      selected2: false,
      selected: true,
      toView: index,
      opacity: 0
    })
  },
  selectsku: function (e) {
    this.setData({
      selectsku: false
    })
  },
  selected1: function (e) {
    let index = e.currentTarget.dataset.index;
    transfering = true;
    setTimeout(() => {
      transfering = false;
    }, 1000);
    this.setData({
      selected: false,
      selected1: true,
      selected2: false,
      toView: 'xiangqing',
    })
  },
  selected2: function (e) {
    let index = e.currentTarget.dataset.index;
    transfering = true;
    setTimeout(() => {
      transfering = false;
    }, 1000);
    this.setData({
      selected: false,
      selected1: false,
      selected2: true,
      toView: 'pinpai',
    })
  },
  order1: function (e) {
    this.setData({
      order1: true,
      order2: false,
      order3: false,
      order4: false,
      order5: false,
      ordertime: '1周',
    })

  },
  order2: function (e) {
    this.setData({
      order1: false,
      order2: true,
      order3: false,
      order4: false,
      order5: false,
      ordertime: '2周',
    })

  },
  order3: function (e) {
    this.setData({
      order1: false,
      order2: false,
      order3: true,
      order4: false,
      order5: false,
      ordertime: '3周',
    })

  },
  order4: function (e) {
    this.setData({
      order1: false,
      order2: false,
      order3: false,
      order4: true,
      order5: false,
      ordertime: '4周',
    })

  },
  order5: function (e) {
    this.setData({
      order1: false,
      order2: false,
      order3: false,
      order4: false,
      order5: true,
      zidingyi: true,
    })
  },
  quxiao: function (e) {
    this.setData({
      order1: true,
      order2: false,
      order3: false,
      order4: false,
      order5: false,
      zidingyi: false,
      xieru: true,
    })
  },
  backpre: function () {
    wx.navigateBack({

    })

  },
  isLog: function (options, pages) {
    var that = this;
    wx.getStorage({
      key: 'unionId',
      success: function (res) {
        if (res.data == 1 && pages !== 1) {
          that.fetchData(options);
        } else {
          that.fetchUntoken(options);
        }
      },
      fail: function () {
        that.fetchUntoken(options);
      }
    })
  },
  isShare: function () {
    var that = this;
    wx.getStorage({
      key: 'unionId',
      success: function (res) {
        if (res.data == 1) {
          that.shoucang();
        } else {
          that.fetchData(ls);
          that.shoucang();
        }
      },
      fail: function () {
        that.fetchData(ls);
        that.shoucang();
      }
    })
  },
  getGroupIdDetail: function () {
    var that = this;
    API.getGroupIdDetail(spuid).then((resp) => {
      if (resp === null || resp.length === 0) {
        subsShow = false;
        that.setData({
          subList: [],
          subsShow: subsShow
        })
      } else {
        let items = [];
        for (let i = 0; i < resp.length; i++) {
          for (let k = 0; k < resp[i].skus.length; k++) {
            if (goods_id === resp[i].skus[k].goods_id) {
              items.push(resp[i]);
              break
            }
          }
        }
        subsShow = true;
        that.setData({
          subList: items,
          subsShow: subsShow
        })
      }
    })
  },
  shoucang: function () {
    var that = this;
    if (skuslist[0].is_collect == false) {

      API.collectAdd(spuid, true).then((resp) => {
        skuslist[0].is_collect = true;
        skuslist[0].collect_id = resp.collect.collect_id;
        that.setData({
          list: skuslist
        })
      })
    } else {
      let options = {
        collect_id: skuslist[0].collect_id
      }
      API.collectDelete(options).then((resp) => {
        skuslist[0].is_collect = false;
        that.setData({
          list: skuslist
        })
      })
    }
  },
  haveWaQrCode: function (g, that) {
    if (g.wa_qr_code) {
      goodQr = g.wa_qr_code;
    } else {
      API.shareSave(spuid).then((resp) => {
        goodQr = resp;

        that.setData({
          codeUrl: resp,
        })
      })
    }
  },
  fetchUntoken: function (options) {
    var that = this;

    if (options.sku_id) {
      goods_id = String(options.sku_id.split('-')[0]);
      skuid = options.sku_id;
      API.getGoodsUntoken(goods_id).then((resp) => {
        imagelength = resp[0].details_image.length;
        guigelength = resp[0].skus[0].specification.length;
        productName = resp[0].goods_name;

        speLength = guigelength;
        serviceLength = resp[0].service.length;

        if (resp[0].share_image && resp.share_image !== '-') {
          shareImage = resp[0].share_image;
        } else {
          shareImage = resp[0].default_image;
        }
        shareMsg = resp[0].share;

        if (resp[0].direct) {
          that.isDirect();
        }
        skuslist = resp;
        that.haveWaQrCode(resp[0], that);
        for (var i = 0; i < resp[0].skus.length; i++) {
          if (options.sku_id == resp[0].skus[i].sku_id) {
            skunames = resp[0].skus[i].type_id;
            spuid = goods_id;
            skuid = options.sku_id;

            that.setData({
              selectindexs: i,
              skunames: skunames
            })
          }
        }
        loading = false;
        that.setData({
          loading: loading,
          list: skuslist
        })
      })
    } else {
      goods_id = String(options.goods_id);
      API.getGoodsUntoken(goods_id).then((resp) => {
        imagelength = resp[0].details_image.length;
        guigelength = resp[0].skus[0].specification.length;
        productName = resp[0].goods_name;

        speLength = guigelength;
        serviceLength = resp[0].service.length;

        if (resp[0].share_image && resp.share_image !== '-') {
          shareImage = resp[0].share_image;
        } else {
          shareImage = resp[0].default_image;
        }
        shareMsg = resp[0].share;

        if (resp[0].direct) {
          that.isDirect();
        }
        skuslist = resp;
        that.haveWaQrCode(resp[0], that);
        loading = false;
        that.setData({
          loading: loading,
          list: skuslist
        })
      })
    }
  },
  fetchData: function (options) {
    var that = this;
    if (options.sku_id) {
      goods_id = String(options.sku_id.split('-')[0]);
      skuid = options.sku_id;
      API.getGoodsDetail(goods_id).then((resp) => {
        imagelength = resp[0].details_image.length;
        guigelength = resp[0].skus[0].specification.length;
        
        speLength = guigelength;
        serviceLength = resp[0].service.length;

        if (resp[0].share_image && resp.share_image !== '-') {
          shareImage = resp[0].share_image;
        } else {
          shareImage = resp[0].default_image;
        }
        shareMsg = resp[0].share;

        productName = resp[0].goods_name;
        if (resp[0].direct) {
          that.isDirect();
        }
        skuslist = resp;
        that.haveWaQrCode(resp[0], that);
        for (var i = 0; i < resp[0].skus.length; i++) {
          if (options.sku_id == resp[0].skus[i].sku_id) {
            skunames = resp[0].skus[i].type_id;
            switch (resp[0].styles.length) {
              case 1:
                that.setData({
                  skuvalues: resp[0].skus[i].type_id.split(' ')[0],
                })
                break;
              case 2:
                that.setData({
                  skuvalues: resp[0].skus[i].type_id.split(' ')[0],
                  skuvalues1: resp[0].skus[i].type_id.split(' ')[1],
                })
                break;
              case 3:
                that.setData({
                  skuvalues: resp[0].skus[i].type_id.split(' ')[0],
                  skuvalues1: resp[0].skus[i].type_id.split(' ')[1],
                  skuvalues2: resp[0].skus[i].type_id.split(' ')[2],
                })
                break;
              case 4:
                that.setData({
                  skuvalues: resp[0].skus[i].type_id.split(' ')[0],
                  skuvalues1: resp[0].skus[i].type_id.split(' ')[1],
                  skuvalues2: resp[0].skus[i].type_id.split(' ')[2],
                  skuvalues3: resp[0].skus[i].type_id.split(' ')[3],
                })
                break;
              case 5:
                that.setData({
                  skuvalues: resp[0].skus[i].type_id.split(' ')[0],
                  skuvalues1: resp[0].skus[i].type_id.split(' ')[1],
                  skuvalues2: resp[0].skus[i].type_id.split(' ')[2],
                  skuvalues3: resp[0].skus[i].type_id.split(' ')[3],
                  skuvalues4: resp[0].skus[i].type_id.split(' ')[4],
                })
                break;
            };
            that.setData({
              sureshop: false,
              selectindexs: i,
              skunames: skunames
            })
            break;
          }
        }
        loading = false;
        that.setData({
          loading: loading,
          list: skuslist
        })
      })
    } else {
      goods_id = String(options.goods_id);

      API.getGoodsDetail(goods_id).then((resp) => {
        imagelength = resp[0].details_image.length;
        guigelength = resp[0].skus[0].specification.length;

        speLength = guigelength;
        serviceLength = resp[0].service.length;

        if (resp[0].share_image && resp[0].share_image != '-') {
          shareImage = resp[0].share_image;
        } else {
          shareImage = resp[0].default_image;
        }

        shareMsg = resp[0].share;
        productName = resp[0].goods_name;
        if (resp[0].direct) {
          that.isDirect();
        }
        skuslist = resp;
        loading = false;
        that.haveWaQrCode(resp[0], that);
        that.setData({
          loading: loading,
          list: skuslist
        })
      })
    }
  },
  goCorrelation: function (e) {
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.id,
    })
  },
  //相关商品
  getCorrelation: (spuid) => {
    let newList = [];
    API.getCorrelation(spuid).then((resp) => {
      if (resp.length > 0) {
        for (var i = 0; i < resp.length; i++) {
          if (resp[i].show == true) {
            newList.push(resp[i])
          }
        }
      } else {
        newList = resp;
      }
      that_.setData({
        correlationList: newList
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shareImage = '';
    shareMsg = '';
    var that = this;
    suan = 0;
    suans = 0;
    _imageHeight = 0;
    guigelength = 0;
    speLength = 0;
    _imageHeight = 0;
    _windowWidth = 0
    if (options.scene) {
      let codeId = decodeURIComponent(options.scene);
      let sc = codeId.split('#');
      options.goods_id = sc[0];
      if (sc.length === 2) {
        wx.setStorage({
          key: 'pu',
          data: sc[1],
        })
      }
      wx.setStorage({
        key: 'channel',
        data: '微信小程序',
      })
      wx.setStorage({
        key: 'shareScene',
        data: '商品详情页分享',
      })
    } else {
      options.goods_id = options.goods_id
    }

    that_ = this;
    API.setPage(that);
    loading = true;
    that.setData({
      loading: loading,
      sureshop:true
    })
    if (options.goods_id) {
      new_id = String(options.goods_id);
      spuid = options.goods_id;
    } else {
      new_id = String(options.sku_id.split('-')[0]);
      spuid = String(options.sku_id.split('-')[0]);
    }
    // 屏蔽订阅入口
    subsShow = false;
    // that.getGroupIdDetail(spuid)
    that.getCorrelation(new_id);
    skunames = "请选择规格";
    that.setData({
      selectindexs: 0
    })
    pages = getCurrentPages().length;
    that.isLog(options, pages);
    ls = options;
    if (pages === 1) {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/huidaoshouye.png'
      })
    } else {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/Group%20ss4.png'
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        _windowWidth = res.windowWidth;
        _windowHeight = res.windowHeight;
        that.setData({
          pixelRatio: res.pixelRatio,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    // iPhone X适配
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          iphonex = true;
          that.setData({
            iphonex: true,
            scollMarginTop: 182,
            Xleft: 0,
            Xright: 0,
            Xwidth: 320,
            Xheight: 320
          })
        } else {
          // 不是iPhone X
          iphonex = false;
          that.setData({
            iphonex: false,
            scollMarginTop: 132,
            Xleft: 30,
            Xright: 100,
            Xwidth: 320,
            Xheight: 320
          })
        }
      },
    });
    that.fetchGuess(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        y = 603 / res.windowHeight;
      }
    });
    skunames = "请选择规格";
  
    if (that.data.skuvalues) {
      skuvalues = that.data.skuvalues;
    } else {
      skuvalues = ''
    }
    if (that.data.skuvalues1) {
      skuvalues1 = that.data.skuvalues1;
    } else {
      skuvalues1 = ''
    }
    if (that.data.skuvalues2) {
      skuvalues2 = that.data.skuvalues2;
    } else {
      skuvalues2 = ''
    }
    if (that.data.skuvalues3) {
      skuvalues3 = that.data.skuvalues3;
    } else {
      skuvalues3 = ''
    }
    if (that.data.skuvalues4) {
      skuvalues4 = that.data.skuvalues4;
    } else {
      skuvalues4 = ''
    }
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`
   
    that.setData({
      skunames: skunams
    })
    that.setNewUserCoupon(that);
  },
  // 首次进入弹窗
  // 去新手指南
  setNewUserCoupon: (that) => {
    wx.getStorage({
      key: 'new_user',
      success: function (res) {
        if (res.data) {
          wx.getStorage({
            key: 'showNewUserGuide',
            success: function (res) {
              if (!res.data) {
                that.newUserCoupon(that);
                that.setData({
                  newUser: true
                })
                wx.setStorage({
                  key: 'showNewUserGuide',
                  data: 1,
                })
              }
            },
          })
        }
      },
    })
  },
  newUserCoupon: (that) => {
    wx.getStorage({
      key: 'newUserCoupon',
      success: function (res) {
        let resp = res.data;
        let item = {
          price: resp.price,
          limit: '满' + resp.condition + '元可用',
          expiredAt: JSON.stringify(new Date(Number(resp.expiredAt))).split('T')[0].slice(1) + '到期'
        }
        that.setData({
          quan: item
        })
      },
    })
  },
  goGuide: () => {
    wx.navigateTo({
      url: '../webview/webview?url=https://act.jiyong365.com/jinshitwo.html',
    })
  },
  goCheckCoupon: () => {
    wx.navigateTo({
      url: '../promote/coupon/coupon',
    })
  },
  newUserClose: () => {
    that_.setData({
      newUser: false
    })
    wx.setStorage({
      key: 'new_user',
      data: 0,
    })
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
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500);
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
    if (spuid) {
      // 通过商品ID传递
      return {
        title: shareMsg || skuslist[0].goods_name,
        imageUrl: shareImage,
        path: '/page/product/goodsdetail/goodsdetail?goods_id=' + spuid,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else {
      // 通过sku id传递
      return {
        title: shareMsg || skuslist[0].goods_name,
        imageUrl: shareImage,
        path: '/page/product/goodsdetail/goodsdetail?sku_id=' + skuid,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  },
  guessTap: (e) => {
    let sku_id = e.currentTarget.id
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?goods_id=' + sku_id,
    })
  },
  // 获取猜你喜欢
  fetchGuess: (that) => {
    // 获取猜你喜欢列表
    API.getGuessRandom().then((resp) => {
      let results = [];
      for (let i = 0; i < resp.hits.length; i++) {
        results.push(resp.hits[i]._source);
      }

      for (var i = 0; i < results.length; i++) {
        if (results[i].goods_cashback) {
          if (results[i].goods_cashback < 100) {
            results[i].tagstyle = true
          } else {
            results[i].tagstyle = false
          }
        } else {

        }

      }
      that.setData({
        likeGoods: results
      })
    }, (err) => {
      console.error(err.error_msg);
    })
  },
})