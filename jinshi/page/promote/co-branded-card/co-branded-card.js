// page/promote/co-branded-card/co-branded-card.js
const API = require('../../../api/api.js');

let that_ = '';

let id = '';
let status = '';

let list = [];
let theFrom = 0;

let f;
let ff = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    gif: '../../../image/loading.gif',
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
  back: function () {
    wx.navigateTo({
      url: '../../index/index',
    })
  },
  groupTap: function (e) {
    wx.navigateTo({
      url: '../../product/ranking/ranking?group_id=' + e.currentTarget.dataset.id
    })
  },
  spuIdTap: function (e) {
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?goods_id=' + e.currentTarget.dataset.id,
    })
  },
  fetchRank: () => {
    theFrom = list.length;
    // 注意商品组固定
    API.getGoodGroup('1527597644894', theFrom).then((resp) => {
      wx.stopPullDownRefresh();
      list = list.concat(resp.list);
      if (!resp.nextFrom) {
        theFrom = -1;
      }
      that_.setData({
        list: list,
        group_id: '1527597644894'
      })
    });
  },
  fetchData: () => {
    API.getCoBrandedCard(id).then((resp) => {
      status = resp.status;
      that_.setData({
        card: resp.card,
        btn: resp.status,
        loading: false
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
    API.getFamilylist().then((resp) => {
      f = resp.Items;
      wx.setStorage({
        key: 'families',
        data: resp.Items,
      })
    })
  },
  actApi: (id, family_id) => {
    wx.showLoading({
      title: '激活中',
    })
    API.activeCoBrandedCard(id, family_id).then((resp) => {
      wx.hideLoading();
      wx.showToast({
        title: '激活成功',
      })
      that_.fetchData();
    })
  },
  setInitFamily: (family_id)=>{
    console.log(family_id);
    that_.actApi(id,family_id);
  },
  selectFamily:(family_id)=>{
    that_.actApi(id, family_id);
  },
  active: () => {
    if (status === '立即领取') {
      ff = [];
      if(f.length === 0){
        wx.navigateTo({
          url: '../../family/create/create?source=cbc',
        })
      } else if (f.length === 3){
        // 3个家庭
        for(let i=0;i<3;i++){
          ff.push(f[i].name+'('+f[i].province+f[i].county+')')
        }
        wx.showActionSheet({
          itemList: ff,
          success: function (res) {
            that_.selectFamily(f[res.tapIndex].family_id);
          },
        })
      }else {
        // 1或2个家庭
        for (let i = 0; i < f.length+1; i++) {
          if(i<f.length){
            ff.push(f[i].name + '(' + f[i].province + f[i].county + ')')
          }else{
            ff.push('创建并绑定新家庭');
          }
        }
        wx.showActionSheet({
          itemList: ff,
          success: function (res) {
            if(res.tapIndex === ff.length-1){
              wx.navigateTo({
                url: '../../family/create/create?source=cbc',
              })
            }else{
              that_.selectFamily(f[res.tapIndex].family_id);
            }
          },
        })
      }
    } else {
      wx.showModal({
        title: 'Oops!',
        content: status,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    }
  },
  getToken: () => {
    return API.getToken();
  },
  checkToken: () => {
    if (that_.getToken()) {
      that_.fetchData();
    } else {
      setTimeout(() => {
        that_.checkToken();
      }, 1000)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      id = decodeURIComponent(options.scene);
    }
    
    let that = this;
    API.setPage(that);
    that_ = this;
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
    that.checkToken();
    that.fetchRank();
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
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1200)
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