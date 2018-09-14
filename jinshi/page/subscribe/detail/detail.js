// page/subscribe/detail/detail.js
const API = require('../../../api/api.js');
const hSwiper = require("../../../component/hSwiper/hSwiper.js");

let id = '';
let reqId = '';
let that_;
let list = [];
let last_key = '';
let _skus = [];

let wares = [];
let stages = 0;
let waresIndex = 0;
let limit = 1;

let skuIndex = 0;
let iphonex;
//示例数据
let canvasone = 'https://cdn.jiyong365.com/canvas%E5%88%86%E7%BB%84.png';
let canvastwo = 'https://cdn.jiyong365.com/canvas.png';
let canvasthree = 'https://cdn.jiyong365.com/canvas3.png';
let canvaspicture = 'https://cdn.jiyong365.com/Groadasdup%202.png';
//订阅分享数组
let subscribeList = [];
//订阅商品二维码
let wxCode;
//商品组头图
let listPic = '';
//商品组标题
let listTitle;
//会员价格
let listPrice;
//会员返现价
let listCashback;
//字符串的长度超过7自动换成...
function replace(str) {
  var newStr;
  if (str.length > 6) {
    newStr = str.substring(0, 6) + '...';
  } else {
    newStr = str;
  }
  return newStr;
}
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
    hSwiperVar: {
      msg: 'hah',
    },
    loading: true,
    //分享状态
    shareShow: false,
    //适配不同phone
    caleh: '',
    Xleft: '',
    Xright: '',
    Xwidth: '',
    Xheight: '',
    iphonex: '',
    windowWidth: 0,
    windowHeight: 0,
    gif: '../../../image/loading.gif',
    SwxCode: '',
    SlistPic: '',
    Svip: '',
    SvipMsg: '',
    SpicOne: '',
    SpicTwo: '',
    SpicThree: '',
    Sbg: '',
    selectShare:false,
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
    that.setData({
      selectShare: false
    })
  },
  selectT: function () {
    var that = this;
    that.goShare();
  },
  fetchFamilies: () => {
    API.getFamilylist().then((resp) => {
      wx.setStorage({
        key: 'families',
        data: resp.Items,
      })
      wx.hideLoading();
      if(resp.Items.length){
        // 进入订单确认页
        wx.navigateTo({
          url: '../order/confirm?id=' + reqId + '&stages=' + stages+'&limit='+limit,
        })
      } else {
        // 进入家庭创建页
        wx.navigateTo({
          url: '../../family/create/create',
        })
      }
    })
  },
  go: () => {
    wx.showLoading({
      title: '加载中',
    })
    that_.fetchFamilies();
  },
  back: () => {
    let pages = getCurrentPages();
    if(pages.length === 1){
      wx.navigateTo({
        url: '../../index/index',
      })
    }else{
      wx.navigateBack({

      })
    }
  },
  skuTap: (e) => {
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?sku_id=' + e.currentTarget.id,
    })
  },
  priceTap: (e) => {
    let pIndex = Number(e.currentTarget.dataset.index);
    that_.setPriceMethod(pIndex);
  },
  setPriceMethod: (selectIndex) => {
    if (!selectIndex) {
      selectIndex = 0;
    }
    let items = [];
    let singlePrice = 0;
    let dDiscount = 0;
    let waresName = '';
    listPrice = wares[waresIndex].price[wares[waresIndex].price.length - 1].price;
    listCashback = wares[waresIndex].price[wares[waresIndex].price.length - 1].price - wares[waresIndex].price[wares[waresIndex].price.length - 1].vip_price;
    waresName = wares[waresIndex].title || '';
    for (let i = 0; i < wares[waresIndex].price.length; i++) {
      if (i === selectIndex) {
        items.push({
          select: 's',
          name: wares[waresIndex].price[i].stages + '期',
          discount: '会员每期￥' + wares[waresIndex].price[i].vip_price,
          id: wares[waresIndex].price[i].id
        })
        singlePrice = wares[waresIndex].price[i].price;
        dDiscount = (wares[waresIndex].price[i].price - wares[waresIndex].price[i].vip_price) * wares[waresIndex].price[i].stages;
        reqId = wares[waresIndex].price[i].id;
        stages = wares[waresIndex].price[i].stages;
        limit = wares[waresIndex].limit;
      }else {
        items.push({
          select: 'ns',
          name: wares[waresIndex].price[i].stages + '期',
          discount: '会员每期￥' + wares[waresIndex].price[i].vip_price,
          id: wares[waresIndex].price[i].id
        })
      }
    }

    that_.setData({
      waresName: waresName,
      prices: items,
      price: singlePrice,
      discount: dDiscount
    })
  },
  // 设置SKU
  setSkus: () => {
    let skus = [];
    for (let i = 0; i < _skus.length; i++) {
      let item = {
        list: _skus[i]
      }
      skus.push(item);
    }
    skus[0].style = 'f';
    if (skus.length > 1) {
      skus[1].style = 'b';
    }
    wx.setStorage({
      key: 'selectSubscribeSku',
      data: skus[0],
    });
    subscribeList = skus[0].list;
    var swiper = new hSwiper({ reduceDistance: 30, varStr: 'hSwiperVar', templateName: 'subscribeSku', list: skus });
    swiper.afterViewChange = function (data, index) {
      skuIndex = index;
      waresIndex = index;
      that_.setPriceMethod();
      for (let i = 0; i < skus.length; i++) {
        if (i === index) {
          skus[i].style = 'f';
          subscribeList = skus[index].list;
          wx.setStorage({
            key: 'selectSubscribeSku',
            data: skus[i],
          })
        } else {
          skus[i].style = 'b'
        }
      }
      swiper.updateList(skus);
    }
  },
  //隐藏分享浮层
  hiddenShare: function () {
    var that = this;
    that.setData({
      shareShow: false
    })
    wx.hideLoading();
  },
  //去分享
  goShare: function () {
    var that = this;
    that.setData({
      shareShow: true
    })
    wx.showLoading({
      title: '二维码加载中...',
    })

    that.share();
  },
  //保存手机相册
  wxCreate: function () {
    var that = this;
    setTimeout(function () {
      that.toCreate()
    }, 100)
  },
  //canvas生成图片
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
                                  icon: 'none',
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
                  //       icon: 'none',
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
  //canvas画图
  share: function () {
    var that = this;
    wx.downloadFile({
      url: listPic, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          that.setData({
            SlistPic: res.tempFilePath
          })
          wx.downloadFile({
            url: canvaspicture, //仅为示例，并非真实的资源
            success: function (resp) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                that.setData({
                  Svip: resp.tempFilePath
                })
                wx.downloadFile({
                  url: canvasthree, //仅为示例，并非真实的资源
                  success: function (rest) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                      that.setData({
                        SvipMsg: rest.tempFilePath
                      })
                      wx.downloadFile({
                        url: wxCode, //仅为示例，并非真实的资源
                        success: function (resc) {
                          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                          if (res.statusCode === 200) {
                            that.setData({
                              SwxCode: resc.tempFilePath
                            })
                            wx.downloadFile({
                              url: canvastwo, //仅为示例，并非真实的资源
                              success: function (resg) {
                                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                if (res.statusCode === 200) {
                                  that.setData({
                                    Sbg: resg.tempFilePath
                                  })
                                  let ctxW = that.data.windowWidth;
                                  let XS = that.data.windowWidth / 375;
                                  that.setData({
                                    caleh: XS
                                  })
                                  //开始构造画布
                                  var ctx = wx.createCanvasContext('codeCanvas');
                                  ctx.setFillStyle("#FFFFFF");
                                  ctx.fillRect(0, 0, 300, 800);
                                  ctx.drawImage(that.data.SlistPic, 0, 0, 300, 130 * XS);
                                  ctx.setFillStyle('#333333');
                                  ctx.setFontSize(15);
                                  ctx.setTextAlign('center');
                                  ctx.fillText(listTitle, 150, 130 * XS + 30);
                                  ctx.setFillStyle('#FF7A7A');
                                  ctx.setFontSize(15);
                                  ctx.setTextAlign('center');
                                  ctx.fillText('￥' + listPrice, 145, 130 * XS + 55);
                                  // ctx.drawImage(that.data.Svip, 153 - 60, 130 * XS + 65, 60, 15.5);
                                  // ctx.setStrokeStyle('#FFB18C');
                                  // ctx.setFillStyle('#FFB18C');
                                  // ctx.setFontSize(12);
                                  // ctx.strokeRect(150, 130 * XS + 66, 14 * ('￥' + listCashback).split('').length, 14);
                                  // ctx.setTextAlign('left');
                                  // ctx.fillText('￥' + listCashback, 155, 130 * XS + 77);
                                  ctx.setTextAlign('center')
                                  ctx.drawImage(that.data.SvipMsg, 50, 130 * XS + 65, 200, 25);
                                  ctx.drawImage(that.data.Sbg, 20, 130 * XS + 105, 260, 120);
                                  //处理商品组
                                  if (subscribeList.length == 1) {
                                    wx.downloadFile({
                                      url: subscribeList[0].cover, //仅为示例，并非真实的资源
                                      success: function (resm) {
                                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                        if (res.statusCode === 200) {
                                          that.setData({
                                            SpicOne: resm.tempFilePath
                                          })
                                          ctx.drawImage(that.data.SpicOne, 110, 130 * XS + 105, 60, 60);
                                          ctx.setFillStyle('#333333');
                                          ctx.setFontSize(13);
                                          ctx.setTextAlign('center');
                                          ctx.fillText(subscribeList[0].goods_name, 140, 130 * XS + 185, 170, 20);
                                          ctx.setFillStyle('#7F7F7F');
                                          ctx.setFontSize(12);
                                          ctx.setTextAlign('center');
                                          ctx.fillText(subscribeList[0].type_id + 'x' + subscribeList[0].num, 135, 130 * XS + 205, 170, 20);
                                          ctx.setFillStyle('#7F7F7F');
                                          ctx.setFontSize(12);
                                          ctx.setTextAlign('center');
                                          ctx.fillText('扫一扫进入商城', 150, 370 * XS + 5);
                                          ctx.drawImage(that.data.SwxCode, 100, 380 * XS+10, 100, 100);
                                          ctx.draw();
                                          setTimeout(function () {
                                            wx.hideLoading()
                                          }, 2000)

                                        }
                                      }
                                    })

                                  } else if (subscribeList.length == 2) {
                                    wx.downloadFile({
                                      url: subscribeList[0].cover, //仅为示例，并非真实的资源
                                      success: function (ress) {
                                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                        if (res.statusCode === 200) {
                                          that.setData({
                                            SpicOne: ress.tempFilePath
                                          })
                                          wx.downloadFile({
                                            url: subscribeList[1].cover, //仅为示例，并非真实的资源
                                            success: function (rescc) {
                                              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                              if (res.statusCode === 200) {
                                                that.setData({
                                                  SpicTwo: rescc.tempFilePath
                                                })
                                                ctx.drawImage(that.data.SpicOne, 60, 130 * XS + 135, 60, 60);
                                                ctx.setFillStyle('#333333');
                                                ctx.setFontSize(13);
                                                ctx.setTextAlign('left');
                                                ctx.fillText(replace(subscribeList[0].goods_name), 60, 130 * XS + 215, 100, 20);
                                                ctx.setFillStyle('#7F7F7F');
                                                ctx.setFontSize(12);
                                                ctx.setTextAlign('left');
                                                ctx.fillText(subscribeList[0].type_id + 'x' + subscribeList[0].num, 65, 130 * XS + 235, 60, 20);
                                                ctx.drawImage(that.data.SpicTwo, 180, 130 * XS + 135, 60, 60);
                                                ctx.setFillStyle('#333333');
                                                ctx.setFontSize(13);
                                                ctx.setTextAlign('left');
                                                ctx.fillText(replace(subscribeList[1].goods_name), 180, 130 * XS + 215, 100, 20);
                                                ctx.setFillStyle('#7F7F7F');
                                                ctx.setFontSize(12);
                                                ctx.setTextAlign('left');
                                                ctx.fillText(subscribeList[1].type_id + 'x' + subscribeList[1].num, 185, 130 * XS + 235, 60, 20);
                                                ctx.setFillStyle('#7F7F7F');
                                                ctx.setFontSize(12);
                                                ctx.setTextAlign('center');
                                                ctx.fillText('扫一扫进入商城', 150, 370 * XS + 35);
                                                ctx.drawImage(that.data.SwxCode, 100, 380 * XS + 30, 100, 100);
                                                ctx.draw();
                                                setTimeout(function () {
                                                  wx.hideLoading()
                                                }, 2000)
                                              }
                                            }
                                          })

                                        }

                                      }
                                    })

                                  } else {
                                    wx.downloadFile({
                                      url: subscribeList[0].cover, //仅为示例，并非真实的资源
                                      success: function (ress) {
                                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                        if (res.statusCode === 200) {
                                          that.setData({
                                            SpicOne: ress.tempFilePath
                                          })
                                          wx.downloadFile({
                                            url: subscribeList[1].cover, //仅为示例，并非真实的资源
                                            success: function (rescc) {
                                              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                              if (res.statusCode === 200) {
                                                that.setData({
                                                  SpicTwo: rescc.tempFilePath
                                                })
                                                wx.downloadFile({
                                                  url: subscribeList[2].cover, //仅为示例，并非真实的资源
                                                  success: function (resee) {
                                                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                                    if (res.statusCode === 200) {
                                                      that.setData({
                                                        SpicThree: resee.tempFilePath
                                                      })
                                                      ctx.drawImage(subscribeList[0].cover, 30, 130 * XS + 135, 60, 60);
                                                      ctx.setFillStyle('#333333');
                                                      ctx.setFontSize(13);
                                                      ctx.setTextAlign('left');
                                                      ctx.fillText(replace(subscribeList[0].goods_name), 30, 130 * XS + 215, 100, 20);
                                                      ctx.setFillStyle('#7F7F7F');
                                                      ctx.setFontSize(12);
                                                      ctx.setTextAlign('left');
                                                      ctx.fillText(replace(subscribeList[0].type_id + 'x' + subscribeList[0].num), 30, 130 * XS + 235, 60, 20);
                                                      ctx.drawImage(subscribeList[1].cover, 120, 130 * XS + 135, 60, 60);
                                                      ctx.setFillStyle('#333333');
                                                      ctx.setFontSize(13);
                                                      ctx.setTextAlign('left');
                                                      ctx.fillText(replace(subscribeList[1].goods_name), 120, 130 * XS + 215, 100, 20);
                                                      ctx.setFillStyle('#7F7F7F');
                                                      ctx.setFontSize(12);
                                                      ctx.setTextAlign('left');
                                                      ctx.fillText(replace(subscribeList[1].type_id + 'x' + subscribeList[1].num), 130, 130 * XS + 235, 60, 20);
                                                      ctx.drawImage(subscribeList[2].cover, 210, 130 * XS + 135, 60, 60);
                                                      ctx.setFillStyle('#333333');
                                                      ctx.setFontSize(13);
                                                      ctx.setTextAlign('left');
                                                      ctx.fillText(replace(subscribeList[2].goods_name), 210, 130 * XS + 215, 60, 20);
                                                      ctx.setFillStyle('#7F7F7F');
                                                      ctx.setFontSize(12);
                                                      ctx.setTextAlign('left');
                                                      ctx.fillText(replace(subscribeList[2].type_id + 'x' + subscribeList[2].num), 215, 130 * XS + 235, 60, 20);
                                                      ctx.setFillStyle('#7F7F7F');
                                                      ctx.setFontSize(12);
                                                      ctx.setTextAlign('center');
                                                      ctx.fillText('扫一扫进入商城', 150, 370 * XS + 35);
                                                      ctx.drawImage(that.data.SwxCode, 100, 380 * XS + 30, 100, 100);
                                                      ctx.draw();
                                                      setTimeout(function () {
                                                        wx.hideLoading()
                                                      }, 2000)
                                                    }
                                                  }
                                                })

                                              }
                                            }
                                          })

                                        }

                                      }
                                    })
                                  }

                                }
                              }
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
        }
      }
    })

  },
  fetchData: () => {
    API.getSubscribeDetail(id).then((resp) => {
      console.log(resp)
      listPic = resp.cover;
      listTitle = resp.title;
      listPic = resp.share_cover || '';
      // 构建_skus
      _skus = [];
      for (let i = 0; i < resp.wares.length; i++) {
        _skus.push(resp.wares[i].skus);
      }
      that_.setSkus();
      wares = resp.wares;
      that_.setPriceMethod();
      wx.stopPullDownRefresh();
      that_.setData({
        loading: false,
        list: list,
        title:resp.title,
        cover:resp.list_cover,
        waresNum:resp.wares.length
      })
    }, (err) => {
      console.error(err.error_msg)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      id = decodeURIComponent(options.scene);
      wx.setStorage({
        key: 'channel',
        data: '微信小程序',
      })
      wx.setStorage({
        key: 'shareScene',
        data: '订阅分享',
      })
    } else {
      id = options.id;// 订阅商品ID
    }
    API.getSubscribeCode(id).then((resp) => {
      wxCode = resp;
    })
    that_ = this;
   
    API.setPage(that_);
    list = [];
    last_key = '';
    that_.fetchData();
    let that = this;
    //手机型号
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
            Xleft: 30,
            Xright: 100,
            Xwidth: 320,
            Xheight: 320
          })
        }
      },
    });
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
    let that = this;
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
      url: '../../webview/webview?url=https://act.jiyong365.com/jinshitwo.html',
    })
  },
  goCheckCoupon: () => {
    wx.navigateTo({
      url: '../../promote/coupon/coupon',
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
    list = [];
    last_key = '';
    that_.fetchData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (last_key) {
      that_.fetchData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: listTitle,
      imageUrl: listPic,
      path: 'page/subscribe/detail/detail?id='+id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})