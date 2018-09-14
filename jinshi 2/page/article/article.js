// page/article/article.js
const API = require('../../api/api.js');
let iphonex;
let that_;
let pages;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iphonex: false,
    autoplay: true,
    interval: 5000,
    duration: 200,
    circular: true,
    indicatorDots: true,
    indicatorActiveColor: "#FFEB96",
    indicatorColor: 'white',
    //好文
    article: {
      image: 'https://img0.jiyong365.com/pic1527763780300e06b3zk6ei.jpg',
      title: '强烈推荐:不能错过巨好吃的零食',
      titleTwo: '【解馋篇】',
      describe: '热饮组合可乐香槟雪可乐香槟雪',
      avatar: 'https://wx.qlogo.cn/mmopen/vi_32/rN7bd68doskG2UqVbVSmbERibX3pS1a61JhZzxIwgW8G4MWNF6ICMkTdiaPy2U3nNMomFh8CcRoF8viavoLHLHd4A/132',
      num: 100,
      user: '多吃不胖的小仙女',
      goods_id: '10137',
      carousel_image: ['https://img0.jiyong365.com/pic15277637566752iepd2yogrx.jpg', 'https://img0.jiyong365.com/pic1527763764349nrhpwsd46oe.jpg', 'https://img0.jiyong365.com/pic1527763769935zhh0am808xe.jpg', 'https://img0.jiyong365.com/pic15277637745257654f2y0eao.jpg', 'https://img0.jiyong365.com/pic1527763780300e06b3zk6ei.jpg'],
      content: '夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天,🎧🎧🎧🎧🎧🎧,听着小曲，吃着冰 那才是夏天呀！最近天气好热！在家尝试了一些有趣的冰品🍹,最近天气好热！在家尝试了一些有趣的冰品🍹,夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天夏天难免有冲动~夏天难免有惶恐~夏天需要一阵风~来度过夏天'
   
    },
    //goods
    goods:{
      image:'https://img0.jiyong365.com/pic15277637566752iepd2yogrx.jpg',
      goods_name:'牛奶味饼干',
      describe:'越南零食品牌，采摘新鲜的果实，果肉色泽饱满各种果干口味任你选',
      goods_price:44.5
    }
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
  //取数据
  fetchData: () => {

  },
  //返回
  back: function () {
    if (pages === 1) {
      wx.redirectTo({
        url: '../../index/index',
      })
    } else {
      wx.navigateBack({
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that_ = this;
    var that = this;
    API.setPage(that);
    pages = getCurrentPages().length;
    //判断机型
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          iphonex = true;
          that.setData({
            iphonex: true,
          })
        } else {
          // 不是iPhone X
          iphonex = false;
          that.setData({
            iphonex: false,
          })
        }
      },
    });
    if (pages === 1) {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/huidaoshouye.png'
      })
    } else {
      that.setData({
        navBack: 'https://cdn.jiyong365.com/Group%20ss4.png'
      })
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
  onShareAppMessage: function () {

  }
})