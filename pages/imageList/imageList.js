// pages/imageList/imageList.js
const app = getApp()
const { getmedialist } = require('../../static/js/api.js')

Page({
  data: {
    list: []
  },
  onLoad() {
    getmedialist({
      openid: app.globalData.userInfo.openid,
      centent: '党建留念'
    }).then(res => {
      res.data.map(item => {
        item.week = item.uploadtime.split('+')[0]
        item.date = item.uploadtime.split('+')[1]
      })
      console.log(res)
      this.setData({
        list: res.data
      })
    })
  },
  goback() {
    wx.navigateBack()
  },
  goToDetail(e) {
    wx.navigateTo({
      url: `/pages/image/image?url=${e.currentTarget.dataset.url}`
    })
  }
})