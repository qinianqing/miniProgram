// page/product/space/space.js
const API = require('../../../api/api.js');

let that_;
let list = [];
let theFrom = 0;
let fromP = 0;

let dotList = [];

let isLastPage = true;

let infos = [{
  name: '卧室',
  focus: '别样的精致生活情调',
  pic: 'https://cdn.jiyong365.com/%E5%8D%A7%E5%AE%A4bb.png'
}, {
  name: '餐厅',
  focus: '每一口饭都是品质生活的映射',
  pic: 'https://cdn.jiyong365.com/%E9%A4%90%E5%8E%85rr.png'
}, {
  name: '厨房',
  focus: '锅碗瓢盆等你带回家',
  pic: 'https://cdn.jiyong365.com/%E5%8E%A8%E6%88%BFrr.png'
}, {
  name: '卫生间',
  focus: '低调品质 高调洁净',
  pic: 'https://cdn.jiyong365.com/%E5%8D%AB%E7%94%9F%E9%97%B4rr.png'
}, {
  name: '客厅',
  focus: '最优质的客厅时光搭配最好的你',
  pic: 'https://cdn.jiyong365.com/%E5%AE%A2%E5%8E%85bb.png'
},];

let members = [
  {
    name: '卧室',
    select: true,
  },
  {
    name: '餐厅',
    select: false,
  },
  {
    name: '厨房',
    select: false,
  },
  {
    name: '卫生间',
    select: false,
  },
  {
    name: '餐厅',
    select: false,
  },
];
let status = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: infos[0],
    members: members,
    loading: true,
    gif: '../../../image/loading.gif',
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 200,
  },

  tabClick: (e) => {
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    index = Number(index);
    for (let i = 0; i < members.length; i++) {
      members[i].select = false;
    }
    members[index].select = true;
    that_.setData({
      current: infos[index],
      members: members,
    })
    fromP = 0;
    list = [];
    that_.fetchData(name);
  },
  //加入购物车
  addCart: function (e) {
    let parm = {
      spu_id: e.currentTarget.dataset.spu,
      sku_id: e.currentTarget.dataset.sku,
      num: 1,
      price: e.currentTarget.dataset.price
    }
    API.addCart(parm).then((resp) => {
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      })
      wx.getStorage({
        key: 'cartMsg',
        success: function (res) {
          console.log(res.data)
          let newMsg = res.data;
          if (newMsg.length > 0) {
            for (var i = 0; i < newMsg.length; i++) {
              if (newMsg[i].spu_id === parm.spu_id) {
                status = 1;
                newMsg[i].num = newMsg[i].num + 1;
                wx.setStorage({
                  key: 'cartMsg',
                  data: newMsg,
                })
                return;
              } else {
                status = 0
              }
            }
            if (status === 0) {
              newMsg.push(parm);
            }
          } else {
            newMsg.push(parm);
          }
          wx.setStorage({
            key: 'cartMsg',
            data: newMsg,
          })
        },
      })
    }, (err) => {
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
  goGoods: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.spu,
    })
  },
  fetchData: (name) => {
    theFrom = list.length;
    API.getSpaceList(name, theFrom).then((resp) => {
      wx.stopPullDownRefresh();
      let showList = [];
      if (resp.hits.length === 20) {
        isLastPage = false;
        fromP = fromP + 20;
      } else {
        isLastPage = true;
        fromP = 0;
      }
      for (var i = 0; i < resp.hits.length; i++) {
        showList.push(resp.hits[i]._source);
      }
      list = list.concat(showList);
      for (let i = 0; i < list.length; i++) {
        that_.fetchDots(list[i].carousel_image)
      }
      that_.setData({
        loading: false,
        list: list,
        dotslist: dotList
      })
    }, (err) => {
      console.error(err.error_msg)
    })
  },
  // 来自大卡片展现的方法
  swiperChange: function (e) {
    var that = this;
    let index = parseInt(e.currentTarget.dataset.index);
    for (var m = 0; m < dotList[index].length; m++) {
      dotList[index][m] = 'un'
    }
    dotList[index][e.detail.current] = 'on';
    that.setData({
      dotslist: dotList
    })
  },
  fetchDots: function (d) {
    var that = this;
    let dotslist = [];
    for (var j = 0; j < d.length; j++) {
      if (j === 0) {
        dotslist.push('on')
      } else {
        dotslist.push('un')
      }
    }
    dotList.push(dotslist);
  },
  tagTap: function (e) {
    wx.navigateTo({
      url: '../tag/tag?tag=' + e.currentTarget.dataset.tag,
    })
  },
  godetailss: function (e) {
    let spu_id = e.currentTarget.id;
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?goods_id=' + spu_id,
    })
  },
  back: () => {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that_ = this;
    list = [];
    theFrom = 0;
    fromP = 0;
    that_.fetchData(members[0].name);

    let that = this;
    wx.getStorage({
      key: 'iPhone',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphone: true
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphone: false
          })
        }
      }
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

  }
})