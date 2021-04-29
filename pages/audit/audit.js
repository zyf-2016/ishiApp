
const app = getApp()
const { getuserinfo, setaudit } = require('../../static/js/api.js')

Page({
  data: {
    showLayer: false,
    title: '',
    openid: '',
    avatarurl: '',
    name: null,
    idnumber: null,
    joinpartytime: null,
    education: null,
    jobtitle: null,
    resume: null,
    state: 0,
    readonly: false
  },
  onLoad: function (options) {
    if(options.readonly) {
      this.setData({
        readonly: true
      })
    }
    getuserinfo({
      openid: options.openid
    }).then(res => {
      console.log('init', res)
      const { avatarurl, name, idnumber, joinpartytime, education, jobtitle, resume } = res.data
      this.setData({
        openid: options.openid,
        avatarurl: avatarurl,
        name: name || '',
        idnumber: idnumber || '',
        joinpartytime: joinpartytime || '',
        education: education || '',
        jobtitle: jobtitle || '',
        resume: resume || '',
        height: `calc(100vh - ${app.globalData.navbarHeight}px)`
      })
    })
  },
  goback() {
    wx.navigateBack()
  },
  agree() {
    this.setData({
      state: 1,
      title: '确认通过？',
      showLayer: true
    })
  },
  reject() {
    this.setData({
      state: 2,
      title: '确认拒绝？',
      showLayer: true
    })
  },
  cancel() {
    this.setData({
      showLayer: false
    })
  },
  confirm() {
    setaudit({
      openid: this.data.openid,
      audit: this.data.state
    }).then(res => {
      if(res.data.result == 'success') {
        wx.showToast({
          title: this.data.state == 1 ? '审核通过' : '审核已拒绝',
          icon: this.data.state == 1 ? 'success' : 'error',
          mask: true,
          duration: 1500
        })
        this.setData({
          showLayer: false
        })
        setTimeout(() => {
          app.globalData.shouldUploadList = true
          wx.navigateBack()
        }, 1500);
      }
    })

  }
})