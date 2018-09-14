// page/order/reverse/list.js
const API = require('../../../api/api.js')
let s ={ status:''};
let last_key = '';
let list = [];
var that_;
let ls = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
  },
  back:()=>{
    wx.navigateBack({
      
    })
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
  goReLogin: function (e) {
    let userInfo = e.detail;
    API.rebind(userInfo);
  },
  itemGo:function(e){
      console.log(e)
      wx.navigateTo({
        url: './detail?reverse_Id=' + e.currentTarget.dataset.reverse,
      })
  },
  tabTap: function (options) {
    console.log("PPP",options)
    var that = this;
    switch (options.currentTarget.id) {
      case 'ing':
        s.status = options.currentTarget.id;
        var taba = {
          select: ['-active', '']
        } 
        that.fetchData(s, last_key)
        that.setData({
          tab: taba,
          //list: notPayList
        })
        break;
      case 'ed':
        // 运送中
        s.status = options.currentTarget.id;
      
        var tabb = {
          select: ['', '-active']
        }
        that.fetchData(s,last_key)
        that.setData({
          tab: tabb,
          //list: deliveryList
        })
      
        break;
    }
  },
  fetchData:function(options){
    var that = this;
    API.getReverseList(options.status,last_key).then((resp)=>{ 
      console.log("3333",resp)
      that.setData({
        loading: false
      })
      list = resp.Items;
      for (var i = 0;i < list.length; i++){
        switch (list[i].type) {
          case 'REFUND':
            list[i].type = '退款'
            break;
          case 'RETURN':
            list[i].type = '退货'
            break;
          case 'RECHANGE':
            typeName = '换货';
            list[i].type = '换货'
            break;
        }
        if(list[i].status == '*CANCEL'){
          var a = list[i].item.goodsdetail.default_image;
          list[i].item.goodsdetail.type_id = '全单';
          list[i].item.goodsdetail.goods_name = '订单退款已取消';
          list[i].item.goodsdetail.default_image = [];
          list[i].item.goodsdetail.default_image[0] = a;
        }else{
          var a = list[i].item.goodsdetail.default_image;
          list[i].item.goodsdetail.default_image = [];
          list[i].item.goodsdetail.default_image[0] = a;
        }
      }
      console.log("list",list)
   
      that.setData({
        list:list
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that_ = this;
    API.setPage(that);
    that.setData({
      loading:true
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
    });
    let tab;
    switch (options.status) {
      case 'ing':
        tab = {
          select: ['-active', '']
        }
        //s = 'a';
        break;
      case 'ed':
        tab = {
          select: ['', '-active']
        }
        //s = 'b';
        break;
    }
    that.setData({
      tab: tab
    })
    that.fetchData(options);
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
  // onShareAppMessage: function () {
  
  // }
})