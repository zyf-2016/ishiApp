// pages/sign/sign.js
const app = getApp()
const { getunsignlist, getsignedlist } = require('../../static/js/api.js')

Page({
  data: {
    currentIndex: 0,
    list: []
  },
  onLoad: function (options) {
    this.getunsignlist()
  },
  goback() {
    wx.navigateBack()
  },
  tabChange(e) {
    const index = e.currentTarget.dataset.index
    if(this.data.currentIndex == index) return false
    this.setData({
      currentIndex: index
    })
    if(index == 0) {
      this.getunsignlist()
    } else {
      this.getsignedlist()
    }
  },
  getunsignlist() {
    getunsignlist({
      openid: app.globalData.userInfo.openid
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  },
  getsignedlist() {
    getsignedlist({
      openid: app.globalData.userInfo.openid
    }).then(res => {
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  }
})