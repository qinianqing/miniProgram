// page/welfare/welfare.js
const API = require('../../api/api.js');
var list = [];

let shareFromPin = false;

let user_name = '';

let order_id;
let shareUserId;

let shareInviteMember = 0;
let share_invite = false;
let user_Id;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../image/loading.gif',
    loading: false,
    iphonex: '',
    title: '福利',
    getCoupon: false,
    //是否有拼手气券
    status: false,
    //去分享弹层
    selectShare: false,
    //活动一
    actFirst: {
      cover: 'https://cdn.jiyong365.com/%E6%B4%BB%E5%8A%A8%E4%B8%80.png',
      name: '邀请新人',
      money: 5,
      title: '活动规则',
      invite: '立即邀请',
      button: 'https://cdn.jiyong365.com/Bitmap2.png'
    },
    //活动二
    actThree: {
      cover: 'https://cdn.jiyong365.com/%E4%BC%9A%E5%91%98%E8%BF%94.png',
      name: '邀请会员',
      money: '10%',
      title: '活动规则',
      invite: '立即邀请',
      button: 'https://cdn.jiyong365.com/Bitmap2.png',
      icon: 'https://cdn.jiyong365.com/%E4%BC%9A%E5%91%98icon.png'
    },
    //活动四
    actFour: {
      cover: 'https://cdn.jiyong365.com/%E7%94%BB%E6%9D%BF%201.png',
      name: '成为会员',
      money: '5%',
      title: '活动规则',
      invite: '立即开通',
      button: 'https://cdn.jiyong365.com/Rectfffffangle%2010.png'
    },
    //活动三
    actSecond: {
      name: '分享手气红包',
      money: 5,
      title: '活动规则',
      rule: '规则:10名好友领券，订单不取消',
      cover: 'https://cdn.jiyong365.com/%E7%A6%8F%E5%88%A9%E5%BA%95%E5%9B%BEdfghj.png'
    },
    //活动二拼手气券
    secondList: [],
    //没拼手气券
    secondLists: [{
      title: '还没有拼手气券',
      time: '赶紧去下单吧～',
    }],
    //会员10%返利规则弹窗
    vipStatus:false,
    //返利规则
    vipRules:['邀请新用户、老用户成为会员，即可获得该用户所购会员价格的10%的奖励金额','奖励金额可在下单时使用，奖励金可在个人中心-我的返现中查看'],
    //分享手气红包弹窗
    LuckyStatus:false,
    //分享手气规则
    LuckyRules:['分享拼手气红包，好友可领取红包券金额1~6元','须将10张红包券分享给10名好友才可得5元奖励金额','奖励金额存于个人钱包-补贴流水中','若分享用户取消订单，则由该订单分享红包所获得的补贴金额也将退回']
  },
  //返回
  back: function () {
    wx.navigateBack({

    })
  },
  //隐藏弹窗
  hiddenS: function () {
    var that = this;
    that.setData({
      getCoupon: false,
      vipStatus:false,
      LuckyStatus: false
    })
  },
  vipRuleF:function(){
     var that = this;
     that.setData({
       vipStatus: true
     })
  },
  goP:function(){
  var that = this;
  that.setData({
    LuckyStatus: true
  })
  },
  //立即开通会员
  goVip: function () {
   wx.navigateTo({
     url: '../user/vip/vip',
   })
  },
  // 去邀请会员
  goInviteMember: function (){
    let that = this;
    shareInviteMember = 1;
    that.setData({
      selectShare:1,
      vipStatus: false
    })
  },
  //会员规则
  vipRule:function(){
   wx.navigateTo({
     url: '../user/family-member/right-info/right-info',
   })
  },
  //邀请新人规则
  inviteNew:function (){
    wx.navigateTo({
      url: '../user/mine/invite/invite',
    })
  },
  inviteNewRule:function(){
   wx.navigateTo({
     url: '../user/mine/invite/activerule/activerule',
   })
  },
  //去返现
  goCash: function () {
    wx.navigateTo({
      url: '../wallet/wallet',
    })
  },
  gomine: function () {
    wx.navigateTo({
      url: '../promote/coupon/coupon',
    })
  },
  //优惠券
  goCoupon: function () {
    wx.navigateTo({
      url: '../promote/coupon/coupon',
    })
  },
  //去购物
  goShop: function () {
    const pages = getCurrentPages();
    if (pages.length === 2) {
      wx.navigateTo({
        url: '../category/index',
      })
    }
    if (pages.length === 1) {
      wx.navigateTo({
        url: '../category/index',
      })
    }
  },
  //去邀请好友
  goShare: function () {
   var that = this;
   wx.getStorage({
     key: 'user_Id',
     success: function(res) {
       user_Id = res.data;
     },
   })
   share_invite = true;
   that.setData({
     selectShare: true
   })
  },
  //去分享弹层
  selsectG: function (e) {
    var that = this;
    let p = e.currentTarget.dataset;
    order_id = p.o;
    shareUserId = p.u;
    shareFromPin = true;
    that.setData({
      selectShare: true
    })
  },
  //隐藏弹层
  selectC: function () {
    var that = this;
    that.setData({
      selectShare: false
    })
  },
  //取消分享
  cancelS: function () {
    var that = this;
    that.setData({
      selectShare: false
    })
  },
  //取数据
  fetchData: function () {
    var that = this;
    API.getActList().then((resp) => {
      if (resp == 'no') {
        that.setData({
          status: false,
          loading: false
        })
      } else {
        list = resp;
        for (let i = 0; i < resp.length; i++) {
          API.getActNum(resp[i].order_id).then((res) => {
            if (res > 9) {
              that.setData({
                getCoupon: true,
              })
            }
            list[i].updatedAt = (10 - res);
            for (var j = 0; j < list.length; j++) {
              list[j].createdAt = new Date(list[j].createdAt).toLocaleString().split(' ')[0];

            }
            that.setData({
              secondList: list,
              status: true,
              loading: false
            })
          })
        }
      }

    })
  },
  //得到拼手气券数量
  getActNum: function (order_id) {
    API.getActNum(order_id).then((res) => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    shareInviteMember = 0;
    that.setData({
      loading: true
    })
    that.fetchData();
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
    wx.getStorage({
      key: 'user_info',
      success: function (res) {
        user_name = res.data.nickName
      },
    });
    wx.getStorage({
      key: 'user_Id',
      success: function (res) {
        shareUserId = res.data
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
    if (shareFromPin&&!shareInviteMember) {
      shareFromPin = false;
      return {
        title: user_name + '送你拼手气红包',
        path: 'page/user/mine/invite/send?invite_order=' + shareUserId + '&order_id=' + order_id,
        imageUrl: 'https://cdn.jiyong365.com/1~6%E5%85%83%E7%BA%A2%E5%8C%85.png',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        },
      }
    } else if (!shareFromPin && shareInviteMember){
      shareInviteMember = 0;
      return {
        title: user_name + '邀你加入锦时家庭会员',
        path: 'page/user/vip/vip?invite_user=' + shareUserId,
        imageUrl: 'https://cdn.jiyong365.com/Group%2012%20Copy%206%283%29eeee.png',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        },
      }
    }else if(share_invite){
      return {
        title: user_name + '送你5元现金券',
        path: '/page/index/index?user_Id=' + user_Id,
        imageUrl: 'https://cdn.jiyong365.com/20%281%29dfgfgfgfgf.png',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else {
      return {
        title: '锦时福利频道',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        },
      }
    }
  }
})