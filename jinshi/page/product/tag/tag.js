// page/product/tag/tag.js
const API = require('../../../api/api.js');

let tag = '';

let fromParams = 0;

let total = 0;

let list = [];

let n = 0;// 请求次数
let lock = true; // 上锁

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    gif:'../../../image/loading.gif'
  },
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
  goProductDetail: function (e) {
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?goods_id=' + e.currentTarget.id,
    })
   
  },
  fetchData: function (that){
    if(tag){
      API.getProductListByTag(tag, fromParams).then((resp) => {
        total = resp.total;
        let results = that.formatData(resp);
        list = list.concat(results);
        if(list.length < total){
          n++;
          fromParams = 20*n - 1;
          lock = false;
        }else{
          lock = true;
        }
        that.setData({
          list:list,
          loading:false
        })
      })
    }
  },
  formatData: function (d) {
    let results = [];
    if (d.total) {
      for (let i = 0; i < d.hits.length; i++) {
        let item = d.hits[i]._source;
        results.push(item);
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
      return results;
    } else {
      return [];
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    fromParams = 0;
    tag = options.tag;
    list = [];
    that.fetchData(that);
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            tag: tag,
            iphonex: true
          })
        } else {
          // 不是iPhone X
          that.setData({
            tag: tag,
            iphonex: false
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
    fromParams = 0;
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
    // 上拉获取新的数据
    if(!lock){
      this.fetchData(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '直达精致，让家更好！',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})