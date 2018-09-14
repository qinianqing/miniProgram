// page/product/goodsdetails/comment/comment.js
const API = require('../../../api/api.js');
let lastKey = '';
var newList = [];
var selected = true;
var selected1 = false;
var is_comment = false;
var lengths = 5;
var fen = 99 + "%";
let loading;

let list = [];
let picsList = [];

let options_;

const FormatDate = require('../../../util/timeformat.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    list:'',
    starImage:[
      'https://cdn.jiyong365.com/XINGXING%202.png',
      'https://cdn.jiyong365.com/XINGXING%202.png',
      'https://cdn.jiyong365.com/XINGXING%202.png',
      'https://cdn.jiyong365.com/XINGXING%202.png',
      'https://cdn.jiyong365.com/XINGXING%202.png'
      ],
      loading:true,
      selected:true,
      selected1:false
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
  viewImages: (e)=>{
    let current = e.currentTarget.id;
    let picArray = e.currentTarget.dataset.pics;
    wx.previewImage({
      current:current,
      urls: picArray,
    })
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  format:function(res){
    picsList.splice(0,picsList.length)
    lengths = res[res.length - 1].stars_num;
    fen = res[res.length - 1].fen;
    for(var i = 0;i < res.length;i++){
      if(res[i].comment_image != undefined){
        picsList.push(res[i])
      }
    }
  },
   fetchData:function(options,that){
     // 唯一获取数据的接口
       //loading = true;
     // fetchData不应该和当前页面无关
      API.getCommentsAllDetails(options.goods_id,lastKey).then((resp)=>{
         loading = false;
          if(resp.last_key){
            lastKey = resp.last_key;// IMPORTENT
          }
         if(resp.commentArray == 0){
           lengths = 5;
            fen = 99 + "%";
            list = [];
            that.setData({
              list: list,
              loading: loading,
              lengths: lengths,
              fen: fen
            })
         }else{
          //  两件事

          //  1、concat list

          //  2、format picsList数组
           lengths = resp.commentArray[resp.commentArray.length - 1].stars_num;
           fen = resp.commentArray[resp.commentArray.length - 1].fen;
           for (let i = 0; i < resp.commentArray.length; i++) {
             resp.commentArray[i].createdAt = FormatDate(resp.commentArray[i].updatedAt);
           }
           list = resp.commentArray;
           that.format(resp.commentArray)
           wx.hideLoading();
           if (this.data.selected == true && this.data.selected1 == false) {
             that.setData({
               list: list,
               loading: loading,
               lengths: lengths,
               fen: fen
             })

           } else {
             that.setData({
               list: picsList,
               loading: loading,
               lengths: lengths,
               fen: fen
             })
           }
         }
       
      })
   },
   allData: function () {
     var that = this;
      that.setData({
        list:list,
        selected: true,
        selected1: false
      })
   },
  havepicture:function(){
    // 只是一件事，把list 用picsList
    var that = this;
    that.setData({
      list:picsList,
      selected:false,
      selected1:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options_ = options;
    this.fetchData(options_, this);
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
    if(lastKey){
      wx.showLoading({
        title: '获取中',
      })
      this.fetchData(options_, this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})