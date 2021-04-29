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
    const activityid = options.activityid
    const share = options.share
    this.setData({
      activityid
    })
    if(share == 1) {
      this.setData({
        isShare: true
      })
    }
    this.getDetailData()
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
    const {openid, name} = e.currentTarget.dataset
    this.setData({
      title: '确定给'+name+'签到？',
      showLayer: true,
      openid
    })
  },
  setSign() {
    setsign({
      openid: this.data.openid,
      activityid: this.data.activityid
    }).then(res => {
      console.log(res)
      if(res.data.result == 'success') {
        wx.showToast({
          title: '设置签到成功',
          icon: 'success'
        })
        this.getDetailData()
      }
    })
  },
  getDetailData() {
    getactivitydetail({
      activityid: this.data.activityid
    }).then(res => {
      console.log(res)
      if(res.data && res.data.time) {
        res.data.date = res.data.time.split(' ')[0]
        res.data.day = res.data.time.split(' ')[1]
        this.setData({
          info: res.data
        })
      } else {
        this.setData({
          valid: false
        })
      }
    })
  },
  handleDelete() {
    this.setData({
      title: '确认删除活动？',
      showLayer: true
    })
  },
  cancel() {
    this.setData({
      showLayer: false
    })
  },
  confirm() {
    if(this.data.title === '确认删除活动？') {
      delactivity({
        activityid: this.data.activityid
      }).then(res => {
        if(res.data.result == 'success') {
          wx.showToast({
            title: '活动删除成功',
            icon: 'success',
            mask: true,
            duration: 1500
          })
          setTimeout(() => {
            app.globalData.shouldUploadList = true
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({
            title: '活动删除失败',
            icon: 'error',
            mask: true,
            duration: 1500
          })
        }
      })
    } else {
      this.setSign()
    }
    
    this.setData({
      showLayer: false
    })
  },
  onShareAppMessage(){
    return {
      path: `/pages/activityDetail/activityDetail?activityid=${this.data.activityid}&share=1`,

    }
  }
})