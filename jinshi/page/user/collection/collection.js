// page/user/collection/collection.js
const API = require('../../../api/api.js');

var pageStatus = 1;// 1是展示状态，-1是编辑状态

// 默认全不选
var allSelect = false;

// 全选图标
var selectIcon = 'https://cdn.jiyong365.com/%E6%A4%AD%E5%9C%86%E5%BD%A2%20%E9%80%89%E4%B8%AD.png';
// 全不选图标
var notSelectIcon = 'https://cdn.jiyong365.com/%E6%A4%AD%E5%9C%86%E5%BD%A2%20copy%202.png';

let last_key = '';
var seletList = [];
var list = [];
var delectArray = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../../image/loading.gif',
    loading: true
  },
  back:()=>{
    wx.navigateBack({
      
    })
  },
  // 主要下游入口
  goTap:function (){

  },
  productTap:function (e){
    console.log("......",e)
    // 点击的产品id
    if (pageStatus > 0) {
      // 跳转商品详情页
      let id = e.currentTarget.id;
      wx.navigateTo({
        url: '../../product/goodsdetail/goodsdetail?goods_id=' + id ,
      })
    } else {
      // 选中一个收藏项
      // let theIcon = '';
      let tapId = e.currentTarget.id;
      for(let i=0;i<list.length;i++){
        if(list[i].id == tapId){
          if (list[i].select == notSelectIcon){
            list[i].select = selectIcon;
            delectArray[i] = selectIcon;
          }else{
            list[i].select = notSelectIcon;
            delectArray[i] = notSelectIcon;
          }
        }
      }
      // 如果是全选状态，只要有一个没有选中，则取消全选状态
      var allSelectChangeByProductTap = 1;
      if(allSelect){
        for(let i=0;i<list.length;i++){
          if(list[i].select == notSelectIcon){
            allSelectChangeByProductTap = 0;
          }
        }
      }
      var that = this;
      if(allSelectChangeByProductTap){
        console.log('<<<<<')
        allSelect = true;
        for(var i = 0;i < list.length;i++){
           delectArray[i] = list[i].select
        }
        that.setData({
          list: list,
          allSelectIcon: selectIcon
        })
      }else{
        console.log('>>>>>')
        for (var i = 0; i < list.length; i++) {
          delectArray[i] = list[i].select
        }
        let t = 0;
        
        allSelect = false;
        that.setData({
          list: list,
          allSelectIcon:notSelectIcon
        })
      }
    }
  },
  edit: function (){
    var that = this;
    // 编辑状态大于0为正常状态
    pageStatus = -pageStatus;
    if (pageStatus>0){
      // 设置为正常状态
      // 隐藏选择框
      // 将所有选择归0
      that.setData({
        btnBoxHidden: true,
        toolClass:'normal',
        toolString:'管理',
        allSelectIcon: notSelectIcon
      })
    }else{
      // 设置编辑状态

      // 将所有item都设置为未选中状态
      for(let i=0;i<list.length;i++){
        list[i].select = notSelectIcon;
      }

      // 展现商品选择框
      // 展现底部操作框
      // 都通过btnBoxHidden来设置

      // 所有条目复选框默认为未选中
      that.setData({
        list:list,
        btnBoxHidden:false,
        toolClass: 'edit',
        toolString: '完成',
        allSelectIcon:notSelectIcon
      })


    }
  },
  allSelectTap :function (){
    allSelect = !allSelect;
    var that = this;

    if(allSelect){
      // 全选中
      // 将所有item都设置为未选中状态
      for (let i = 0; i < list.length; i++) {
        list[i].select = selectIcon;
        delectArray[i] = selectIcon;
      }
      that.setData({
        list:list,
        allSelectIcon:selectIcon
      })
    }else{
      // 全不选中
      // 将所有item都设置为未选中状态
      for (let i = 0; i < list.length; i++) {
        list[i].select = notSelectIcon;
        delectArray[i] = notSelectIcon;
      }
       console.log("wwww",list)
      that.setData({
        list:list,
        allSelectIcon: notSelectIcon
      })
    }
  },
  back:function(){
  wx.navigateBack({
    
  })  
  },
  fetchData: function(that,d,re){
    API.getCollectList(last_key).then((resp)=>{
      if(resp.collectArray){
        let l = that.formatData(resp.collectArray);
        list = list.concat(l);
        if (d) {
          // 删除，列表长度有变化，传进来的是删除的id
          list = resp.collectArray;
          var oldList = list
          let newSelectList = [];
          for (let i = 0; i < oldList.length; i++) {
            if (oldList[i].id != d) {
              newSelectList.push(oldList[i].select)
            }
          }
          seletList = newSelectList;
          for (let i = 0; i < list.length; i++) {
            list[i].select = seletList[i];
          }
        }else if(re){
          list = l;
          for(let i=0;i<list.length;i++){
            list[i].select = notSelectIcon;
          }
        }else{
          seletList = [];
          for (let i = 0; i < list.length; i++) {
            seletList.push(selectIcon);
            list[i].select = selectIcon;
            seletList[i] = selectIcon;
          }
        }
      }else{
        list = [];
      }
      that.setData({
        list:list,
        loading:false
      })
    },(err)=>{
      console.error(err.error_msg);
    })
  },
  formatData: function(d){
    
    let results = [];
    for (let i = 0; i < d.length; i++) {
      let item = {};
      if(d[i].notice){
        item.invalid = d[i].notice;
      }else{
        item.invalid = 0;
      }
      item.cover = d[i].default_image;
      item.title = d[i].goods_name;
      item.price = d[i].goods_price;
      // item.crossedPrice = d[i].discount_price;
      item.id = d[i].goods_id;
      item.spu = d[i].goods__name;
      item.collect = d[i].collect_id;
      results.push(item);
    }
    return results;
  },
  deleteBatch: function (e) {
    let reqA = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].select == selectIcon) {
        reqA.push(list[i].collect);
      }
    }
    let t = 0;
    for (let i = 0; i < reqA.length; i++) {
      let options = {
        collect_id: reqA[i]
      }
      API.collectDelete(options).then((resp) => {
        // 刷新页面
        t++;
        if (t == reqA.length) {
          let that = this;
          that.fetchData(that, false,true);
        }
      }, (err) => {
        console.error(err);
      })
    }
  },
  delete: function (e) {
    let options = {
      collect_id: e.currentTarget.dataset.collect
    }
    API.collectDelete(options).then((resp) => {
      // 刷新页面
      let that = this;
      // 重置deleteArray
      that.fetchData(that, e.currentTarget.dataset.collect);

    }, (err) => {
      console.error(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载正常状态列表
    var that = this;
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
    that.setData({
      toolClass:'normal',
      toolString:'管理',
      btnBoxHidden:true
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
    let that = this;
    if(last_key){
      that.fetchData(that);
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})