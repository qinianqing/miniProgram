// page/index/index.js
const API = require('../../api/api.js');

let that_;

let guessList = [];

let banners = [];
let recs = [];
let hot = [];

// slide横滑公共参数
let touchItemID;
let touchStartX;
let touchStartY;
let touchItem;
let RPX = 0;
let recBanners = [];
let slides = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    slideAnmiation: 'transition: transform 800ms ease 0ms; transform: translateX(11.5px) translate3d(0px, 0px, 0px); transform-origin: 50% 50% 0px;',
    newUser: false,
    quan: {
      price: 20,
      limit: 100,
      expiredAt: '2018-12-30'
    },
    indexBVar: {
      msg: 'ind',
    },
    loading: true,
    gif: '../../image/loading.gif',
    showLoginModal: false,
    navs: [{
        pic: '../../image/category_en.png',
        title: '分类'
      },
      // {
      //   pic: '../../image/subscribe_en.png',
      //   title: '订阅'
      // },
      {
        pic: '../../image/fuli.png',
        title: '发红包'
      }, {
        pic: '../../image/search_en.png',
        title: '搜索'
      }
    ],
    ens: [{
      pic: 'https://cdn.jiyong365.com/ff-member.png',
      title: '家人',
      focus: '爱的表达方式'
    }, {
      pic: 'https://cdn.jiyong365.com/ff-space.png',
      title: '空间',
      focus: '品质改变生活'
    }]
  },
  // slide item滑动事件
  setRecBanner: (lists) => {
    recBanners = lists;
    for (let i = 0; i < lists.length; i++) {
      recBanners[i].left = 0;
    }
    for (let i = 0; i < 2; i++) {
      lists[i].left = 0;
      slides.push(lists[i]);
    }
    that_.setData({
      slides: slides
    })
  },
  setSlides: function(cover) {
    slides = [];
    for (let i = 0; i < recBanners.length; i++) {
      recBanners[i].left = 0;
    }
    if (recBanners.length === 2) {
      for (let i = 0; i < recBanners.length; i++) {
        if (cover === recBanners[i].cover) {
          if (i === 0) {
            slides.push(recBanners[1]);
            slides.push(recBanners[0]);
          } else {
            slides.push(recBanners[0]);
            slides.push(recBanners[1]);
          }
        }
      }
    } else if (recBanners.length > 2) {
      for (let i = 0; i < recBanners.length; i++) {
        if (cover === recBanners[i].cover) {
          if (i === recBanners.length - 1) {
            slides.push(recBanners[0]);
            slides.push(recBanners[1]);
          } else if (i === recBanners.length - 2) {
            slides.push(recBanners[recBanners.length - 1]);
            slides.push(recBanners[0]);
          } else {
            slides.push(recBanners[i + 1]);
            slides.push(recBanners[i + 2]);
          }
        }
      }
    }
    that_.setData({
      slides: slides
    })
  },
  itemTouchStart: function(e) {
    touchItem = e.currentTarget.id;
    touchItemID = e.currentTarget.dataset.cover;
    touchStartX = e.touches[0].pageX;
    touchStartY = e.touches[0].pageY;
  },
  itemTouchMove: function(e) {
    if (touchItem === 'rec-slide-1') {
      return 0;
    }
    var currentX = e.touches[0].pageX;
    // 只有向左移，同时超过60rpx的时候，才会触发滑动操作
    const bufferX = 20;
    // 正数向左，负数向右
    var moveDistance = touchStartX - currentX;
    if (moveDistance > bufferX) {
      // 计算RPX的值
      var moveRPX = 2 * moveDistance / RPX;

      if (moveRPX / 2 > 100) {
        that_.setSlides(touchItemID);
      } else {
        // 遍历list
        for (let i = 0; i < slides.length; i++) {
          if (touchItemID == slides[i].cover) {
            slides[i].left = -moveRPX;
          }
        }
      }
      // // 遍历list
      // for (let i = 0; i < slides.length; i++) {
      //   if (touchItemID == slides[i].cover) {
      //     slides[i].left = -moveRPX;
      //   }
      // }
      var that = this;
      that.setData({
        slides: slides,
      })
    }
  },
  itemTouchEnd: function(e) {
    if (touchItem === 'rec-slide-1') {
      return 0;
    }
    var that = this;
    // 结束，如果移动的距离少于
    var currentX = e.changedTouches[0].pageX;
    var currentY = e.changedTouches[0].pageY;
    // 只有向左移，同时超过60rpx的时候，才会触发滑动操作
    const lineX = 70; // 阈值
    // 正数向左，负数向右
    var moveDistance = touchStartX - currentX;
    var moveDistanceY = touchStartY - currentY;
    if (moveDistance > lineX) {
      // 超过250停在最左侧
      that_.setSlides(touchItemID);
    } else if (moveDistance < 3) {
      if (moveDistanceY < 3 && moveDistanceY >=0 && moveDistance >=0) {
        that_.bannerTaps(e);
      }
    } else {
      for (let i = 0; i < slides.length; i++) {
        if (touchItemID == slides[i].cover) {
          slides[i].left = 0;
        }
      }
      that.setData({
        slides: slides
      })
    }
    touchStartX = -1;
    touchItemID = '';
    touchItem = '';
  },

  onlyIndexHave: 1,
  // 授权登录
  goReLogin: function(e) {
    let userInfo = e.detail;
    API.rebind(userInfo);
  },
  letLoginModalShow: function(f) {
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
  // 商品点击事件
  spuTap: (e) => {
    if (e.currentTarget.dataset.sku) {
      wx.navigateTo({
        url: '../product/goodsdetail/goodsdetail?sku_id=' + e.currentTarget.dataset.sku,
      })
    } else {
      wx.navigateTo({
        url: '../product/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.id,
      })
    }
  },
  spuIdTap: (e) => {
    wx.navigateTo({
      url: '../product/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.id,
    })
  },
  // banner
  bannerTap: (e) => {
    let indexTap = parseInt(e.currentTarget.id.split('&')[1]);
    let currentBanner = banners[indexTap];
    switch (currentBanner.type) {
      case 0:
        wx.navigateTo({
          url: '../webview/webview?url=' + currentBanner.content,
        })
        break;
      case 1:
        wx.navigateTo({
          url: currentBanner.content,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../product/goodsdetail/goodsdetail?goods_id=' + currentBanner.content,
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../product/goodsgroup/goodsgroup?group_id=' + currentBanner.content,
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../subscribe/detail/detail?id=' + currentBanner.content,
        })
        break;
    }
  },
  bannerTaps: (e) => {
    let indexTap = e.currentTarget.dataset.id;
    let currentBanner = '';
    for (let i = 0; i < hot.length; i++) {
      if (hot[i].cover === indexTap) {
        currentBanner = hot[i];
        break;
      }
    }
    switch (currentBanner.type) {
      case 0:
        wx.navigateTo({
          url: '../webview/webview?url=' + currentBanner.content,
        })
        break;
      case 1:
        wx.navigateTo({
          url: currentBanner.content,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../product/goodsdetail/goodsdetail?goods_id=' + currentBanner.content,
        })
        break;
      case 3:
        wx.navigateTo({
          url: '../product/goodsgroup/goodsgroup?group_id=' + currentBanner.content,
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../subscribe/detail/detail?id=' + currentBanner.content,
        })
        break;
    }
  },
  bannerChange: (e) => {
    let current = e.detail.current;
    that_.setBannerDot(current);
  },
  // 设置banner。
  setBannerDot: (current) => {
    let width = 12 * banners.length + 19 * (banners.length - 1);
    let margin = (750 - width) / 2;
    let bannerDots = [];
    for (let i = 0; i < banners.length; i++) {
      if (i === current) {
        bannerDots.push('../../image/dot_f.png')
      } else {
        bannerDots.push('../../image/dot_b.png')
      }
    }
    that_.setData({
      bannerDots: bannerDots,
      dotsMargin: margin,
      dotsWidth: width
    })
  },
  // nav item tap
  navItemTap: (e) => {
    let whichTap = parseInt(e.currentTarget.id.split('&')[1]);
    switch (whichTap) {
      case 0:
        wx.navigateTo({
          url: '../category/index',
        })
        break;
        // case 1:
        //   wx.navigateTo({
        //     url: '../subscribe/index',
        //   })
        //   break;
      case 1:
        wx.navigateTo({
          url: '../welfare/welfare',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '../search/search',
        })
        break;
    }
  },
  // 快速入口点击
  enItemTap: (e) => {
    let whichTap = parseInt(e.currentTarget.id.split('&')[1]);
    switch (whichTap) {
      case 0:
        wx.navigateTo({
          url: '../product/member/member',
        })
        break;
      case 1:
        wx.navigateTo({
          url: '../product/space/space',
        })
        break;
        // case 2:
        //   wx.navigateTo({
        //     url: '../product/goodsgroup/new_board',
        //   })
        //   break;
    }
  },
  // rec
  groupTap: (e) => {
    // 配置排行榜title一定要一致
    if (e.currentTarget.dataset.title === '人气排行榜') {
      wx.navigateTo({
        url: '../product/ranking/ranking?group_id=' + e.currentTarget.dataset.id
      })
    } else {
      wx.navigateTo({
        url: '../product/goodsgroup/goodsgroup?group_id=' + e.currentTarget.dataset.id,
      })
    }
  },
  // 唯一数据获取接口
  fetchData: (that) => {
    API.getIndex().then((resp) => {

      wx.stopPullDownRefresh();
      // 格式化数据
      banners = resp.banner;
      that.setBannerDot(0);
      recs = resp.subject;
      that.formatRecs(resp.subject);
      that.setData({
        loading: false,
        banners: banners,
        //recs: recs
      })
    }, (err) => {
      console.error(err.error_msg)
    })
  },
  formatRecs: (data) => {
    let recsTarget = [];
    let lb = '';
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === 0) {
        hot = data[i].content;
        that_.setRecBanner(data[i].content);
        lb = data[i];
      } else {
        recsTarget.push(data[i]);
      }
    }
    that_.setData({
      lba: lb,
      recs: recsTarget
    })
  },
  fetchGuess: (that) => {
    let theFrom = guessList.length;
    API.getIndexGuess(theFrom).then((resp) => {
      let items = [];
      for (let i = 0; i < resp.hits.length; i++) {
        items.push(resp.hits[i]._source);
      }
      guessList = guessList.concat(items);
      that.setData({
        guessList: guessList
      })
    }, (err) => {
      console.error(err.error_msg)
    })
  },
  // 处理扫码SCENE值
  handleScene: function(scene) {
    scene = decodeURIComponent(scene);
    if (scene) {
      // 判断是不是新用户
      wx.getStorage({
        key: 'isNewUser',
        success: function(res) {
          if (res.data == 1) {
            let parm = {
              user_id: scene,
            }
            API.createInvite(parm).then((resp) => {
              // 领券成功

              // TODO
            })
          } else {
            wx.showModal({
              title: '新人券仅限新人领取哦!',
              content: '请在福利频道查看更多福利',
              showCancel: false,
              confirmText: '朕知道了',
              confirmColor: '#FD8075'
            })
          }
        },
      })
    }
  },
  // 处理直接分享
  handleScenes: function(scene) {
    scene = String(scene);
    if (scene) {
      // 判断是不是新用户
      wx.getStorage({
        key: 'isNewUser',
        success: function(res) {
          if (res.data == 1) {
            let parm = {
              user_id: scene,
            }
            API.createInvite(parm).then((resp) => {
              // 领券成功
              // TODO

            })
          } else {
            wx.showModal({
              title: '新人券仅限新人领取哦!',
              content: '请在福利频道查看更多福利',
              showCancel: false,
              confirmText: '朕知道了',
              confirmColor: '#FD8075'
            })
          }
        },
      })
    }
  },
  // 跳转个人中心
  gomine: function() {
    wx.navigateTo({
      url: '../user/mine/mine',
    })
  },
  // 跳转购物车
  formSubmit: function(e) {
    if (e.detail.formId) {
      let tDate = Date.now() + 7 * 1000 * 60 * 60 * 24;
      let p = {
        form_id: e.detail.formId,
        quota: 1,
        expiredAt: tDate
      }
      API.addFormId(p).then((resp) => {}, (err) => {
        console.error(err.message);
      })
    };
    wx.navigateTo({
      url: '../cart/navcart',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that_ = this;
    API.setPage(that_);
    if (options.scene) {
      // 邀请来自朋友圈分享
      that_.handleScene(options.scene);
    }
    if (options.user_Id) {
      // 邀请来自好友分享
      that_.handleScenes(options.user_Id);
    }

    that_.fetchData(that_);
    guessList = [];
    that_.fetchGuess(that_);

    let that = this;
    wx.getStorage({
      key: 'iPhoneX',
      success: function(res) {
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
    // 计算rpx比值
    wx.getSystemInfo({
      success: function(res) {
        RPX = 750 / res.windowWidth;
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.setNewUserCoupon(that);
  },
  // 首次进入弹窗
  // 去新手指南
  setNewUserCoupon: (that) => {
    wx.getStorage({
      key: 'new_user',
      success: function(res) {
        if (res.data) {
          wx.getStorage({
            key: 'showNewUserGuide',
            success: function(res) {
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
      success: function(res) {
        let resp = res.data;
        let item = {
          price: resp.price,
          limit: resp.condition,
          expiredAt: JSON.stringify(new Date(Number(resp.expiredAt))).split('T')[0].slice(1)
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // banners = [];
    // recs = [];
    that_.fetchData(that_);
    guessList = [];
    that_.fetchGuess(that_);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    that_.fetchGuess(that_);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '家庭采购上锦时',
      path: '/page/index/index',
      imageUrl: 'https://cdn.jiyong365.com/%E9%A6%96%E9%A1%B5%E5%88%86%E4%BA%AB.png',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  }
})