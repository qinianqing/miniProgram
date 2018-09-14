// page/user/evaluate/evaluate.js
const API = require('../../../api/api.js');

var notList = [];
var edlist = [];
var status = 1;
var last_keyA = '';
var last_keyB = '';

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
  formatData: function(d){
    let results = [];
    for(let i=0;i<d.length;i++){
      let item = {
        cover:d[i].cover,
        spu:d[i].spu_id,
        spu_name:d[i].spu_name,
        sku:d[i].sku_name,
        order_id:d[i].order_id,
        price:d[i].price,
        sku_id:d[i].sku_id,
        object_id:d[i].object_id
      }
      results.push(item);
    }
    return results;
  },
  fetchData: function (that){
    that.setData({
      loading: true
    })
    let evaS = '0';
    let last_key = '';
    if(status == -1){
      evaS = '1';
      last_key = last_keyB;
    }else{
      last_key = last_keyA;
    }
    
    API.getEvaProductList(evaS,last_key).then((resp)=>{
      //console.log("//////",resp)
      if(status == -1){
        // 
        let l = that.formatData(resp.Items);
        edlist = edlist.concat(l);
        that.setData({
          list:edlist,
          loading:false
        })
      }else{
        let l = that.formatData(resp.Items);
        notList = notList.concat(l);
        //console.log("22222",notList)
        that.setData({
          list:notList,
          loading:false
        })
      }
      wx.stopPullDownRefresh();
    },(err)=>{
      console.error(err.message);
      wx.showModal({
        title: 'Oops!',
        content: err.message,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    })
  },
  selectGo: function (){
    var that = this;
    status = 1;
    if(notList.length == 0){
      that.fetchData(that);
      that.setData({
        status: status
      })
    }else{
      that.setData({
        status: status,
        list:notList
      })
    }
  },
  selectEd: function (){
    var that = this;
    status = -1;
    if (edlist.length == 0) {
      that.fetchData(that);
      that.setData({
        status: status
      })
    }else{
      // 更新数据
      that.setData({
        status: status,
        list:edlist
      })
    }
  },
  deleteEva: function (){
    wx.showModal({
      title: '确定要删除吗？',
      content: '删除后不可恢复！',
      confirmColor:'#FF9080',
      success:function(res){
        if(res.confirm){
          // 调用删除
        }
      }
    })
  },
  goDetail: function (e){
    let id = e.currentTarget.id;
    let spu_name = e.currentTarget.dataset.spu;
    wx.navigateTo({
      url: '../../product/goodsdetail/goodsdetail?sku_id='+id,
    })
  },
  goEva: function (e){
    let spu = e.currentTarget.dataset.spu;
    let oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: '../../product/comment/create/create?sku_id=' + e.currentTarget.id+'&spu_id='+spu+'&object_id='+oid,
    })
  },
  readEva: function (e){
    let spu = e.currentTarget.dataset.spu;
    let oid = e.currentTarget.dataset.oid;
    wx.navigateTo({
      url: './detail/detail?sku_id=' + e.currentTarget.id + '&spu_id=' + spu + '&object_id=' + oid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let navTitle = '';
    if (options.status === 'already'){
      status = -1;
      navTitle = '我的评价';
    }else if(options.status === 'goingto'){
      status = 1;
      navTitle = '待评价';
    }
    notList = [];
    edlist = [];
    last_keyA = '';
    last_keyB = '';

    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphonex: true,
            navTitle: navTitle
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphonex: false,
            navTitle: navTitle
          })
        }
      },
    });
    that.setData({
      status:status
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
    let that = this;
    notList = [];
    edlist = [];
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
    notList = [];
    edlist = [];
    last_keyA = '';
    last_keyB = '';
    
    var that = this;
    that.fetchData(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (status == -1) {
      if(last_keyB){
        that.fetchData(that);
      }
    } else {
      if(last_keyA){
        that.fetchData(that);
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})