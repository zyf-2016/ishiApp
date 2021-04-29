const app = getApp()
const { getquestion, pushexamscore } = require('../../static/js/api.js')

Page({
  data: {
    data: false,
    isInit: !0,
    listItem: {},
    listDetail: [],
    mycurrent: 0,
    mycurrentCopy: 0,
    listNuber: [],
    show: !1,
    index: 0
  },
  shezhi: function () {
    wx.showToast({
      title: '您已回答',
      icon: 'none'
    })
  },
  shezhi1() {
    console.log(this.data.listNuber[this.data.index])
    wx.showToast({
      title: '请选择答案',
      icon: 'none'
    })
  },
  // 从从到到0倒计时
  countdown: function (that) {
    var index = that.data.index
    var second = that.data.listNuber[index].second
    var lisnub = that.data.listNuber
    // var second =0
    if (second == 0) {
      lisnub[index].enddati = true
      lisnub[index].duicuo = 0,
        lisnub[index].choose = 9999

      that.setData({
        listNuber: lisnub,
        uanswer: '超时'
      });
      return;
    }
    if (that.data.listNuber[index].choose != '') {
      return;
    }
    var time = setTimeout(function () {
      lisnub[index].second = second - 1
      that.setData({
        listNuber: lisnub
      });
      that.countdown(that);
    }
      , 1000)
  },
  onLoad() {
    this.setData({
      listItem: app.globalData.listItem
    }), this.getListDetail();
  },
  goDown() {
    if (this.data.mycurrent + 1 > this.data.listDetail.length) return !1;
    this.setData({
      index:this.data.index+1,
      mycurrent: this.data.mycurrent + 1,
    });this.countdown(this)
  },
  getListDetail: function (tt) {
    getquestion({
      openid: app.globalData.userInfo.openid,
      topic: null,
      tag: null
    }).then(res => {
      console.log(res)
      res.data.map(item => {
        item.items = [item.answera, item.answerb, item.answerc, item.answerd],
        item.rightanswer = item.rightanswer.toUpperCase()
      })
      this.setData({
        listDetail: res.data,
        isInit: false
      })
      this.getListNumber()
    })
  },
  transformNum: function (t) {
    return t ? 1 == t ? "A" : 2 == t ? "B" : 3 == t ? "C" : 4 == t ? "D" : 5 == t ? "E" : 6 == t ? "F" : 7 == t ? "G" : 8 == t ? "H" : 9 == t ? "I" : 10 == t ? "J" : void 0 : "";
  },
  getListNumber: function () {
    var t = [], i = [];
    this.data.listDetail.forEach(function (e) {
      t.push({
        type: e.type,
        choose: "",
        second: 20
      })
    })

    this.setData({
      listNuber: t
    }), this.countdown(this);
  },
  catchTouchMove: function () {
    return false
  },
  mychange: function (t) {
    console.log('current', t);
    if (0 == t.detail.current) {
      console.log('ttt', '111');
      this.countdown(this)
    } else {
      console.log('ttt', '222');
      if (t.detail.current + 1 >= this.data.listDetail.length) {
        console.log('ttt', '333');
        this.countdown(this)
      } else {
        console.log('ttt', '444');
        this.countdown(this)
      }
    }
    this.setData({
      mycurrent: t.detail.current,
      mycurrentCopy: t.detail.current
    })
  },
  goChoose: function (t) {
    var thatt = this
    var i = t.currentTarget.dataset.fjnum, e = t.currentTarget.dataset.num, a = this.data.listNuber,
      ans = t.currentTarget.dataset.answer;//正确答案
    if (e == 1) {
      var uans = 'A'
      thatt.setData({
        uanswer: 'A'
      })
    } else if (e == 2) {
      var uans = 'B'
      thatt.setData({
        uanswer: 'B'
      })
    } else if (e == 3) {
      var uans = 'C'
      thatt.setData({
        uanswer: 'C'
      })
    } else if (e == 4) {
      var uans = 'D'
      thatt.setData({
        uanswer: 'D'
      })
    }
    ans = t.currentTarget.dataset.answer;//正确答案 
    if (ans == uans) {
      a[i].duicuo = 1;
    } else {
      a[i].duicuo = 0;
    }
    a[i].choose = e;
    a[i].enddati = true;
    console.log('aass',i, e,a);
    this.setData({
      enddati: true,
      answer: ans,
      listNuber: a
    });
  },
  answerLogin() {
    let count = 0, rate = 0, rightList = [], errorList = []
    this.data.listNuber.map((item, index) => {
      if(item.duicuo == 1) {
        rightList.push(this.data.listDetail[index].quesid)
      } else {
        count++
        errorList.push(this.data.listDetail[index].quesid)
      }
    })
    rate = parseInt((1 - count/this.data.listDetail.length) * 100)
    pushexamscore({
      openid: wx.getStorageSync('openid'),
      type: 1,
      score: count*10,
      rights: rightList.join(),
      wrongs: errorList.join()
    }).then(res => {
      console.log(res)
    })
    wx.navigateTo({
      url: `/pages/list-detail-result/list-detail-result?count=${count}&rate=${rate}`
    })
  },
  onShareAppMessage: function () {
    return {
      path: "/pages/index/index"
    }
  }
});