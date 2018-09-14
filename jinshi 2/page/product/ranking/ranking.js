// page/product/ranking/ranking.js
const API = require('../../../api/api.js');
var iphonex;
var selectIndex = 0;
var tabTitleList = [];
var dotList = [];
let theFrom = 0;
var list;
var that_;
var status = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: false,
    interval: 5000,
    duration: 200,
    circular: true,
    indicatorDots: true,
    //导航栏列表
    tabBarList: [],
    //导航状态
    select: true,
    //加载动画
    loading: true,
    gif: '../../../image/loading.gif',

  },
  //返回
  back: function () {
    wx.navigateBack({

    })
  },
  //点击Bar跳转
  clickBar: function (e) {
    var that = this;
    for (var i = 0; i < tabTitleList.length; i++) {
      tabTitleList[i].select = '-n';
      tabTitleList[i].show = false;
    }
    tabTitleList[e.currentTarget.dataset.index].select = '-a';
    tabTitleList[e.currentTarget.dataset.index].show = true;
    selectIndex = e.currentTarget.dataset.index;
    that.updateData();

    that.setData({
      tabTitleList: tabTitleList
    })
  },
  //导航列表
  fetchBarList: function () {
    var that = this;
    for (var i = 0; i < that.data.tabBarList.length; i++) {
      let item = {
        title: that.data.tabBarList[i].title,
        select: '-n',
        show: false
      }
      tabTitleList.push(item);
      tabTitleList[0].select = '-a';
      tabTitleList[0].show = true;
    }
    that.setData({
      tabTitleList: tabTitleList
    })
  },
  //轮播自动转换
  swiperChange: function (e) {
    // var that = this;
    // let index = parseInt(e.currentTarget.dataset.index);
    // for (var m = 0; m < dotList[index].length; m++) {
    //   dotList[index][m] = 'un'
    // }
    // dotList[index][e.detail.current] = 'on';
    // that.setData({
    //   dotslist: dotList
    // })
  },
  //轮播图dot
  // fetchDots: function (d) {
  //   var that = this;
  //   let dotslist = [];
  //   for (var j = 0; j < d.length; j++) {
  //     if (j === 0) {
  //       dotslist.push('on')
  //     } else {
  //       dotslist.push('un')
  //     }
  //   }
  //   dotList.push(dotslist);
  //   that.setData({
  //     dotslist: dotList
  //   })
  // },
  //刷新收据
  updateData: function () {
    var that = this;
    var tabBarLists = that.data.tabBarList[selectIndex];
    for (let i = 0; i < tabBarLists.list.length; i++) {
      // that.fetchDots(tabBarLists.list[i].rank_image)
    }
    that.setData({
      tabBarLists: tabBarLists
    })
  },
  //加入购物车
  addCart:function(e){
    let parm = {
      spu_id:e.currentTarget.dataset.spu,
      sku_id: e.currentTarget.dataset.sku,
      num:1,
      price: e.currentTarget.dataset.price
    }
    API.addCart(parm).then((resp)=>{
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
      wx.getStorage({
        key: 'cartMsg',
        success: function(res) {
          console.log(res.data)
          let newMsg = res.data;
          // console.log("ttt",newMsg)
          if(newMsg.length > 0){
              for(var i = 0;i < newMsg.length;i++){
                if(newMsg[i].spu_id === parm.spu_id){
                  status = 1;
                  newMsg[i].num = newMsg[i].num + 1;
                  wx.setStorage({
                    key: 'cartMsg',
                    data: newMsg,
                  })
                  return;
                }else{
                 status = 0
                }
              }
              console.log("trre",status)
              if(status === 0){
                newMsg.push(parm);
              }
          }else{
            newMsg.push(parm);   
          }
          wx.setStorage({
            key: 'cartMsg',
            data: newMsg,
          })
        
        
        },
      })
    
    },(err)=>{
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    })
  },
//跳商品详情
  goGoods:function(e){
    if (e.currentTarget.dataset.sku){
      wx.navigateTo({
        url: '../goodsdetail/goodsdetail?sku_id=' + e.currentTarget.dataset.sku,
      })
    }else{
      wx.navigateTo({
        url: '../goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.spu,
      })
    }
  },
  //数据
  fetchData: function () {
    var that = this;
    API.getRankingLists().then((resp) => {
      
      var Idlist = [];
       Idlist = resp;
      theFrom = list.length;
      if (Idlist) {
        let n = 0;
        for (let i = 0; i < Idlist.length; i++) {
          API.getGoodGroup(Idlist[i], theFrom).then((resp) => {
            n++;
            list.push(resp);
            if(n == Idlist.length){
              let items = [];
              for(let k = 0;k < Idlist.length;k++){
                for(let m = 0;m < list.length;m++){
                  if(list[m].id === Idlist[k]){
                    items.push(list[m]);
                    break;
                  }
                }
              }
              list = items;
            }
           
            if (!resp.nextFrom) {
              theFrom = -1;
            }
            if (list.length === Idlist.length) {
              that.setData({
                tabBarList: list,
                loading: false
              })
              that.fetchBarList();
              that.updateData();
            }
          })
        }

      }
    })
   


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that_ = this;
    list = [];
    tabTitleList = [];
    theFrom = 0;
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
            iphonex: false
          })
        }
      },
    });

    that.fetchData();
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
    // tabTitleList = [];
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
    theFrom = 0;
    that_.fetchData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (theFrom > 0) {
      theFrom = list.length;
      that_.fetchData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})