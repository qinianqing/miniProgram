// page/cart/index.js
const API = require('../../api/api.js');

let that_;

// 获取满额返现数组
let weekCb;

let price = 0;

var pageStatus = true;// true是展示，false编辑状态
// 默认全选
var allSelect = true;

// 全选图标
var selectIcon = 'https://cdn.jiyong365.com/%E6%A4%AD%E5%9C%86%E5%BD%A2%20%E9%80%89%E4%B8%AD.png';
// 全不选图标
var notSelectIcon = 'https://cdn.jiyong365.com/%E6%A4%AD%E5%9C%86%E5%BD%A2%20copy%202.png';
// 购物车提示
var notice = '';
// 购物车中商品列表
var list = [];
// 购物车中的失效商品
var invalidList = [];

// 储存购物车中商品的选中icon
var seletList = [];
var deleteSelectList = [];

// 滑动相关参数变量
var touchStartX = -1;
var touchItemID = '';
var RPX = 0;
var itemSpreadLock = false;

// 选择SKU popup的参数
var skuCurrent = {};

var skuItems = [];

var updateCartId = '';
var updateCartSkuId = '';

let loading = true;
//选择商品的数量
var selectnum = 1;
var sesku = '';

var skuvalues = '';
var skuvalues1 = '';
var skuvalues2 = '';
var skuvalues3 = '';
var skuvalues4 = '';
var skunames = "请选择规格";
var skunams = '';
var typelist = [];
var rename;
var styleslist = [];
let n = 0;
//诸葛io上传
var zgChannel;
var zgScene;
//是不是直接原厂发货
var isDirect;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginModal: false,
    gif: '../../image/loading.gif',
    list: {},
    loading: loading,
    noticess: false
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
  default_go: function () {
    let pages = getCurrentPages();
    // 判断上一个页面是不是首页
    if (pages[pages.length - 2].onlyIndexHave) {
      wx.navigateBack({

      })
    } else {
      wx.redirectTo({
        url: '../index/index',
      })
    }

  },
  carback: function () {
    wx.navigateBack({

    })
  },
  setTotalCbNotice: () => {
    for (let i = 0; i < weekCb.length; i++) {
      if (i > 0) {
        if (price >= weekCb[i - 1].money && price < weekCb[i].money) {
          let y = '一周买满' + weekCb[i].money + '可返现' + weekCb[i].cb + '元'
          that_.setData({
            notice: '一周买满' + weekCb[i].money + '可返现' + weekCb[i].cb + '元'
          })
          break;
        }
      } else {
        if (price < weekCb[0].money) {
          let y = '一周买满' + weekCb[i].money + '可返现' + weekCb[i].cb + '元'
          that_.setData({
            notice: '一周买满' + weekCb[0].money + '可返现' + weekCb[i].cb + '元'
          })
          break;
        }
      }
    }
  },
  fetchNotice: (that) => {
    API.getCartNotice().then((resp) => {
      weekCb = resp.consume_notice;
      that.setTotalCbNotice();
      that.setData({
        fsc_notice: resp.fsc_notice,
        // notice: resp.consume_notice
      })
    }, (err) => {
      console.log(err)
    })
  },
  // 获取数据
  fetchData: function (that, d, re) {
    // d当长度变短时传入id
    // re需要刷新的时候传入
    // 两者只能存在一个
    API.getCart().then((resp) => {
     
      wx.hideLoading();
      if (resp.count) {
        // 购物车中有数据
        // TODO 渲染数据
        let oldList = list;
        list = resp.valid;
        invalidList = resp.invalid;
        selectnum = invalidList.length;
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (d) {
          // 删除，列表长度有变化，传进来的是删除的id
          let newSelectList = [];
          for (let i = 0; i < oldList.length; i++) {
            if (oldList[i].id != d) {
              newSelectList.push(oldList[i].selectImg)
            }
          }
          seletList = newSelectList;
          selectnum = seletList.length;
          for (let i = 0; i < list.length; i++) {
            list[i].selectImg = seletList[i];
          }
        } else if (re) {
          seletList = [];
          selectnum = resp.valid.length;
          for (let i = 0; i < resp.valid.length; i++) {
            seletList.push(selectIcon);
            list[i].selectImg = selectIcon;
            seletList[i] = selectIcon;
          }
        } else {
          selectnum = list.length;
          for (let i = 0; i < list.length; i++) {
            list[i].selectImg = oldList[i].selectImg;
          }
        }
        loading = false;
        that.fetchTotal(that);
        wx.setStorage({
          key: 'cartMsg',
          data: list,
        })
        that.setData({
          list: list,
          invalidList: invalidList,
          empty: false,
          loading: loading,
          selectnum: selectnum
        })
      } else {
        // 购物车中没数据
        loading = false;
        that.setData({
          empty: true,
          loading: loading
        })
      }
    }, (err) => {
      console.log(err)
    })
  },
  fetchTotal: (that) => {
    // 获取商品总价和提示语
    // TODO 价格本地算，不再调用order算价接口
    let reqA = [];
    for (let i = 0; i < list.length; i++) {
      if (seletList[i] === selectIcon) {
        reqA.push(list[i].object_id)
      }
    }

    that_.setData({
      selectnum: reqA.length
    })

    if (reqA.length) {
      // 有sku
      let priceTotal = 0;
      for (let i = 0; i < reqA.length; i++) {
        for (let k = 0; k < list.length; k++) {
          if (reqA[i] === list[k].object_id) {
            priceTotal = priceTotal + list[k].price * list[k].num;
            break;
          }
        }
      }
      priceTotal = priceTotal.toFixed(2);
      that.setData({
        total: priceTotal
      })
    } else {
      // 无sku
      that.setData({
        total: 0,
        cashback: 0
      })
    }
  },
  // 结算入口
  // todo，直接进入订单详情页
  formSubmit: function (e) {
    if (e.detail.formId) {
      let tDate = Date.now() + 7 * 1000 * 60 * 60 * 24;
      let p = {
        form_id: e.detail.formId,
        quota: 1,
        expiredAt: tDate
      }
      API.addFormId(p).then((resp) => {
      }, (err) => {
        console.error(err.message);
      })
    };
    // 构造选中数据
    let selectListA = [];
    for (let i = 0; i < list.length; i++) {
      if (seletList[i] == selectIcon) {
        selectListA.push(list[i]);
      }
    }
    if (selectListA.length) {
      wx.setStorage({
        key: 'selectCartSkus',
        data: selectListA,
        complete: () => {
          // 跳转订单确认页
          wx.navigateTo({
            url: '../order/confirm?order_id=' + '',
          })
        }
      })
    } else {
      wx.showModal({
        title: 'Oops!',
        content: '购物车是空的！',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#FD8075'
      })
    }
    wx.getStorage({
      key: 'channel',
      success: function (res) {
        zgChannel = res.data
      },
    })
    wx.getStorage({
      key: 'shareScene',
      success: function (res) {
        zgScene: res.data
      },
    })

  },
  clearInvalid: function () {
    let that = this;
    API.clearInvalidCart().then((resp) => {
      // 清理成功
      that.fetchData(that)
    }, (err) => {
      console.error(err)
    })
  },
  // sku选择框行为函数
  nothing: function () {
    // 拦截sku select box的操作
  },
  goshop: function () {
    let pages = getCurrentPages();
    if (pages.length === 2) {
      wx.navigateBack({

      })
    } else {
      wx.redirectTo({
        url: '../index/index',
      })
    }
  },
  // TODO 更改SKU start
  // 点击确定，选择sku更新
  selectSection: function (e) {

  },
  selectskuone: function (e) {
    var that = this;
    skuvalues = e.target.dataset.skuvalue;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    console.log(skunames);
    that.changeSkuTap(e)
    that.setData({
      skuvalues: skuvalues,
      skunames: rename
    })
  },
  selectskuone1: function (e) {
    var that = this;
    skuvalues1 = e.target.dataset.skuvalueones;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    console.log(skuvalues1);
    that.changeSkuTap(e);
    that.setData({
      skuvalues1: skuvalues1,
      skunames: rename
    })
  },
  selectskuone2: function (e) {
    var that = this;
    skuvalues2 = e.target.dataset.skuvaluetwo;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    console.log(skuvalues2);
    that.changeSkuTap(e);
    that.setData({
      skuvalues2: skuvalues2,
      skunames: rename
    })
  },
  selectskuone3: function (e) {
    var that = this;
    skuvalues3 = e.target.dataset.skuvaluethree;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    console.log(skuvalues3);
    that.changeSkuTap(e);
    that.setData({
      skuvalues3: skuvalues3,
      skunames: rename
    })
  },
  selectskuone4: function (e) {
    var that = this;
    skuvalues4 = e.target.dataset.skuvaluefour;
    skunames = `${skuvalues} ${skuvalues1} ${skuvalues2} ${skuvalues3} ${skuvalues4}`;
    skunams = skunames.replace(/(\s*$)/g, "");
    rename = `"${skunams}"`;
    console.log(skuvalues4);
    that.changeSkuTap(e);
    that.setData({
      skuvalues4: skuvalues4,
      skunames: rename
    })
  },
  skuSelectGo: function () {
    let that = this;
    let options = {
      object_id: updateCartId,
      sku_id: updateCartSkuId,
    }
    if (updateCartSkuId == '' || updateCartSkuId == sesku) {
      skuCurrent.changing = false;
      that.setData({
        skuSwift: skuCurrent
      })
    } else {
      API.updateCart(options).then((resp) => {
        // 更新
        skuCurrent.changing = false;
        that.setData({
          skuSwift: skuCurrent
        })
        that.fetchData(that);
      }, (err) => {
        console.error(err);
        wx.showModal({
          title: 'Oops!',
          content: err.error_msg,
          showCancel: false,
          confirmColor: '#FF9080',
          confirmText: '知道了'
        })
      })
    }

  },
  changeSkuTap: function (e) {
    var that = this;
    for (let i = 0; i < skuItems.length; i++) {
      if (skuItems[i].type_id == skunams) {
        if (skuItems[i].stock == 0 || skuItems[i].show == false) {
          that.setData({
            noticess: true
          })
        } else {
          that.setData({
            noticess: false,

          })
          updateCartSkuId = skuItems[i].sku_id;
          let item = {
            cover: skuItems[i].image,
            price: skuItems[i].price,
            crossedPrice: skuItems[i].discount_price,
            skuName: `"${skuItems[i].type_id}"`,
            options: skuItems,
            changing: true,
            styles: styleslist
          }
          skuCurrent = item;
          var that = this;
          that.setData({
            skuSwift: skuCurrent
          })
        }
      } else {
        console.log("请选择完整的规格")

      }
    }
    // updateCartSkuId = e.currentTarget.id;
    // skuItems[indexD].select = true;
    // let item = {
    //   cover: skuItems[indexD].image,
    //   price: skuItems[indexD].price,
    //   crossedPrice: skuItems[indexD].discount_price,
    //   skuName: `"${skuItems[indexD].type_id}"`,
    //   options: skuItems,
    //   changing: true
    // }


  },
  showSkuSelectBox: function (e) {
    // 需要根据id获取值
    updateCartId = e.currentTarget.id;
    let spu_id = '';
    let sku_name = '';
    let sku_id = '';
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == e.currentTarget.id) {
        spu_id = list[i].spu_id;
        sku_id = list[i].sku_id;
        sku_name = list[i].skuName;
        index = i;
        sesku = list[i].sku_id;
      }
    }
    let options = {
      spu_id: spu_id
    }

    API.getSkusBySpu(options).then((resp) => {
      skuItems = resp.skus;
      // 构造skuCurrent
      let indexD;
      for (let i = 0; i < resp.skus.length; i++) {
        if (resp.skus[i].sku_id == sku_id) {
          indexD = i;
        }
      }
      resp.skus[indexD].select = true;
      var changeType = (resp.skus[indexD].type_id).trim().split(/\s+/);
      let item = {
        cover: resp.skus[indexD].image,
        price: resp.skus[indexD].price,
        crossedPrice: resp.skus[indexD].discount_price,
        skuName: `"${resp.skus[indexD].type_id}"`,
        options: resp.skus,
        changing: true
      }
      skuCurrent = item;
      styleslist = resp.styles;
      skuCurrent.styles = resp.styles;
      skuvalues = changeType[0];
      if (changeType[0] == undefined) {
        skuvalues = ''
      } else {
        skuvalues = changeType[0]
      }
      if (changeType[1] == undefined) {
        skuvalues1 = ''
      } else {
        skuvalues1 = changeType[1]
      }
      if (changeType[2] == undefined) {
        skuvalues2 = ''
      } else {
        skuvalues2 = changeType[2]
      }
      if (changeType[3] == undefined) {
        skuvalues3 = ''
      } else {
        skuvalues3 = changeType[3]
      }
      if (changeType[4] == undefined) {
        skuvalues4 = ''
      } else {
        skuvalues4 = changeType[4]
      }

      var that = this;
      that.setData({
        skuSwift: skuCurrent,
        skuvalues: changeType[0],
        skuvalues1: changeType[1],
        skuvalues2: changeType[2],
        skuvalues3: changeType[3],
        skuvalues4: changeType[4],
        skunames: `"${resp.skus[indexD].type_id}"`
      })
    }, (err) => {
      console.error(err)
    })
  },
  //结束
  dismissSkuSelectBox: function () {
    skuCurrent.changing = false;
    var that = this;
    that.setData({
      skuSwift: skuCurrent
    })
  },
  // sku item行为
  skuTap: function (e) {
    if (itemSpreadLock) {
      // 滑动上锁，点击取消滑动
      for (let i = 0; i < list.length; i++) {
        list[i].left = 0;
      }
      var that = this;
      wx.setStorage({
        key: 'cartMsg',
        data: list,
      })
      that.setData({
        fixed: '',
        list: list
      })
      itemSpreadLock = false;
    } else {
      // 正常点击事件
      let sku_id = '';
      let spu_name = '';
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == e.currentTarget.id) {
          sku_id = list[i].sku_id;
          spu_name = list[i].spu;
        }
      }
      wx.navigateTo({
        url: '../product/goodsdetail/goodsdetail?sku_id=' + sku_id + '&spu_name=' + spu_name,
      })
    }
  },
  mvCollectionTap: function (e) {
    let options = {
      sku_id: '',
      spu_id: ''
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].object_id == e.currentTarget.id) {
        options.sku_id = list[i].sku_id;
        options.spu_id = list[i].spu_id;
      }
    }
    // 从购物车转移到收藏夹
    let that = this;
    API.collectAdd(options).then((resp) => {
      if (resp) {
        // 从购物车中删除
        let reqP = {
          object_id: e.currentTarget.id
        }
        API.deleteCart(reqP).then((resp) => {
          // 刷新购物车
          that.fetchData(that, e.currentTarget.id);
        }, (err) => {

        })
      }
    }, (err) => {
      console.error(err.error_msg)
    })
    console.log(e.currentTarget.id + '被移至收藏');
    // 收藏，成功后删除
  },
  deleteBatch: function (e) {
    let reqA = [];
    for (let i = 0; i < list.length; i++) {
      if (deleteSelectList[i] == selectIcon) {
        reqA.push(list[i].id);
      }
    }
    let t = 0;
    for (let i = 0; i < reqA.length; i++) {
      let options = {
        object_id: reqA[i]
      }
      API.deleteCart(options).then((resp) => {
        // 刷新页面
        t++;
        if (t == reqA.length) {
          let that = this;
          that.fetchData(that, false, true);
        }
      }, (err) => {
        console.error(err);
      })
    }

  },
  delete: function (e) {
    console.log(e.currentTarget.id + '被删除');
    let options = {
      object_id: e.currentTarget.id
    }
    API.deleteCart(options).then((resp) => {
      // 刷新页面
      let that = this;
      that.fetchData(that, e.currentTarget.id);
    }, (err) => {
      console.error(err);
    })
  },
  // 编辑状态行为
  minus: function (e) {
    let that = this;
    let num = 0
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == e.currentTarget.id) {
        num = list[i].num;
        index = i;
      }
    }
    if (num > 1) {
      let options = {
        object_id: e.currentTarget.id,
        num: num - 1
      }
      API.updateCart(options).then((resp) => {
        list[index].num = num - 1;
        wx.setStorage({
          key: 'cartMsg',
          data: list,
        })
        that.setData({
          list: list
        });
        that.fetchTotal(that);
      }, (err) => {
        console.error(err);
        list[index].num = num;
        wx.showModal({
          title: 'Oops!',
          content: err.error_msg,
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#FD8075'
        })
      })
    }
  },
  plus: function (e) {
    wx.getStorage({
      key: '',
      success: function (res) { },
    })
    let that = this;
    let num = 0;
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == e.currentTarget.id) {
        num = list[i].num;
        index = i;
      }
    }
    let options = {
      object_id: e.currentTarget.id,
      num: num + 1
    }
    API.updateCart(options).then((resp) => {
      list[index].num = num + 1;
      wx.setStorage({
        key: 'cartMsg',
        data: list,
      })
      that.setData({
        list: list
      });
      that.fetchTotal(that);
    }, (err) => {
      console.error(err);
      list[index].num = num;
      wx.showModal({
        title: 'Oops!',
        content: err.error_msg,
        showCancel: false,
        confirmColor: '#FF9080',
        confirmText: '知道了'
      })
    })
  },
  // 选择框行为
  selectTap: function (e) {
    // 获取选中的id，根据状态不同对item条目进行操作
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == e.currentTarget.id) {
        if (list[i].selectImg == selectIcon) {
          list[i].selectImg = notSelectIcon;
          if (pageStatus) {
            seletList[i] = notSelectIcon;
          } else {
            deleteSelectList[i] = notSelectIcon;
          }
        } else {
          list[i].selectImg = selectIcon;
          if (pageStatus) {
            seletList[i] = selectIcon;
          } else {
            deleteSelectList[i] = selectIcon;
          }
        }
      }
    }
    if (pageStatus) {
      let equal = 0;
      for (let i = 0; i < seletList.length; i++) {
        if (seletList[i] === selectIcon) {
          equal++
        }
      }
      let that = this;
      that.fetchTotal(that);
      if (equal == list.length) {
        allSelect = true;
        wx.setStorage({
          key: 'cartMsg',
          data: list,
        })
        that.setData({
          list: list,
          allSelectIcon: selectIcon
        })
      } else {
        allSelect = false;
        wx.setStorage({
          key: 'cartMsg',
          data: list,
        })
        that.setData({
          list: list,
          allSelectIcon: notSelectIcon
        })
      }
    } else {
      let that = this;
      let n = 0;
      for (let i = 0; i < deleteSelectList.length; i++) {
        if (deleteSelectList[i] === selectIcon) {
          n++
        }
      }
      allSelect = false;
      wx.setStorage({
        key: 'cartMsg',
        data: list,
      })
      that.setData({
        list: list,
        allSelectIcon: notSelectIcon,
        selectnum: n
      })
    }
  },
  allSelect: function () {
    allSelect = !allSelect;
    var that = this;

    if (allSelect) {
      // 全选中
      for (let i = 0; i < list.length; i++) {
        seletList[i] = selectIcon;
        if (pageStatus) {
          seletList[i] = selectIcon;
        } else {
          deleteSelectList[i] = selectIcon;
        }
        list[i].selectImg = selectIcon;
      }
      if (pageStatus) {
        that.fetchTotal(that);
      }
      wx.setStorage({
        key: 'cartMsg',
        data: list,
      })
      that.setData({
        list: list,
        allSelectIcon: selectIcon
      })
    } else {
      // 全不选中
      for (let i = 0; i < list.length; i++) {
        if (pageStatus) {
          seletList[i] = notSelectIcon;
        } else {
          deleteSelectList[i] = notSelectIcon;
        }
        list[i].selectImg = notSelectIcon;
      }
      if (pageStatus) {
        that.fetchTotal(that);
      }
      wx.setStorage({
        key: 'cartMsg',
        data: list,
      })
      that.setData({
        list: list,
        allSelectIcon: notSelectIcon
      })
    }
  },
  // 编辑态、展示态切换
  edit: function () {
    var that = this;
    // 编辑状态true为正常状态
    pageStatus = !pageStatus;
    if (pageStatus) {
      for (let i = 0; i < list.length; i++) {
        list[i].selectImg = selectIcon;
        seletList[i] = selectIcon;
      }
      // that.fetchData(that);
      // 设置为正常状态
      // 隐藏选择框
      // 将所有选择归0
      wx.setStorage({
        key: 'cartMsg',
        data: list,
      })
      that.setData({
        //btnBoxHidden: true,
        //list:list,
        toolClass: 'normal',
        toolString: '管理',
        allSelectIcon: selectIcon,
        normal: pageStatus,
        list:list,
        selectnum:list.length
      })
    } else {
      // 设置编辑状态
      // 将所有item都设置为未选中状态
      for (let i = 0; i < list.length; i++) {
        list[i].selectImg = notSelectIcon;
        deleteSelectList[i] = notSelectIcon;
      }
      // 展现商品选择框
      // 展现底部操作框
      // 都通过btnBoxHidden来设置

      // 所有条目复选框默认为未选中
      wx.setStorage({
        key: 'cartMsg',
        data: list,
      })
      that.setData({
        list: list,
        btnBoxHidden: false,
        toolClass: 'edit',
        toolString: '完成',
        allSelectIcon: notSelectIcon,
        normal: pageStatus,
        skuSwift: skuCurrent,
        selectnum: 0
      })
    }
  },
  // // item滑动事件
  // itemTouchStart: function (e) {
  //   if (!itemSpreadLock) {
  //     touchItemID = e.currentTarget.id;
  //     touchStartX = e.touches[0].pageX;
  //   }
  // },
  // itemTouchMove: function (e) {
  //   if (!itemSpreadLock) {
  //     var currentX = e.touches[0].pageX;
  //     // 只有向左移，同时超过60rpx的时候，才会触发滑动操作
  //     const bufferX = 20;
  //     // 正数向左，负数向右
  //     var moveDistance = touchStartX - currentX;
  //     if (moveDistance > bufferX) {
  //       // 计算RPX的值
  //       var moveRPX = moveDistance / RPX;
  //       // 遍历list
  //       for (let i = 0; i < list.length; i++) {
  //         if (touchItemID == list[i].id) {
  //           if (moveRPX > 300) {
  //             list[i].left = -300;
  //             itemSpreadLock = true;
  //           } else {
  //             list[i].left = -moveRPX;
  //           }
  //         }
  //       }
  //       var that = this;
  //       that.setData({
  //         list: list,
  //         fixed: '-f'
  //       })
  //     }
  //   }
  // },
  // itemTouchEnd: function (e) {
  //   if (!itemSpreadLock) {
  //     var that = this;
  //     // 结束，如果移动的距离少于
  //     var currentX = e.changedTouches[0].pageX;
  //     // 只有向左移，同时超过60rpx的时候，才会触发滑动操作
  //     const lineX = 40;
  //     // 正数向左，负数向右
  //     var moveDistance = touchStartX - currentX;
  //     if (moveDistance > lineX) {
  //       // 超过150停在最左侧
  //       for (let i = 0; i < list.length; i++) {
  //         if (touchItemID == list[i].id) {
  //           list[i].left = -300;
  //         }
  //       }
  //       that.setData({
  //         list: list
  //       })
  //       itemSpreadLock = true;
  //     } else {
  //       // 小于或等于150弹回原位置
  //       for (let i = 0; i < list.length; i++) {
  //         if (touchItemID == list[i].id) {
  //           list[i].left = 0;
  //         }
  //       }
  //       that.setData({
  //         list: list
  //       })
  //     }
  //     touchStartX = -1;
  //     touchItemID = '';
  //     RPX = 0;
  //     setTimeout(function () {
  //       that.setData({
  //         fixed: ''
  //       })
  //     }, 1500);
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that_ = this;
    n = 0;
    // 设置配置
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
    API.setPage(that);
    that.fetchNotice(that);
    // 加载正常状态列表
    that.setData({
      //list: list,
      toolClass: 'normal',
      normal: pageStatus,
      toolString: '管理',
      allSelectIcon: selectIcon,
      notice: '',
      //list:list,
      fixed: '',
      //invalidList:invalidList
    })
    // 计算rpx比值
    wx.getSystemInfo({
      success: function (res) {
        RPX = 750 / res.windowWidth;
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
    pageStatus = true;
    loading = true;
    var that = this;
    if (n === 0) {
      that.setData({
        loading: loading
      })
    } else {
      // wx.showLoading({
      //   title: '更新数据',
      // })
    }
    n++;
    that.fetchData(that, false, true);
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
    /*
    initN = 0;
    list = [];
    invalidList = [];
    seletList = [];
    deleteSelectList = [];
    */
    loading = true;
    let that = this;
    that.setData({
      loading: loading
    })
    // that.fetchData(that, false, true);
    setTimeout(()=>{
      loading = false;
      wx.stopPullDownRefresh();
      that.setData({
        loading: loading
      })
    },1200)
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