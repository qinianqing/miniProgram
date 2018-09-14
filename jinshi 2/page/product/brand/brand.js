// page/product/goodsdetails/brand/brand.js
const API = require('../../../api/api.js');

let brand_id = '';
let brand_name = '';
let tagstyle = '';

let list = [];

let fromP = 0;

let isLastPage = true;

Page({
     
  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading:true,
    xiala: 'https://cdn.jiyong365.com/%E5%B1%95%E5%BC%80.png',
    shala: 'https://cdn.jiyong365.com/%E6%94%B6%E8%B5%B72.png',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    la:false,
    tagStyle:''
  },
  fetchData:(that)=>{
    let options = {
      brand_id:brand_id,
      from:fromP
    }
    API.getProductListByBrand(options).then((resp)=>{
      let showList = [];
      if (resp.product.hits.length === 20) {
        isLastPage = false;
        fromP = fromP + 20;
      } else {
        isLastPage = true;
        fromP = 0;
      }
      for(var i = 0;i < resp.product.hits.length;i++){
        showList.push(resp.product.hits[i]._source);
      }
      list = list.concat(showList);
      if(resp.brand){
        brand_name = resp.brand.name;
        that.setData({
          brand: resp.brand,
          product: list,
          loading: false,
        })
      }else{
        that.setData({
          product: list,
          loading: false,
        })
      }
    },(err)=>{
      console.error(err.error_msg);
    })
  },
  xiala:function(e){
    this.setData({
      la:false
    })
  },
  spuTap:function(e){
     wx.navigateTo({
       url: '../goodsdetail/goodsdetail?goods_id='+ e.currentTarget.id,
     })
  },
  back:function(){
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
  shangla:function(e){
    this.setData({
      la: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    brand_id = options.brand_id;
    let that = this;
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
    list = [];
    let that = this;
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
    if (!isLastPage) {
      this.fetchData(this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: brand_name,
      path: '/page/product/brand/brand?brand_id=' + brand_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})