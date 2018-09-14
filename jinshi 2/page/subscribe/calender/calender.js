// page/subscribe/calender/calender.js

const API = require('../../../api/api.js');

var contentHeight;
// 控制分类列表

let monthList = [];
let weekList = [];

let selectedList = [];

let that_;
let beginYear0;

function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

function getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}

function getWeekNumber(t) {
  let now = new Date(Number(t)), year = now.getFullYear(), month = now.getMonth(), days = now.getDate();
  //那一天是那一年中的第多少天
  for (let i = 0; i < month; i++) {
    days += getMonthDays(year, i);
  }
  //那一年第一天是星期几
  let yearFirstDay = new Date(year, 0, 1).getDay() || 7;
  let week = null;
  if (yearFirstDay === 1) {
    week = Math.ceil(days / 7);
  } else {
    days -= (7 - yearFirstDay + 1);
    week = Math.ceil(days / 7) + 1;
  }
  return week;
}

let selects = [];
let weekLimit = 1;

let yearDot = [];

let topsumlist = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gif: '../../image/loading.gif',
    toView: ''
  },
  back: function () {
    wx.navigateBack({

    })
  },
  commit:()=>{
    selects = selects.sort();
    if (selects.length === weekLimit){
      const pages = getCurrentPages();
      pages[pages.length - 2].setWeeks(selects);
      wx.navigateBack({

      })
    }else{
      wx.showToast({
        title: '请选择' + weekLimit+'周',
      })
    }
  },
  weekTap: function (e) {
    let d = weekList[e.currentTarget.dataset.index][e.currentTarget.dataset.i];
    if (d.select) {
      d.select = 0;
      let selectss = []
      for (let i = 0; i < selects.length; i++) {
        if (selects[i] !== e.currentTarget.id) {
          selectss.push(selects[i]);
        }
      }
      selects = selectss;
    } else {
      if (selects.length + 1 > weekLimit) {
        wx.showToast({
          title: '最多选择' + weekLimit + '周',
        })
      } else {
        d.select = 1;
        selects.push(e.currentTarget.id);
      }
    }
    weekList[e.currentTarget.dataset.index][e.currentTarget.dataset.i] = d;
    that_.setData({
      weeks: weekList
    })
  },
  // 点分类筛选
  indexTap: function (e) {
    var that = this;
    var indexs = 'd' + e.currentTarget.id.split('i')[1];
    let indexN = parseInt(e.currentTarget.id.split('i')[1]);
    let by2 = beginYear0;
    if (indexN >= yearDot[0] && indexN < yearDot[1]) {
      by2 = beginYear0 + 1;
    }
    if (indexN > yearDot[1]) {
      by2 = beginYear0 + 2;
    }
    for (let i = 0; i < monthList.length; i++) {
      monthList[i].style = 'lt';
    }
    monthList[indexN].style = 'lta';
    that_.setData({
      toView: indexs,
      year: by2,
      months: monthList
    })
  },
  scroll: function (e) {
    for (let i = 0; i < weekList.length; i++) {
      monthList[i].style = 'lt';
    };
    let ttop = e.detail.scrollTop;
    for (let j = 0; j < topsumlist.length; j++) {
      if (ttop < topsumlist[j]) {
        monthList[j].style = 'lta';
        break;
      }
    }
    var that = this;
    that.setData({
      months: monthList,
    })
  },
  calcTop: function () {
    let topList = [];
    wx.getSystemInfo({
      success: function (res) {
        let rpxSign = 750 / res.windowWidth;
        for (var i = 0; i < weekList.length; i++) {
          switch (weekList[i].length) {
            case 1:
              topList.push(185 / rpxSign);
              break;
            case 2:
              topList.push(320 / rpxSign);
              break;
            case 3:
              topList.push(455 / rpxSign);
              break;
            case 4:
              topList.push(590 / rpxSign);
              break;
            case 5:
              topList.push(725 / rpxSign);
              break;
          }
        }
        // let topstar;
        // topstar = topList.reduce(function (a, b) {
        //   topsumlist.push(a);
        //   return a + b;
        // })
        let topstar = 0;
        for (let i = 0; i < topList.length; i++) {
          topstar = topstar + topList[i];
          topsumlist.push(topstar);
        }
      },
    })
  },
  calWeekSign: (n) => {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    let oneday = 1000 * 60 * 60 * 24;
    let day = today.getDay();
    today = today.getTime();
    let mon;
    if (day) {
      mon = today - (day - 1) * oneday;
    } else {
      // 周日
      mon = today - 6 * oneday;
    }
    return String(mon + n * 7 * oneday)
  },
  calWeekIndex: (t) => {
    return getWeekNumber(t);
  },
  calMonthName: (t) => {
    switch (t) {
      case 1:
        return '一月';
        break;
      case 2:
        return '二月';
        break;
      case 3:
        return '三月';
        break;
      case 4:
        return '四月';
        break;
      case 5:
        return '五月';
        break;
      case 6:
        return '六月';
        break;
      case 7:
        return '七月';
        break;
      case 8:
        return '八月';
        break;
      case 9:
        return '九月';
        break;
      case 10:
        return '十月';
        break;
      case 11:
        return '十一月';
        break;
      case 12:
        return '十二月';
        break;
    }
  },
  setWeekItem: (year, month, index) => {
    let now = new Date();
    now.setFullYear(Number(year));
    now.setMonth(Number(month) - 1);
    now.setDate(1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    let day = now.getDay();
    let nowTime = now.getTime();
    let oneday = 1000 * 60 * 60 * 24;
    let firstMonday = '';
    if (day) {
      firstMonday = nowTime + (8 - day) * oneday;
    } else {
      // 周日
      firstMonday = nowTime + oneday;
    }
    let result = [];
    while (new Date(firstMonday).getMonth() + 1 === month) {
      let ddd = new Date(firstMonday);
      if (ddd.getMonth() + 1 > month) {
        break;
      } else {
        let dss = new Date(firstMonday + 6 * oneday);
        let sunday = '';
        if (dss.getMonth() + 1 === month) {
          sunday = dss.getDate();
        } else {
          sunday = (dss.getMonth() + 1) + '月' + dss.getDate() + '日';
        }
        let item = {
          weekSign: firstMonday,
          monday: ddd.getDate(),
          sunday: sunday,
          weekIndex: that_.calWeekIndex(firstMonday),
          select: 0,
          sequence: index
        }
        result.push(item);
        firstMonday = firstMonday + 7 * oneday;
      }
    }
    return result;
    /* {
      weekSign:'xxxx',
      monday:'12',
      sunday:'4月1日',
      weekIndex:'5',
      select:1/0
    }
    */

  },
  calData: () => {
    // 周只能从下周开始
    let nextWeek0 = that_.calWeekSign(1);
    // 确定起始月
    let beginMonth = new Date(Number(nextWeek0)).getMonth() + 1;
    let beginYear = new Date(Number(nextWeek0)).getFullYear() - 2000;
    beginYear0 = beginYear;
    // 创建一个24个月的列表
    monthList.push({
      title: that_.calMonthName(beginMonth),
      style: 'lta'
    });
    weekList.push(that_.setWeekItem(2000 + beginYear, beginMonth, 0));
    let n = 0;
    for (let i = 0; i < 23; i++) {
      beginMonth++;
      if (beginMonth > 12) {
        yearDot.push(i);
        beginMonth = 1;
        n++;
        monthList.push({
          title: (beginYear + n) + '年' + beginMonth + '月',
          style: 'lt'
        });
        weekList.push(that_.setWeekItem(2000 + beginYear + n, beginMonth, i + 1));
      } else {
        monthList.push({
          title: that_.calMonthName(beginMonth),
          style: 'lt'
        });
        weekList.push(that_.setWeekItem(2000 + beginYear + n, beginMonth, i + 1));
      }
    }
    let firstM = [];
    for (let i = 0; i < weekList[0].length; i++) {
      if (weekList[0][i].weekSign >= Number(nextWeek0)) {
        firstM.push(weekList[0][i]);
      }
    }
    weekList[0] = firstM;
    that_.setData({
      months: monthList,
      weeks: weekList,
      year: beginYear0
    })
    that_.calcTop();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //wx.setStorageSync('loginFromIndex', 1);
    that_ = this;
    if (options.limit){
      weekLimit = Number(options.limit);
    }
    if (options.weeks) {
      selectedList = options.weeks.split('#');
      console.log(selectedList);
    }
    let that = this;
    that.calData();
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

    // 获取页面高度，设置scroll的高度
    wx.getSystemInfo({
      success: function (res) {
        // 需要减去导航栏、底部导航栏还有状态条
        contentHeight = (res.screenHeight - 113.5) * 750 / res.screenWidth;
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})