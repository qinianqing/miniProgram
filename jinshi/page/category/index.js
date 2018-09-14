// page/category/index.js
const API = require('../../api/api.js');

var status = 1;// 1是分类状态，0是品牌状态

let categoryDetails = [];// 存储分类详情

var contentHeight;
// 控制分类列表
var levelOne = [];
var top = 0;
var listArray = [];
var topList = [];
var tops = 0;
var topsum = 0;
var topsumlist = [];
var topstar = [];

let n = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif:'../../image/loading.gif',
    toView:''
  },
  back: function () {
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
  topicTap: function (e){
    // 加载话题
    wx.navigateTo({
      url: '../webview/webview?url='+e.currentTarget.id,
    })
  },
  search: function (){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  fetchData:function(that){
    API.getCategories().then((resp) => {
      that.formatData(resp);
      that.setData({
        content: categoryDetails,
        oneLevelCategory: levelOne,
        categoryBoxHeight: contentHeight,
        loading: false
      })
      that.calcTop();
    }, (err) => {
      console.error(err.error_msg);
    })
  },
  formatData:function(d){
    levelOne = [];
    for(let i=0;i<d.length;i++){
      let item = {
        id:d[i].index,
        title:d[i].name,
      }
      if(i==0){
        item.show = true;
        item.style = 'lta';
      }else{
        item.show = false;
        item.style = 'lt';
      }
      levelOne.push(item);
      categoryDetails.push(d[i].content)
    }
  },
  categoryTap: function (e){
    // 把id传给下游页面
    wx.navigateTo({
      url: './level2/level2?id=' + e.currentTarget.id + '&level3name=' + e.currentTarget.dataset.title + '&index=' + e.currentTarget.dataset.index + '&title=' + e.currentTarget.dataset.title,
    })
  },
  brandTap: function (e){
    // 点击品牌
    // 跳转商品列表页，按品牌聚合
    wx.navigateTo({
      url: '../product/brand/brand?brand_id=' + e.currentTarget.id,
    })
  },
  // 点分类筛选
  indexTap: function (e){
    var that = this;
    var indexs = 'a' + e.currentTarget.id;
    var getTitle = e.currentTarget.dataset.title;
    var index = -1;
    for(let i=0;i<levelOne.length;i++){
      if(getTitle == levelOne[i].title){
        index = i;
      }
    };
    if(index>=0){
      for (let i = 0; i < levelOne.length; i++) {
        levelOne[i].show = false;
        levelOne[i].style = 'lt';
      };
      levelOne[index].show = true;
      levelOne[index].style = 'lta';
      var that = this;
      that.setData({
        oneLevelCategory: levelOne,
        toView:indexs
      })
    }
  },
  scroll:function(e){
  for (let i = 0; i < levelOne.length; i++) {
    levelOne[i].show = false;
    levelOne[i].style = 'lt';
  };
  top = e.detail.scrollTop;
  for (let j = 0; j < topsumlist.length;j++){
    if(top < topsumlist[j]){
      levelOne[j].show = true;
      levelOne[j].style = 'lta';
      break;
    }
  }
   var that = this;
   that.setData({
     oneLevelCategory: levelOne,
   })
  },
  calcTop:function(){
      for(var i = 0;i < categoryDetails.length;i++){
        if(categoryDetails[i][0].type == 1){
          tops = 130 * categoryDetails[i][0].list.length;
           topList.push(tops);
        }else{
          tops = 140 * Math.ceil((categoryDetails[i][0].list.length / 2))
          topList.push(tops);
        }
      }
      topstar = topList.reduce(function(a,b){
        topsumlist.push(a);
        return a + b;
      })
      topsumlist.push(topstar);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //wx.setStorageSync('loginFromIndex', 1);
    n = 0;
    let that = this;
    that.setData({
      loading: true
    })
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
    })

    // 获取页面高度，设置scroll的高度
    wx.getSystemInfo({
      success: function(res) {
        // 需要减去导航栏、底部导航栏还有状态条
        contentHeight = (res.screenHeight-113.5)*750/res.screenWidth-110;
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
    categoryDetails.splice(0, categoryDetails.length)
    let that = this;
    if(n !== 0){
      wx.showLoading({
        title: '更新数据',
      })
    }
    that.fetchData(that);
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