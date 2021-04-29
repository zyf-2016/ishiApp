const baseURL = 'https://dj.shi1.cn'

function request(url, data) {
    if(wx.getStorageSync('connect_times') == 2) {
        wx.removeStorageSync('connect_times')
        return
    }
    return new Promise(function(resolve, reject) {
        let header = {
            'content-type': 'application/json',
            token: wx.getStorageSync('token') || ''
        };
        wx.request({
            url: baseURL + url,
            method: 'post',
            data: JSON.stringify(Object.assign({}, {appid: getApp().globalData.appid}, data)),
            header: header,
            success(res) {
                if(res.data.result === 'unauthorized') {
                    wx.login({
                        success: (res) => {
                          wx.request({
                            url: baseURL + '/user/getopenid',
                            method: 'post',
                            header: {
                              'content-type': 'application/json'
                            },
                            data: JSON.stringify({
                                appid: getApp().globalData.appid,
                                code: res.code
                            }),
                            success: response => {
                                wx.setStorageSync('token', response.data.token)
                                let times = wx.getStorageSync('connect_times') || 0
                                wx.setStorageSync('connect_times', parseInt(times)+1)
                                request(url, data)
                            }
                          })
                        }
                    })
                } else {
                    resolve(res);
                }
            },
            fail(err) {
                //请求失败
                reject(err)
            }
        })
    })
}

  module.exports.request = request;