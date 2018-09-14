// page/category/level2/level2.js
const API = require('../../../api/api.js')
var brandType = [];
var list = [];
var index = '';
var shunxu = '';
var indexs = '';
var title = '';

let currentID = '';

let isLastPage = true;
let fromP = 0;
var pageTotal = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true,
    list: [1, 2]
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
  goProductDetail: function (e) {
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.id
    })
  },
  click: function (e) {
    var that = this;
    that.setData({
      loading: true,
      shunxu: e.currentTarget.dataset.index
    })
    // brandType[0].select = '-n';
    // brandType[0].show = false;
    list.splice(0, list.length)
    let level3_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    title = e.currentTarget.dataset.title;
    fromP = 0;
    currentID = level3_id;
    API.categoryThreeList(level3_id, fromP).then((resp) => {
      let d = resp.hits;
      if (d.length === 20) {
        isLastPage = false;
        fromP = 20;
      } else {
        isLastPage = true;
      }
      if (d.length > 0) {
        var showList = [];
        for (let i = 0; i < d.length; i++) {
          showList.push(d[i]._source)
        }
        for (var i = 0; i < brandType.length; i++) {
          brandType[i].select = '-n';
          brandType[i].show = false;
        }
        for (var i = 0; i < brandType.length; i++) {
          if (brandType[i].title == title) {
            list = showList;
            brandType[i].select = '-a';
            brandType[i].show = true;
            that.setData({
              list: list,
              brandType: brandType,
              loading: false,
              shunxu: i
            })
          }
        }
      } else {
        list = [];
        for (var i = 0; i < brandType.length; i++) {
          brandType[i].select = '-n';
          brandType[i].show = false;
        }
        for (var i = 0; i < brandType.length; i++) {
          if (brandType[i].title == title) {
            brandType[i].select = '-a';
            brandType[i].show = true;
            that.setData({
              list: list,
              brandType: brandType,
              loading: false,
              shunxu: i
            })
          }
        }

      }
    })
  },
  fetchProducts: (that) => {
    API.categoryThreeList(currentID, fromP).then((resp) => {
      let d = resp.hits;
      if(resp.total % 20 === 0){
        isLastPage = true;
        fromP = (resp.total / 20) - 1;
      }else{
        if (d.length === 20) {
          isLastPage = false;
          fromP = fromP + 20;
        } else {
          isLastPage = true;
          fromP = 0;
        }
      }
   
      if (d.length > 0) {
        var showList = [];
        for (let i = 0; i < d.length; i++) {
          showList.push(d[i]._source)
        }
        for (var i = 0; i < brandType.length; i++) {
          if (brandType[i].title == title) {
            list = list.concat(showList);
            that.setData({
              list: list,
              loading: false
            })
          }
        }
      } else {
        that.setData({
          list: [],
          loading: false
        })
      }
    })
  },
  fetchData: function (options) {
    var that = this;
    let level3_id = options.id;
    currentID = level3_id;
    API.toCategorythree(level3_id).then((resp) => {
    
      for (var i = 0; i < resp.length; i++) {
        let item = {
          id: resp[i].id,
          title: resp[i].name,
          select: '-n',
          show: false
        }
        brandType.push(item)
      }
      API.categoryThreeList(level3_id, fromP).then((resp) => {
        let d = resp.hits;
       
        if(resp.total / 20 === 1){
          isLastPage = true;
        }else{
          if (d.length === 20) {
            isLastPage = false;
            fromP = 20;
          } else {
            isLastPage = true;
          }
        }
        if (d.length > 0) {
          var showList = [];
          for (let i = 0; i < d.length; i++) {
            showList.push(d[i]._source)
          }
          for (var i = 0; i < brandType.length; i++) {
            if (brandType[i].title == title) {
              list = showList;
              brandType[i].select = '-a';
              brandType[i].show = true;
              that.setData({
                list: list,
                brandType: brandType,
                loading: false,
                shunxu: i
              })
            }
          }
        } else {
          list = [];
          for (var i = 0; i < brandType.length; i++) {
            if (brandType[i].title == title) {
              brandType[i].select = '-a';
              brandType[i].show = true;
              that.setData({
                list: list,
                brandType: brandType,
                loading: false,
                shunxu: i
              })
            }
          }

        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    index = options.index;
    title = options.title || options.level3name;
    brandType.splice(0, brandType.length);
    fromP = 0;
    var that = this;

    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphonex: true,
            title: options.level3name
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphonex: false,
            title: options.level3name
          })
        }
      },
    });
    // 设置品牌分类页
    // 根据level1 ID获取信息,options.id
    /*
    wx.setNavigationBarTitle({
      title: options.level3name,
    })
    */
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
    list.splice(0, list.length)
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
 
      if (!isLastPage) {
        console.log("ll")
        this.fetchProducts(this);
      }
  
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})