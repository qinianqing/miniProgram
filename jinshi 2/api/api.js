// 正确数据，返回data下的对象，如果error_code不为0，则返回所有消息
const host = 'https://api.jiyong365.com';
//const host = 'https://stg.jiyong365.com';
//const host = 'http://localhost:3001';
// const host = 'http://localhost:3000';

const LogIn = require('../util/login.js');
let page = 0;
let js_token = '';

const API = {
  getToken : ()=>{
    return js_token;
  },
  setPage: (that) => {
    page = that;
  },
  rebind: (user_info) => {
    if (page) {
      if (user_info) {
        LogIn.reBind(user_info, (r) => {
          if (r) {
            // 登录成功
            page.letLoginModalShow(0);
          } else {
            // 登录失败
            page.letLoginModalShow(1);
          }
        }, () => {
          page.letLoginModalShow(1);
        });
      } else {
        page.letLoginModalShow(1);
      }
    } else {
      throw new Error('没有传入页面对象')
    }
  },
  // 登录
  login: (code) => {
    // 登录 ziv
    if (code) {
      let options = {
        path: '/passport/login/js-wa',
        params: {
          code: code
        },
        method: 'POST'
      }
      return req(options,1);
    } else {
      throw new Error('a code must be needed');
    }
  },
  checkUnionIdBinded: () => {
    let options = {
      path: '/passport/user/have-unionid',
      params: {

      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  checkIsFwhUser: () => {
    let options = {
      path: '/passport/user/is_fwh_user',
      params: {

      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  bindUnionId: (p) => {
    let options = {
      path: '/passport/user/bind-unionid-wa',
      params: {
        iv: p.iv,
        encryptedData: p.encryptedData
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  // 上报formId
  addFormId: (p) => {
    let options = {
      path: '/passport/user/add-form-id-wa',
      params: {
        form_id: p.form_id,
        quota: p.quota,
        expiredAt: p.expiredAt
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  pay: (order_id) => {
    let options = {
      path: '/pay/wx/order',
      params: {
        order_id: order_id
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  // 获取空间商品
  getSpaceList: (name, fromp) => {
    let options = {
      path: '/product/space/list-by-space',
      token: false,
      params: {
        space: name,
        from: fromp
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取家人商品列表
  getMemberList:(name,fromp)=>{
    let options = {
      path: '/product/member/list-by-member',
      token: false,
      params: {
        member: name,
        from: fromp
      },
      method: 'GET'
    }
    return req(options);
  },
  // subscribe相关接口
  // 获取首页订阅列表
  getSubscribeList: (fromp) => {
    let options = {
      path: '/subscribe/scene/wares/list',
      params: {
        from: fromp
      },
      method: 'GET',
    };
    return req(options);
  },
  getSubscribeDetail: (id) => {
    let options = {
      path: '/subscribe/scene/wares',
      params: {
        id: id
      },
      method: 'GET',
    };
    return req(options);
  },
  //订阅分享二维码
  getSubscribeCode: (id) => {
    let options = {
      path: '/subscribe/scene/wares/wx/code',
      params: {
        id: id
      },
      method: 'GET',
    };
    return req(options)
  },
  // 获取商品订阅列表
  getSubscribeListSpu: (spu_id) => {
    let options = {
      path: '/subscribe/scene/wares/spu-wares',
      params: {
        spu_id: spu_id
      },
      method: 'GET',
    };
    return req(options);
  },
  // 计算订阅邮费
  getSubOrderPrice: (id, family_id, province, num) => {
    let options = {
      path: '/subscribe/scene/order/price',
      params: {
        id: id,
        family_id: family_id,
        province: province,
        num: num
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  // 获取订阅订单列表
  getSubscribeOrderList: (family_id, status, last_key) => {
    let options = {
      path: '/subscribe/scene/order/list',
      params: {
        last_key: last_key,
        status: status,
        family_id: family_id
      },
      method: 'GET',
      token: true
    };
    return req(options);
  },
  // 获取订阅订单列表
  getSubscribeOrderDetail: (id) => {
    let options = {
      path: '/subscribe/scene/order',
      params: {
        subs_order_id: id
      },
      method: 'GET',
      token: true
    };
    return req(options);
  },
  // 获取某周包裹列表
  getSubscribePackageList: (family_id, week, last_key) => {
    let options = {
      path: '/subscribe/scene/package/week-list',
      params: {
        last_key: last_key,
        week: week,
        family_id: family_id
      },
      method: 'GET',
      token: true
    };
    return req(options);
  },
  subsPackageReceipt: (id, week) => {
    let options = {
      path: '/subscribe/scene/package/receipt',
      params: {
        subs_order_id: id,
        week: week
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  subsPackageLogistic: (id, week) => {
    let options = {
      path: '/subscribe/scene/package/logistic',
      params: {
        subs_order_id: id,
        week: week
      },
      method: 'GET',
      token: true
    };
    return req(options);
  },
  // 获取包裹详情
  getSubscribePackageDetail: (id, week) => {
    let options = {
      path: '/subscribe/scene/package',
      params: {
        subs_order_id: id,
        week: week
      },
      method: 'GET',
      token: true
    };
    return req(options);
  },
  // 取消订阅
  cancelSub: (id, reason) => {
    let options = {
      path: '/subscribe/scene/order/reverse',
      params: {
        subs_order_id: id,
        reason: reason
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  // 支付subscribe
  paySub: (id, province, family_id, weeks, num) => {
    let options = {
      path: '/pay/wx/subscribe',
      params: {
        id: id,
        province: province,
        family_id: family_id,
        weeks: weeks,
        num: num
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  shareSave: (goods_id) => {
    let options = {
      path: '/product/share/wx/code',
      params: {
        goods_id: goods_id
      },
      method: 'GET',
    };
    return req(options);
  },
  search: (query, from) => {
    let options = {
      path: '/search',
      params: {
        query: query,
        from: from
      },
      method: 'GET',
      token: false
    };
    return req(options);
  },
  getCurrentUser: () => {
    let options = {
      path: '/passport/user/info',
      method: 'GET',
      token: true
    };
    return req(options);
  },
  // 绑定手机号
  bindtel: (params) => {
    let options = {
      path: '/passport/user/tel-update-wa',
      params: {
        iv: params.iv,
        encryptedData: params.encryptedData,
      },
      method: 'POST',
      token: true
    };
    return req(options);
  },
  followFwhCallback: () => {
    let options = {
      path: '/passport/user/wa_follow_fwh_callback',
      params: {

      },
      method: 'POST',
      token: true
    }
    return req(options);
  },
  // 更新用户信息
  updateUserInfo: (params) => {
    let options = {
      path: '/passport/user/update',
      params: {
        avatar: params.avatar,
        user_name: params.user_name,
        gender: params.gender
      },
      method: 'POST',
      token: true
    }
    return req(options);
  },
  // 获取首页数据
  getIndex: () => {
    let options = {
      path: '/page/wa/index',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 获取首页推荐
  getIndexGuess: (theFrom) => {
    let options = {
      path: '/page/wa/index/guess',
      token: false,
      params: {
        from: theFrom
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取banner
  getBanners: () => {
    let options = {
      path: '/page/wa/banner',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 获取首页推荐
  getRecs: (rec_id) => {
    let options = {
      path: '/page/wa/rec/list',
      token: false,
      params: {
        rec_id: rec_id
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取分类信息
  getCategories: () => {
    let options = {
      path: '/page/wa/classify/all',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 获取一个品牌下的商品
  getProductListByBrand: (p) => {
    let options = {
      path: '/product/brand/list-by-brand',
      token: false,
      params: p,
      method: 'GET'
    }
    return req(options);
  },
  // 获取一个品牌下的商品
  getProductListByTag: (tag, fromP) => {
    let options = {
      path: '/product/list-by-tag',
      token: false,
      params: {
        tag: tag,
        from: fromP
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取家人关联的商品
  getProductListByMember:(member,fromP)=>{
    let options = {
      path: '/product/list-by-member',
      token: false,
      params: {
        tag: tag,
        from: fromP
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取空间关联的商品
  getProductListByMember: (space, fromP) => {
    let options = {
      path: '/product/list-by-space',
      token: false,
      params: {
        space: space,
        from: fromP
      },
      method: 'GET'
    }
    return req(options);
  },
  // 猜你喜欢随机
  getGuessRandom: () => {
    let options = {
      path: '/search/random',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 获取热词
  getHotSearch: () => {
    let options = {
      path: '/page/wa/search/hot',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 获取QA列表
  getQATopics: () => {
    let options = {
      path: '/page/wa/qa/topics',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 获取一个类目下所有QA
  getQADetail: (topic_id) => {
    let options = {
      path: '/page/wa/qa/detail',
      token: false,
      params: {
        topic_id: topic_id
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取用户默认家庭
  getDefaultFamily: () => {
    let options = {
      path: '/family/default',
      token: true,
      method: 'GET'
    }
    return req(options);
  },
  // 获取某个家庭信息
  getFamily: (family_id) => {
    let options = {
      path: '/family',
      token: true,
      params: {
        family_id: family_id
      },
      method: 'GET'
    }
    return req(options);
  },
  // 创建家庭
  createFamily: (family) => {
    let options = {
      path: '/family/create',
      token: true,
      params: {
        //default: 1,
        address: family.address,
        contact: family.contact,
        province: family.province,
        city: family.city,
        county: family.county,
        phone: family.phone,
        remark: family.remark,
        members: family.members
      },
      method: 'POST'
    }
    return req(options);
  },
  // 更新家庭
  updateFamily: (family) => {
    let options = {
      path: '/family/update',
      token: true,
      params: {
        //default: 1,
        family_id: family.family_id,
        name: family.name,
        address: family.address,
        contact: family.contact,
        province: family.province,
        city: family.city,
        county: family.county,
        phone: family.phone,
        remark: family.remark,
        members: family.members
      },
      method: 'POST'
    }
    return req(options);
  },
  //获取家庭列表
  getFamilylist: () => {
    let options = {
      path: '/family/list',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  checkTried: (family_id) => {
    let options = {
      path: '/family/member/check-tried',
      token: true,
      params: {
        family_id: family_id
      },
      method: 'POST'
    }
    return req(options);
  },
  // 判断用户是否试用过
  isUserTried: () => {
    let options = {
      path: '/passport/user/is-tried',
      token: true,
      method: 'GET'
    }
    return req(options);
  },
  // 获取会员价格
  getMemberPrice: () => {
    let options = {
      path: '/family/member/price',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 发起试用
  tryMember: (family_id) => {
    let options = {
      path: '/family/member/try',
      token: true,
      params: {
        family_id: family_id
      },
      method: 'POST'
    }
    return req(options);
  },
  // // 用激活码激活
  // codeActive: (code, family_id) => {
  //   let options = {
  //     path: '/family/member/code/active',
  //     token: true,
  //     params: {
  //       family_id: family_id,
  //       code: code,
  //     },
  //     method: 'POST'
  //   }
  //   return req(options);
  // },
  // 获取商品详情页sku
  getSkuDetails: (sku_id) => {
    let options = {
      path: '/product',
      params: {
        sku_id: sku_id
      },
      method: 'GET'
    }
    return req(options)
  },
  //获取商品详情spu
  getSpuDetails: (spu_id) => {
    let options = {
      path: '/product',
      params: {
        spu_id: spu_id
      },
      method: 'GET'
    }
    return req(options)
  },
  //获取全部评论列表
  getCommentsAllDetails: (sku_id, last_key) => {
    let options = {
      path: '/evaluate/product/list',
      params: {
        goods_id: sku_id,
        last_key: last_key
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  // 发起支付——会员卡
  payMember: (family_id, type,invite_user) => {
    let options = {
      path: '/pay/wx/member',
      token: true,
      params: {
        family_id: family_id,
        type: type,
        invite_user: invite_user
      },
      method: 'POST'
    }
    return req(options);
  },
  // 加入购物车
  addCart: (params) => {
    let options = {
      path: '/cart/add',
      token: true,
      params: params,
      method: 'POST'
    }
    return req(options);
  },
  // 从购物车中删除
  deleteCart: (params) => {
    let options = {
      path: '/cart/delete',
      token: true,
      params: params,
      method: 'POST'
    }
    return req(options);
  },
  // 获取购物车列表
  getCart: () => {
    let options = {
      path: '/cart/list',
      token: true,
      method: 'GET'
    }
    return req(options);
  },
  // App启动获得购物车，不拉起登录
  getCartUntoken: () => {
    let options = {
      path: '/cart/list',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 清空失效购物车
  clearInvalidCart: () => {
    let options = {
      path: '/cart/clear-invalid',
      token: true,
      method: 'POST'
    }
    return req(options);
  },
  // 修改购物车条目
  updateCart: (params) => {
    let options = {
      path: '/cart/update',
      token: true,
      params: params,
      method: 'POST'
    }
    return req(options);
  },
  // 获取一个spu下的所有sku条目
  getSkusBySpu: (params) => {
    let options = {
      path: '/cart/skus-by-spu',
      token: true,
      params: params,
      method: 'GET'
    }
    return req(options);
  },
  // 创建订单
  createOrder: (params) => {
    let options = {
      path: '/order/create',
      token: true,
      params: params,
      method: 'POST'
    }
    return req(options);
  },
  // 取消订单
  cancelOrder: (order_id) => {
    let options = {
      path: '/order/cancel-order',
      token: true,
      params: {
        order_id: order_id
      },
      method: 'POST'
    }
    return req(options);
  },
  // 删除订单
  deleteOrder: (order_id) => {
    let options = {
      path: '/order/delete-order',
      token: true,
      params: {
        order_id: order_id
      },
      method: 'POST'
    }
    return req(options);
  },
  // 再次购买
  buyOrderAgain: (order_id) => {
    let options = {
      path: '/order/buy-again',
      token: true,
      params: {
        order_id: order_id
      },
      method: 'POST'
    }
    return req(options);
  },
  // 查看订单列表
  getOrderList: (status, last_key) => {
    let options = {
      path: '/order/list',
      token: true,
      params: {
        status: status,
        last_key: last_key
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取订单详情
  getOrderDetail: (order_id) => {
    let options = {
      path: '/order',
      token: true,
      params: {
        order_id: order_id,
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取退换货地址
  getReturnAddress: () => {
    let options = {
      path: '/order/reverse/return-address',
      token: true,
      params: {},
      method: 'GET'
    }
    return req(options);
  },
  // 获取快递和对应代码
  getExpressBrandCode: () => {
    let options = {
      path: '/order/reverse/express-brand2code',
      token: true,
      params: {},
      method: 'GET'
    }
    return req(options);
  },
  // 获取逆向流程订单列表
  // 获取订单详情
  getReverseOrderList: (type) => {
    let options = {
      path: '/order/reverse/list',
      token: true,
      params: {
        type: type,
      },
      method: 'GET'
    }
    return req(options);
  },
  // 发起逆向流程
  createReverseOrder: (params) => {
    let options = {
      path: '/order/reverse/create',
      token: true,
      params: params,
      method: 'POST'
    }
    return req(options);
  },
  // 撤销逆向流程
  revokeReverseOrder: (reverse_id) => {
    let options = {
      path: '/order/reverse/revoke',
      token: true,
      params: {
        reverse_id: reverse_id
      },
      method: 'POST'
    }
    return req(options);
  },
  // 填写逆向物流单号
  addExpressForReverseOrder: (reverse_id, express_id, express_brand) => {
    let options = {
      path: '/order/reverse/add_express',
      token: true,
      params: {
        reverse_id: reverse_id,
        express_id: express_id,
        express_brand: express_brand
      },
      method: 'POST'
    }
    return req(options);
  },
  // 查询逆向流程详情
  getReverseOrderDetail: (reverse_id) => {
    let options = {
      path: '/order/reverse',
      token: true,
      params: {
        reverse_id: reverse_id,
      },
      method: 'GET'
    }
    return req(options);
  },

  // 获取物流信息
  getLogistic: (order_id) => {
    let options = {
      path: '/order/logistic',
      token: true,
      params: {
        order_id: order_id,
      },
      method: 'GET'
    }
    return req(options);
  },
  confirmReceipt: (order_id) => {
    let options = {
      path: '/order/receipt',
      token: true,
      params: {
        order_id: order_id,
      },
      method: 'POST'
    }
    return req(options);
  },
  // 获取购物车商品总价
  getCartTotalPrice: (items) => {
    let options = {
      path: '/cart/check/price',
      token: true,
      params: {
        items: items,
      },
      method: 'POST'
    }
    return req(options);
  },
  // 获取购物车提示
  getCartNotice: () => {
    let options = {
      path: '/cart/check/notice',
      token: true,
      params: {
      },
      method: 'POST'
    }
    return req(options);
  },
  // 校验优惠码
  exchangeCouponCode: (code) => {
    let options = {
      path: '/promote/coupon/code/exchange',
      token: true,
      params: {
        code: code
      },
      method: 'POST'
    }
    return req(options);
  },
  // 获取优惠券列表
  getCouponList: () => {
    let options = {
      path: '/promote/coupon/wallet/user-list',
      token: true,
      params: {
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取优惠券模板信息
  getCouponTemplates: (coupons) => {
    let options = {
      path: '/promote/coupon/template/info',
      token: true,
      params: {
        coupons: coupons
      },
      method: 'POST'
    }
    return req(options);
  },
  // 领券
  getCouponByUser: (coupon_id) => {
    let options = {
      path: '/promote/coupon/get/by-userid',
      token: true,
      params: {
        coupon_id: coupon_id
      },
      method: 'POST'
    }
    return req(options);
  },
  //取最适合的优惠券
  getBestCoupon: (payment, skus) => {
    let options = {
      path: '/promote/coupon/get/best-coupon',
      token: true,
      params: {
        payment: payment,
        skus: skus
      },
      method: 'POST'
    }
    return req(options);
  },
  //获取个人某种券的数量
  getOneCouponNumber:(coupon_id)=>{
    let options = {
      path: '/promote/coupon/wallet/one-type-coupon',
      token: true,
      params: {
        coupon_id: coupon_id
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取优惠券适用产品
  getCouponFitList: (coupon_id) => {
    let options = {
      path: '/promote/coupon/use/fit-list',
      token: true,
      params: {
        coupon_id: coupon_id
      },
      method: 'GET'
    }
    return req(options);
  },
  getFscList: (family_id) => {
    let options = {
      path: '/promote/coupon/wallet/family-list',
      token: true,
      params: {
        family_id: family_id
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取联名卡详情
  getCoBrandedCard: function (id) {
    let options = {
      path: '/promote/cbc',
      params: {
        id:id
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  // 激活联名卡
  activeCoBrandedCard: function (id,family_id) {
    let options = {
      path: '/promote/cbc/active',
      params: {
        id:id,
        family_id:family_id
      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  // 获取购物车商品总价，返回快递费
  getPriceAndFreight: (items, province) => {
    let options = {
      path: '/cart/check/price',
      token: true,
      params: {
        items: items,
        province: province
      },
      method: 'POST'
    }
    return req(options);
  },
  //获取直发总价，运费
  getDirectAndFreight:function(sku,num,province){
    let options = {
      path: '/cart/check/direct/check',
      token: true,
      params: {
        sku:sku,
        num:num,
        province: province
      },
      method: 'POST'
    }
    return req(options);
  },
  // 获取周提示
  getWeekNotice: () => {
    let options = {
      path: '/cart/check/week-consume',
      token: true,
      method: 'GET'
    }
    return req(options);
  },
  // 获取用户钱包余额
  getUserWalletBalance: () => {
    let options = {
      path: '/wallet/user/balance',
      token: true,
      method: 'GET'
    }
    return req(options);
  },
  //获取相关商品
  getCorrelation:(goods_id)=>{
    let options = {
      path: '/product/get/correlation',
      token: true,
      method: 'GET',
      params:{
        goods_id:goods_id
      }
    }
    return req(options);
  },
  // 获取家庭余额
  getFamilyWalletBalance: (family_id) => {
    let options = {
      path: '/wallet/family/balance',
      token: true,
      params: {
        family_id: family_id
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取用户交易列表
  getUserWalletList: (type) => {
    let options = {
      path: '/wallet/user/bills',
      token: true,
      params: {
        type: type,
      },
      method: 'GET'
    }
    return req(options);
  },
  // 获取家庭交易列表
  getFamilyWalletList: (type, family_id, last_key) => {
    let options = {
      path: '/wallet/family/bills',
      token: true,
      params: {
        type: type,
        family_id: family_id,
        last_key: last_key
      },
      method: 'GET'
    }
    return req(options);
  },
  // 按已评价和未评价获取商品列表
  getEvaProductList: (eva_status, last_key) => {
    let options = {
      path: '/evaluate/user/list',
      token: true,
      params: {
        eva_status: eva_status,
        last_key: last_key
      },
      method: 'GET'
    }
    return req(options);
  },
  getEvaDetailByRecord: (goods_id, object_id) => {
    let options = {
      path: '/evaluate/detail-by-record',
      token: true,
      params: {
        goods_id: goods_id,
        object_id: object_id
      },
      method: 'GET'
    }
    return req(options);
  },
  //评价成功之后返回商品历史记录
  callbackHistoryCommit: (object_id, comment_id) => {
    let options = {
      path: '/evaluate/callback',
      token: true,
      params: {
        object_id: object_id,
        comment_id: comment_id
      },
      method: 'POST'
    }
    return req(options);
  },
  // 获取收藏列表
  getCollectList: (last_key) => {
    let options = {
      path: '/subscribe/collect/list',
      token: true,
      params: {
        last_key: last_key
      },
      method: 'GET'
    }
    return req(options);
  },
  // 按已评价和未评价获取商品列表
  getAging: () => {
    let options = {
      path: '/cart/check/aging',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  getRegionVersion: () => {
    let options = {
      path: '/cart/check/region-version',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  getRegion: () => {
    let options = {
      path: '/cart/check/region',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  // 获取省份与仓库的对应关系
  getWarehouseMapping: () => {
    let options = {
      path: '/cart/check/warehouse-mapping',
      token: false,
      method: 'GET'
    }
    return req(options);
  },
  //收藏接口
  collectAdd: (goods_id, is_collect) => {
    let options = {
      path: '/subscribe/collect/add',
      token: true,
      params: {
        goods_id: goods_id,
        is_collect: is_collect
      },
      method: 'POST'
    }
    return req(options)
  },
  //删除收藏接口
  collectDelete: (params) => {
    let options = {
      path: '/subscribe/collect/delete',
      token: true,
      params: params,
      method: 'POST'
    }
    return req(options)
  },

  //创建评论
  createComment: (commentDetails) => {
    let options = {
      path: '/evaluate/create',
      token: true,
      params: {
        sku_id: commentDetails.sku_id,
        spu_id: commentDetails.spu_id,
        star_num: commentDetails.star_num,
        comment_content: commentDetails.comment_content,
        comment_image: commentDetails.comment_image,
        type_id: commentDetails.type_id
      },
      method: 'POST'
    }
    return req(options)
  },
  //二分类到三级分类
  toCategorythree: (level3_id) => {
    let options = {
      path: '/category/get_peerid',
      params: {
        id: level3_id
      },
      method: 'GET'
    }
    return req(options)
  },
  //三级分类列表
  categoryThreeList: (levelid3,fromP) => {
    let options = {
      path: '/category/get_goods',
      params: {
        levelid3: levelid3,
        from:fromP
      },
      method: 'GET'
    }
    return req(options)
  },
  /******************商品详情页*****************/
  //改变数据结构后的查新商品详情接口
  getGoodsDetail: (goods_id) => {
    let options = {
      path: '/product',
      params: {
        goods_id: goods_id,
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //无token查询商品数据接口
  getGoodsUntoken: (goods_id) => {
    let options = {
      path: '/product/untoken',
      params: {
        goods_id: goods_id,
      },
      method: 'GET'
    }
    return req(options)
  },
  // 获取商品组信息
  getGoodGroup: (id, theFrom) => {
    let options = {
      path: '/product/group',
      params: {
        id: id,
        from: theFrom
      },
      method: 'GET'
    }
    return req(options)
  },
  //得到单独的sku
  getSku:(skuId) =>{
   let options = {
     path:'/product/getSku',
     params: {
       skusId: skuId
     },
     method:'GET'
   }
   return req(options)
  },
  /******************申请售后*****************/
  //创建售后清单
  createReverseList: (parm) => {
    let options = {
      path: '/order/reverse/create',
      params: {
        order_id: parm.order_id,
        item: parm.item,
        type: parm.type,
        reason: parm.reason,
        content: parm.content,
        pics: parm.pics
      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  //获取售后的进度
  getReverseProcess: (reverse_id) => {
    let options = {
      path: '/order/reverse',
      params: {
        reverse_id: reverse_id
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //撤销申请
  cancelReverse: (reverse_id) => {
    let options = {
      path: '/order/reverse/revoke',
      params: {
        reverse_id: reverse_id
      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  //得到商家地址
  getJinshiAddress: function () {
    let options = {
      path: '/order/reverse/return-address',
      params: {
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //得到物流品牌代码
  getLogistics: function () {
    let options = {
      path: '/order/reverse/express-brand2code',
      params: {
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //创建逆向物流订单
  createUpdateOrder: function (parm) {
    let options = {
      path: '/order/reverse/update-express',
      params: {
        reverse_id: parm.reverse_id,
        express_id: parm.express_id,
        express_brand: parm.express_brand,
        tel: parm.tel,
        logistics_pic: parm.logistics_pic,
        reverse_detail: parm.reverse_detail
      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  //获取售后列表
  getReverseList: function (type, last_key) {
    let options = {
      path: '/order/reverse/list',
      params: {
        type: type,
        last_key: last_key
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //厂家直发
  directGoods: function (parm) {
    let options = {
      path: '/order/create-sku-direct',
      params: {
        sku: parm.sku,
        address: parm.address,
        contact: parm.contact,
        phone: parm.phone,
        province: parm.province,
        city: parm.city,
        county: parm.county,
        family: parm.family,
        fsc_code: parm.fsc_code,
        coupon_code: parm.coupon_code,
        num:parm.num,
        family_id:parm.family_id
      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  /******************邀请好友*****************/
  //获取二维码
  getWXcode: function () {
    let options = {
      path: '/wx/invite/get/wx_code',
      params: {

      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  //创建邀请
  createInvite: function (parm) {
    let options = {
      path: '/wx/invite/create',
      params: {
        user_id: parm.user_id,
        order_id:parm.order_id,
        invite_money: parm.invite_money,
      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  createOldInvite:function(parm){
    let options = {
      path: '/wx/invite/create/old',
      params: {
        user_id: parm.user_id,
        order_id: parm.order_id,
        invite_money: parm.invite_money,
      },
      token: true,
      method: 'POST'
    }
    return req(options)
  },
  //排行榜
  getRanking: function () {
    let options = {
      path: '/wx/invite/ranking',
      params: {
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //我的邀请
  getMself: function () {
    let options = {
      path: '/wx/invite/myself',
      params: {
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //手气红包
  getLuckCoupon:function(){
    let options = {
      path: '/wx/invite/random/coupon',
      params: {
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //新人专享红包
  getNewUser:function(){
    let options = {
      path: '/wx/invite/new/coupon',
      params: {
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //得到某人一天所得红包数量
  getOneCouponNum:function(){
    let options = {
      path: '/wx/invite/day/coupon',
      params: {
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //检查是否有重
  checkSame:function(parm){
    let options = {
      path: '/wx/invite/check/same',
      params: {
        order_id:parm.order_id,
        user_id:parm.user_id
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //订单分享排行
  getOrderRanking:function(params){
    let options = {
      path: '/wx/invite/money/ranking',
      params: {
        order_id: params.order_id,
        user_id: params.user_id
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  // 福利列表
  getActList:function(){
    let options = {
      path: '/wx/invite/act/list',
      params: {
       
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //福利手气数量
  getActNum:function(order_id){
    let options = {
      path: '/wx/invite/get/act/num',
      params: {
        order_id: order_id,
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //发券人
  getSendNum: function (user_id,order_id) {
    let options = {
      path: '/wx/invite/send/user/num',
      params: {
       user_id:user_id,
       order_id:order_id
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //个人中心页未付款
  getDfkNum:function(){
    let options = {
      path: '/order/dfk/num',
      params: {
       
      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //待收货
  getDshNum: function () {
    let options = {
      path: '/order/dsh/num',
      params: {

      },
      token: true,
      method: 'GET'
    }
    return req(options)
  },
  //人气排行榜
  getRankingLists:function(){
    let options = {
      path: '/product/group/ranking/list',
      params: {

      },
      method: 'GET'
    }
    return req(options)
  },
  //商品详情页商品组合
  getGroupIdDetail:function(goods_id){
    let options = {
      path: '/subscribe/scene/spu-map/list',
      params: {
         spu_id:goods_id
      },
      method: 'GET'
    }
    return req(options)
  }
};

const BindUnionIdFunc = () => {
  if (page) {
    return new Promise((resolve, reject) => {
      // 检查是否bindUnionId
      LogIn.checkLocal((r) => {
        if (r) {
          // 本地有
          resolve(1);
        } else {
          // 本地没有
          // 1、验证云端
          LogIn.check((r) => {
            if (r) {
              // 云端有
              resolve(1);
            } else {
              // 云端没有
              // 发起登录

              // 直接通过接口发起登录没有了，直接拉起登录框
              page.letLoginModalShow(1);

              // LogIn.bind((r) => {
              //   if (r) {
              //     // 授权成功
              //     resolve(1);
              //   } else {
              //     // 登录失败
              //     // 拉起登录框
              //     page.letLoginModalShow(1);
              //     reject(0);
              //   }
              // })
            }
          })
        }
      });
    })
  } else {
    throw new Error('没有传入页面对象')
  }
};

// return a promise
// options 包括path,params,token三个属性
// path，必传否则会返回错误
// method,默认为'GET'，必须大写
// params,是一个对象，非必填
// token值为true或者false，默认为false
const req = (options,isLogin) => {
  return new Promise((resolve, reject) => {
    if (options.path) {
      var params = options.params;
      var path = options.path;
      var method = options.method || 'GET';
      var token = '';
      if (options.token) {
        BindUnionIdFunc().then((r) => {
          // token
          wx.request({
            url: host + path,
            data: params,
            header: {
              'x-access-token': js_token
            },
            method: method,
            success: (res) => {
              if (res.statusCode == 200) {
                if (res.data.error_code) {
                  return reject(res.data);
                } else {
                  return resolve(res.data.data);
                }
              } else {
                return reject(res.data);
              }
            },
            fail: (res) => {
              return reject(res);
            }
          })
        }, (err) => {
          return 0;
        })
      } else {
        // 无需token
        if(isLogin){
          wx.request({
            url: host + path,
            data: params,
            method: method,
            success: (res) => {
              if (res.statusCode == 200) {
                if (res.data.error_code) {
                  return reject(res.data);
                } else {
                  js_token = res.data.data.token;
                  return resolve(res.data.data);
                }
              } else {
                return reject(res.data);
              }
            },
            fail: (res) => {
              return reject(res);
            }
          })
        }else{
          wx.request({
            url: host + path,
            data: params,
            header: {
              'x-access-token': js_tokens
            },
            method: method,
            success: (res) => {
              if (res.statusCode == 200) {
                if (res.data.error_code) {
                  return reject(res.data);
                } else {
                  return resolve(res.data.data);
                }
              } else {
                return reject(res.data);
              }
            },
            fail: (res) => {
              return reject(res);
            }
          })
        }
      }
    } else {
      throw new Error('options.path must be needed');
    }
  })
}

module.exports = API;