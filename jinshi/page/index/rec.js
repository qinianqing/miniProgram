// page/index/rec.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents:[
      // 抽奖
      {cover:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531109939602&di=e67e391d7173cc55bbc0e32527c6b44e&imgtype=0&src=http%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_gif%2FYBUEwItJQ8PQ5FFl9Gwg5cUPMMzpcuDb7qfYDBWgrwagvEBg40RoYwBLnYc3ytliboArXluuKjDT7DTbC4fG6ag%2F640%3Fwx_fmt%3Dgif',
      name:'和吴宣仪一起吃午饭吧',
      describe:'吴宣仪吃饭权益大抽奖',
      tag:['吴宣仪','挑战101'],
      t:3},
      // 拍卖
      {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531111738010&di=8e8618bf3d024d2b8bacd4953f861c3a&imgtype=0&src=http%3A%2F%2Fimgs.aixifan.com%2Fcontent%2F2016_08_11%2F1470907995.JPG',
        name: '和野食小哥一起去野食',
        describe: '具体位置在北京市朝阳区',
        tag: ['野食小哥'],
        t: 2
      },
      // 图文
      {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531111862026&di=1b5cb89598677c0429712e5aae378fa3&imgtype=0&src=http%3A%2F%2Fimages.ifanr.cn%2Fwp-content%2Fuploads%2F2015%2F08%2Firon-man.jpg',
        name: '史上最牛自制钢铁侠',
        describe: '全手工，无图纸',
        tag: ['钢铁侠'],
        t: 0
      },
      // 视频
      {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531111930760&di=d4175cd5145e32c327ad743e556b053c&imgtype=0&src=http%3A%2F%2Fp0.ifengimg.com%2Fpmop%2F2018%2F0619%2FB59539F4F56EDE7B9243CCCDA9938E91CA1A892E_size38_w1080_h720.jpeg',
        name: '冯提莫北京唱歌实拍',
        describe: '提莫真的只有1米5？？？',
        tag: ['冯提莫'],
        t: 1
      },
      // 众筹
      {
        cover: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531112086916&di=9e67b4a1e55a4f022ae4a61960574157&imgtype=0&src=http%3A%2F%2Fpic.guaixun.com%2Fuploads%2Fallimg%2F201806011655c%2F4baaed0e93783fd54a88a4921c005434.jpeg',
        name: '为我们的徐坤包一列地铁',
        describe: '地铁广告一星期，北京核心位置',
        tag: ['蔡徐坤'],
        t: 4
      },
      // 商品
      {
        cover: 'http://content.pic.waptime.net/20171202/9b1dfe8aa6ca5000bc1b3f3aba1b1c0d.jpg',
        name: '范冰冰强力推荐',
        describe: '永远18岁',
        tag: ['范冰冰','SK-II'],
        t: 5
      },
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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