const app = getApp()
const { navigate } = require('../../static/js/utils.js')
const { getuserinfo, getduesdetail } = require('../../static/js/api.js')

Page({
  data: {
    avatarUrl: '',
    nickname: '',
    state: 0,
    audit: 0,
    detailInfo: {}
  },
  onLoad: function (options) {
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarurl,
      nickname: app.globalData.userInfo.nickname,
      name: app.globalData.userInfo.name,
      audit: app.globalData.userInfo.audit,
      height: `calc(100vh - 320rpx - ${app.globalData.navbarHeight}px)`
    })
    this.init()
    setTimeout(() => {
      app.globalData.init = true
    }, 1500);
  },
  onShow() {
    if(app.globalData.init) {
      this.init()
    }
  },
  getduesdetail(openid) {
    getduesdetail({
      openid
    }).then(res => {
      console.log('detail',res)
      if(res.data) {
        if(res.data.surplus) {
          res.data.surplus = res.data.surplus.toFixed(2)
        }
        if(res.data.dueslevel) {
          res.data.dueslevel = res.data.dueslevel.toFixed(2)
        }
        this.setData({
          detailInfo: res.data
        })
      }
    })
  },
  init() {
    this.getduesdetail(wx.getStorageSync('openid'))
    getuserinfo({
      openid: wx.getStorageSync('openid')
    }).then(resp => {
      app.globalData.userInfo.nickname = resp.data.nickname
      app.globalData.userInfo.moblie = resp.data.moblie
      app.globalData.userInfo.avatarurl = resp.data.avatarurl
      app.globalData.userInfo.education = resp.data.education
      app.globalData.userInfo.gender = resp.data.gender
      app.globalData.userInfo.idnumber = resp.data.idnumber
      app.globalData.userInfo.jobtitle = resp.data.jobtitle
      app.globalData.userInfo.joinpartytime = resp.data.joinpartytime
      app.globalData.userInfo.name = resp.data.name
      app.globalData.userInfo.openid = resp.data.openid
      app.globalData.userInfo.resume = resp.data.resume
      app.globalData.userInfo.role = resp.data.role
      app.globalData.userInfo.audit = resp.data.audit
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarurl,
        nickname: app.globalData.userInfo.nickname,
        audit: app.globalData.userInfo.audit,
        height: `calc(100vh - 320rpx - ${app.globalData.navbarHeight}px)`
      })

      if(app.globalData.userInfo.audit == 0 && app.globalData.userInfo.name) {
        this.setData({
          state: 1
        })
      } else if(app.globalData.userInfo.audit == 1) {
        this.setData({
          state: 2
        })
      } else if(app.globalData.userInfo.audit == 2) {
        this.setData({
          state: 3
        })
      }
    })
  },
  navigate(e) {
    const path = e.currentTarget.dataset.path
    app.globalData.page = '/pages/mine/mine'
    return navigate(path)
  },
  goToDetail() {
    if(!app.globalData.userInfo.nickname || !app.globalData.userInfo.moblie) {
      app.globalData.page = '/pages/mine/mine'
      return navigate()
    } else {
      const { avatarurl, name, openid } = app.globalData.userInfo
      const { duesend, dueslevel, state } = this.data.detailInfo
  
      const userinfo = {
        avatarurl,
        duesend,
        dueslevel: dueslevel ? parseFloat(dueslevel) : null,
        name,
        openid,
        state
      }
      wx.setStorageSync('userinfo', JSON.stringify(userinfo))
      wx.navigateTo({
        url: '/pages/addPayment/addPayment?isSelf=1'
      })
    }
  },
  onShareAppMessage(){
    return {
      
    }
  }
})