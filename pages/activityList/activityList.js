// pages/activityList/activityList.js
const app = getApp()

const { getactivitylist } = require('../../static/js/api.js')

Page({
  data: {
    list: []
  },
  onLoad() {
    this.initList()
  },
  goback() {
    wx.navigateBack()
  },
  initList() {
    getactivitylist({}).then(res => {
      this.setData({
        list: res.data
      })
    })
  },
  onShow() {
    if(app.globalData.shouldUploadList) {
      app.globalData.shouldUploadList = false
      this.initList()
    }
  },
  add() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    })
  },
  goToDetail(e) {
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?activityid='+e.currentTarget.dataset.activityid
    })
  }
})