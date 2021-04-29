// pages/video/video.js
const app = getApp()
const { getmedialist } = require('../../static/js/api.js')
Page({
  data: {
    videoList: []
  },

  onLoad: function (options) {
    getmedialist({
      openid: app.globalData.userInfo.openid,
      centent: '宣誓留念'
    }).then(res => {
      res.data.map(item => {
        item.week = item.uploadtime.split('+')[0]
        item.date = item.uploadtime.split('+')[1]
      })
      this.setData({
        videoList: res.data
      })
    })
  },
  goback() {
    wx.navigateBack()
  },
  videoPlay(e) {
    wx.navigateTo({
      url: `/pages/video/video?url=${e.currentTarget.dataset.url}`
    })
  }
})