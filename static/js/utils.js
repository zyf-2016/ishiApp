const app = getApp()

const navigate = (path) => {
	if(!app.globalData.userInfo.nickname) {
		wx.navigateTo({
			url: '/pages/login/login'
		})
	} else if(!app.globalData.userInfo.moblie) {
		wx.navigateTo({
			url: '/pages/phone/phone'
		})
	} else {
		wx.navigateTo({
			url: path
		})
	}
}

module.exports = {
	navigate
}