// param updateTime
// return showTime
var getShowTime = function(uTime){
  // 当前时间
  var now = new Date();
  var nowGMT = now.getTime();
  // 导入时间
  var uTimeO = new Date(uTime);
  var uTimeGMT = uTimeO.getTime();
  // 差值，并换算成秒
  var minusTime = (nowGMT - uTimeGMT)/1000;
  var showTime;
  // 1分钟内显示刚刚
  // 1分钟外1小时内显示X分钟前
  // 1小时外24小时内显示X小时前
  // 24小时外（包括）1周内显示X天前
  // 超过1周显示具体的日期，格式为Y年M月D日 H时M分
  if(minusTime<60){
    // 1分钟
    showTime = '刚刚';
  }else if(minusTime >= 60 && minusTime < 3600){
    // 1小时内
    var minutes = parseInt(minusTime/60);
    showTime = minutes+'分钟前';
  }else if(minusTime >= 3600 && minusTime < 86400){
    // 1天内
    var hours = parseInt(minusTime/3600);
    showTime = hours+'小时前';
  }else if(minusTime >= 86400 && minusTime < 604800){
    // 1周内
    var days = parseInt(minusTime/86400);
    showTime = days+'天前';
  }else {
    //其他时间
    var yearU = uTimeO.getFullYear();
    var monthU = uTimeO.getMonth()+1;
    var dayU = uTimeO.getDate();
    var hourU = uTimeO.getHours();
    var minutesU = uTimeO.getMinutes();
    showTime = yearU + '年' + monthU + '月' + dayU + '日' +" "+hourU+':'+minutesU;
  }
  return showTime;
}

module.exports = getShowTime;
