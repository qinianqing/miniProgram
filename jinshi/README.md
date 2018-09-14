##  小程序应用结构

- app.js		小程序主启动文件
- app.json 		小程序主配置文件
- app.wxss		小程序全局样式文件
- api 			对所有请求进行封装
- template		项目中用到的模板文件
- image			图像文件，除了tab bar用到的图片，别的都通过CDN获取，不要保存在文件包中
- page			页面文件
- util			全局功能组件，比如时间序列化等js文件放到这里，一些通过npm加载的js也可以放在这里


### page架构

- index			首页及所有首页树下附属页面
- cart			购物车及所有购物车下附属页面
- category  分类页及子页面
- order 		订单及所有订单下附属页面
- product		商品详情页及所有商品下附属页面
- user			个人中心及下属所有附属页面
- family		家庭主页及所有家庭相关页面，包括会员支付页
- parcel		邮包及所有邮包下属页面

## 合并项目
### parcel
parcel、parcelmsg首页没变，history变更成list，commentHistory更新成product/comment/create/create

creathome更新成user/home/home
### goodsdetails
brand放在了product文件夹下、comment更名成comments、goodsdetails更新成goodsdetail