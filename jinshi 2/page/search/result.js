// page/search/result.js
const API = require('../../api/api.js');
let resultsAll = [];
let from = '';
let query = '';
let totals = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  back: function () {
    wx.navigateBack({

    })
  },
  goProductDetail: function (e){
    wx.navigateTo({
      url: '../product/goodsdetail/goodsdetail?goods_id='+e.currentTarget.id,
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    from = options.from;
    query = options.query;
    
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

    wx.getStorage({
      key: 'searchResults',
      success: function(res) {
        resultsAll = res.data.list;
        totals = res.data.total;
        that.setData({
          total:res.data.total,
          list:res.data.list
        })
      },
    })
  },
  formatData: function (d) {
    let results = [];
    if (d.total) {
      for (let i = 0; i < d.hits.length; i++) {
        let item = d.hits[i]._source;
        results.push(item);
      }
      for (var i = 0; i < results.length; i++) {
        if (results[i].goods_cashback){
          if (results[i].goods_cashback < 100) {
            results[i].tagstyle = true
          } else {
            results[i].tagstyle = false
          }
        }else{
          
        }
     
      }
      return results;
    } else {
      return [];
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
    if(totals !== resultsAll.length){
      let that = this;
      API.search(query, from).then((resp) => {
        let results = that.formatData(resp);
        resultsAll = resultsAll.concat(results);
        if (from < resp.total + 1) {
          from = from + results.length;
        } else {
          from = 0
        }
        let item = {
          total: resp.total,
          list: resultsAll
        };
        that.setData({
          list: resultsAll
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})