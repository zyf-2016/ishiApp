// pages/activityDetail/activityDetail.js
const app = getApp()

const { getactivitydetail, setsign, delactivity } = require('../../static/js/api.js')

Page({
  data: {
    showLayer: false,
    setsign: '',
    openid: '',
    isShare: false,
    valid: true,
    title: '确认删除活动？',
    info: {}
  },
  onLoad(options) {
    const data = JSON.parse(options.data)

    this.setData({
      info: data
    })
  },
  goback() {
    wx.navigateBack()
  },
  gohome(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  sign(e) {
    
  },
  setSign() {
   
  },
  handleDelete() {
   
  },
  cancel() {
  
  },
  confirm() {
    
  },
  onShareAppMessage(){
   
  }
})