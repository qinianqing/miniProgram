// page/search/search.js
const API = require('../../api/api.js');

let query = '';

let historyArray = [];
let resultsAll = [];
let from = '';
let findfrom = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    gif: '../../image/loading.gif',
    loading: true
  },
  back: function () {
    wx.navigateBack({

    })
  },
  searchFromWord: function (e) {
    from = 0;
    query = e.currentTarget.id;
    this.search();
  },
  searchFromHistory: function (e) {
    from = 0;
    query = e.currentTarget.id;
    this.search();
  },
  searchFromInput: function (e) {
    from = 0;
    query = e.detail.value;
    this.search();
  },
  //wxSearchInput: function (e){
  //query = e.detail.value
  //},
  formatData: function (d) {
    let results = [];
    if (d.total) {
      for (let i = 0; i < d.hits.length; i++) {
        let item = d.hits[i]._source;
        results.push(item);
      }
      return results;
    } else {
      return [];
    }
  },
  findfrom: function () {
    findfrom = from;
    let that = this;
    that.setData({
      loading: false
    })
    return findfrom
  },

  search: function () {
    let that = this;
    that.setData({
      loading: true
    })
    API.search(query, from).then((resp) => {
      let results = that.formatData(resp);
      from = results.length;
      resultsAll = results;
      let item = {
        total: resp.total,
        list: resultsAll
      }
      // 发起请求，并把结果存储在本地
      // 在搜索结果页读取
      wx.setStorage({
        key: 'searchResults',
        data: item,
        success: () => {
          wx.navigateTo({
            url: './result?query=' + query + '&from=' + from,
          })
          // 将query加入搜索历史
          that.addHistory();
        },
        complete: () => {

        }
      })
    }, (err) => {
      console.error(err.error_msg);
    })
  },
  addHistory: function () {
    let that = this;
    let tempHistory = [];
    tempHistory.push(query);
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        let tempList = res.data;
        for (let i = 0; i < tempList.length; i++) {
          if (tempList[i] === query) {
            break;
          } else {
            tempHistory.push(tempList[i]);
          }
        };
        historyArray = tempHistory;
        wx.setStorage({
          key: 'searchHistory',
          data: historyArray,
        });
        that.setData({
          history: historyArray
        });
      },
      fail: function (res) {
        wx.setStorage({
          key: 'searchHistory',
          data: tempHistory,
        });
        that.setData({
          history: tempHistory
        });
      }
    })
  },
  deleteHistory: function (e) {
    let that = this;
    let dItem = e.currentTarget.id;
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        let tempList = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i] !== dItem) {
            tempList.push(res.data[i]);
          }
        };
        historyArray = tempList;
        wx.setStorage({
          key: 'searchHistory',
          data: historyArray,
        });
        that.setData({
          history: historyArray
        })
      },
    })
  },
  las: function (e) {
    this.setData({
      value: "",
    })
  },
  fanhui: function (e) {
    // 返回至入口来源页
    wx.navigateBack({

    })
  },
  fetchData: function (that) {
    API.getHotSearch().then((resp) => {
      that.setData({
        array: resp,
        loading: false
      })
    }, (err) => {
      console.error(err.error_msg);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    from = 0;
    that.fetchData(that);
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
    // 展现历史记录
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        historyArray = res.data;
        that.setData({
          history: historyArray
        })
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
    var that = this;
    that.findfrom()
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
    let that = this;
    API.search(query, from).then((resp) => {
      let results = that.formatData(resp);
      resultsAll = resultsAll.concat(results);
      from = resultsAll.length;
      let item = {
        total: resp.total,
        list: resultsAll
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
