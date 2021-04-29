var app = getApp()
Page({
    data: {
        height: 0,
        canIUseGetUserProfile: false
    },
    onLoad(options) {
        if (wx.getUserProfile) {
            this.setData({
              canIUseGetUserProfile: true
            })
        }
        this.setData({
            height: `${app.globalData.navbarHeight}px`
        })
    },
    goback() {
        wx.navigateBack()
    },
    getUserProfile(e) {
        wx.getUserProfile({
          desc: '用于完善个人资料',
          success: (res) => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            app.globalData.userInfo.avatarurl = res.userInfo.avatarUrl
            app.globalData.userInfo.nickname = res.userInfo.nickName
            app.globalData.userInfo.gender = res.userInfo.gender
            wx.navigateTo({
                url: '/pages/phone/phone'
            })
          }
        })
    },
    getUserInfo: function (e) {
        console.log(e)
        if (e.detail.errMsg === "getUserInfo:ok") {
            app.globalData.userInfo.avatarurl = e.detail.userInfo.avatarUrl
            app.globalData.userInfo.nickname = e.detail.userInfo.nickName
            app.globalData.userInfo.gender = e.detail.userInfo.gender
            wx.navigateTo({
                url: '/pages/phone/phone'
            })
        }
    }
});