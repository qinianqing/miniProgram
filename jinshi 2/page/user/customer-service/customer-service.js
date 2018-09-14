// page/user/customer-service/customer-service.js
const API = require('../../../api/api.js');

var sections = [{
  select:true,
  content:'周送服务'
},{
  content:'配送服务'
},{
  content:'售后'
},{
  content:'订阅服务'
},{
  content:'如何修改个人信息'
},{
  content:'如何使用优惠券'
}]
var title = '周送服务';
var list = ['退货问题\n自收到商品之日起30天，可以无条件退款','退货流程\n内裤和食品不支持退换货']

let id = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true
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
  mainGo: function (){
    // 传参数
    wx.navigateTo({
      url: '../../contact-page/contact-page',
    })
  },

  fetchTopics: function (that){
    API.getQATopics().then((resp)=>{
      let tempSec = resp.topics;
      tempSec[0].select = true;
      sections = tempSec;
      list = resp.firstPage;
      if(id){
        that.fetchDetail(that, id);
      }else{
        that.setData({
          sections: sections,
          title: tempSec[0].topic,
          list: list,
          loading: false
        })
      }
    },(err)=>{
      console.error(err.error_message);
    })
  },

  fetchDetail: function (that,topic_id){
    let indexT = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].topic_id === topic_id) {
        indexT = i;
      }
      sections[i].select = false;
    }
    sections[indexT].select = true;
    API.getQADetail(topic_id).then((resp) => {
      list = resp;
      that.setData({
        sections: sections,
        title: sections[indexT].topic,
        list: list,
        loading: false
      })
    }, (err) => {
      console.error(err.error_message);
    })
  },
  topicTap: function (e){
    let that = this;
    that.fetchDetail(that,e.currentTarget.id)
  },
  extGo: function (){
    wx.makePhoneCall({
      phoneNumber: '010-57102310',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.fetchTopics(that);
    if(options.id){
      id = options.id;
    }

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
      key: 'user_info',
      success: function(res) {
        let user = {
          name:res.data.nickName,
          avatar:res.data.avatarUrl
        }
        that.setData({
          user:user,
          sections: sections,
          title: title,
          list: list
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
  
  }
})