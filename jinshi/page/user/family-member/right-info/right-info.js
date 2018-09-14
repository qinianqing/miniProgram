// page/user/family-member/right-info/right-info.js
var imgA = 'https://cdn.jiyong365.com/%E5%88%86%E7%BB%84%281%29ss.png';
var imgAH = 'https://cdn.jiyong365.com/%E4%BC%98%E6%83%A0%20copyss.png';

var imgB = 'https://cdn.jiyong365.com/%E4%BC%98%E6%83%A03ss.png';
var imgBH = 'https://cdn.jiyong365.com/%E5%85%8D%E9%82%AEss.png';

var imgC = 'https://cdn.jiyong365.com/%E9%B2%9C%E8%B6%A3%E7%B2%BE%E9%80%89ss.png';
var imgCH = 'https://cdn.jiyong365.com/%E7%B2%BE%E9%80%89ss.png';

var imgD = 'https://cdn.jiyong365.com/%E4%BC%98%E6%83%A0ss.png';
var imgDH = 'https://cdn.jiyong365.com/%E5%AE%A2%E6%9C%8D%281%29ss.png';

var rightA = {
  banner: 'https://cdn.jiyong365.com/%E4%B8%93%E4%BA%AB%E4%BC%98%E6%83%A0ss.png',
  icons: [imgAH,imgB,imgC,imgD],
  dots: ['r','g','g','g'],
  title: ['rts', 'rt', 'rt', 'rt'],
  condition: '成为锦时会员 立享4大会员专属权益',
  rights: '锦时会员可享受带有补贴标签商品的现金补贴，补贴金额最高可达60%;\n订单签收后，补贴金额会直接存入你的锦时“家庭基金”账户中。',
  talk:'1.锦时会员补贴金额最高为订单实付的60%;\n2.补贴余额不可提现，可用于下次消费。'
};

var rightB = {
  banner: 'https://cdn.jiyong365.com/%E5%85%8D%E9%82%AE%E5%88%B8%281%29ss.png',
  icons: [imgA,imgBH,imgC,imgD],
  dots: ['g','r','g','g'],
  title:['rt','rts','rt','rt'],
  condition: '    成为锦时会员 立享4大会员专属权益 锦时会员将享受一年52周，每周一个邮包邮费抵扣的福利。',
  rights: '仅仅是邮包免付上，锦时一年就为你节省了936元。用最实惠的价格，表达锦时对品质生活的诚意',
  talk:'1.锦时会员52周包邮仅会员每周第一个邮包结算时默认使用；\n2.52周包邮可与其他促销优惠叠加使用。\n3.每周邮包到家日期与时间可自行选择'
};

var rightC = {
  banner: 'https://cdn.jiyong365.com/%E7%B2%BE%E9%80%89%E5%95%86%E5%93%81ss.png',
  icons: [imgA,imgB,imgCH,imgD],
  dots: ['g','g','r','g'],
  title: ['rt', 'rt', 'rts', 'rt'],
  condition: '成为锦时会员 立享4大会员专属权益',
  rights: '锦时精心挑选高品质商品，以超低价格让利给锦时会员；\n锦时保证每一件商品的质量，在经过严选之后再推荐给用户。',
  talk:'精选商品从国产零食到进口美味应有尽有'
};

var rightD = {
  banner: 'https://cdn.jiyong365.com/%E5%AE%A2%E6%9C%8Dss.png',
  icons: [imgA,imgB,imgC,imgDH],
  dots: ['g','g','g','r'],
  title: ['rt', 'rt', 'rt', 'rts'],
  condition: '成为锦时会员 立享4大会员专属权益',
  rights: '在专业高效的客服服务基础上，为锦时会员开通专享客服服务，在线客服一对一专人沟通，实现高效率的购买环境。',
  talk:'1.锦时会员将默认享受专享客服服务；\n2.专享客服服务将不断升级完善。'
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  tapA: function (){
    var that = this;
    that.setData({
      right:rightA
    })
  },
  tapB: function () {
    var that = this;
    that.setData({
      right: rightB
    })
  },
  tapC: function () {
    var that = this;
    that.setData({
      right: rightC
    })
  },
  tapD: function () {
    var that = this;
    that.setData({
      right: rightD
    })
  },
  back:function(){
    wx.navigateBack({
      
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // iPhone X适配
    wx.getStorage({
      key: 'iPhoneX',
      success: function (res) {
        if (res.data) {
          // 是iPhone X
          that.setData({
            iphonex: true,
          })
        } else {
          // 不是iPhone X
          that.setData({
            iphonex: false,
          })
        }
      },
    });
    that.setData({
      right: rightA
    })
    // 根据上游页面船只不同，分为a、b、c、d四种状态
    switch(options.index){
      case 'a':
        // 专享优惠
        that.setData({
          right:rightA
        })
        break;
      case 'b':
        // 免邮
        that.setData({
          right: rightB
        })
        break;
      case 'c':
        // 精选商品
        that.setData({
          right: rightC
        })
        break; 
      case 'd':
        // 专享客服
        that.setData({
          right: rightD
        })
        break;   
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '直达精致，让家更好！',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})