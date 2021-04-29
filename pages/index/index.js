const app = getApp()
const { navigate } = require('../../static/js/utils.js')
const { getOpenId, getuserinfo, getmemberlist } = require('../../static/js/api.js')

Page({
  data: {
    username: '',
    role: 0,
    count: 0
  },
  onLoad: function (options) {
    if(app.globalData.userInfo.nickname) {
      this.setData({
        username: app.globalData.userInfo.nickname,
        role: app.globalData.userInfo.role,
        height: `${app.globalData.navbarHeight}px`
      })
    } else {
      wx.login({
        success: (res) => {
          console.log(res.code)
          getOpenId({
            code: res.code
          }).then(data => {
            wx.setStorageSync('token', data.data.token)
            wx.setStorageSync('openid', data.data.openid)
            return getuserinfo({
            openid: data.data.openid
            })
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
            if(resp.data.role == 1) {
              this.checkMember()
            }
            this.setData({
              username: app.globalData.userInfo.nickname,
              role: resp.data.role,
              height: `${app.globalData.navbarHeight}px`
            })
          })
        }
      })
    }
  },
  onShow() {
    // 查询审核中成员的数量并显示
    if(app.globalData.userInfo.role == 1) {
      this.checkMember()
    }
  },
  checkMember() {
    getmemberlist({
      audit: 0
    }).then(res => {
      if(res.data && res.data.length) {
        this.setData({
          count: res.data.length
        })
      } else {
        this.setData({
          count: 0
        })
      }
    })
  },
  navigate(e) {
    const path = e.currentTarget.dataset.path
    app.globalData.page = '/pages/index/index'
    return navigate(path)
  },
  scan() {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
        if(res.path) {
          wx.redirectTo({
            url: '/'+res.path
          })
        }
      }
    })
  },
  shezhi: function () {
    wx.showToast({
      title: '功能开发中敬请期待',
      icon: 'none',
      duration: 2000,
      success: function () {
        setTimeout(function () {
        }, 2000);
      }
    })
  },
  onShareAppMessage(){
    return {
      path: '/pages/index/index'
    }
  }
})