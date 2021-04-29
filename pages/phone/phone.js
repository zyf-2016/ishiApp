const app = getApp()
const { getmoblie, login } = require('../../static/js/api.js')

Page({
    data: {
      
    },
    onLoad: function (a) {
        this.setData({
            height: `${app.globalData.navbarHeight}px`
        })
    },
    goback() {
        wx.navigateBack()
    },
   
    getPhoneNumber: function (e) {
        console.log(e)
        if(e.detail.errMsg === "getPhoneNumber:ok") {
            getmoblie({
                openid: app.globalData.userInfo.openid,
                encrypted: e.detail.encryptedData,
                iv: e.detail.iv
            }).then(res => {
                if(res.data.phoneNumber) {
                    app.globalData.userInfo.moblie = res.data.phoneNumber
                    const { openid, nickname, avatarurl, gender, moblie } = app.globalData.userInfo
                    login({
                        openid,
                        nickname,
                        avatarurl,
                        gender: gender || 0,
                        moblie
                    }).then(res => {
                        if(wx.getStorageSync('navigateType') === 'navigate') {
                            wx.setStorageSync('navigateType', '')
                            wx.redirectTo({
                                url: app.globalData.page
                            })
                        } else {
                            if(res.data.result === 'success') {
                                wx.switchTab({
                                    url: app.globalData.page
                                })
                            }
                        }
                    })
                }
            })

        }
    }
});