const app = getApp()
const { getOpenId, pushmedia } = require('../../static/js/api.js')

Page({
  data: {
    url: '',
    isPlay: false
  },
  onLoad(options) {
    if (options.url) {
      this.setData({
        url: options.url
      })
    } else if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      this.setData({
        url: 'https://api.shi1.cn/common/dangjian/' + scene,
        scene
      })
      this.bindVideoInfo()
    }
  },
  bindVideoInfo() {
    if (!wx.getStorageSync('openid')) {
      wx.login({
        success: (res) => {
          getOpenId({
            code: res.code
          }).then(data => {
            pushmedia({
              openid: data.data.openid,
              centent: "宣誓留念",
              filetype: "video",
              scene: this.data.scene,
            }).then(res => {
              console.log(res)
            })
          })
        }
      })
    } else {
      pushmedia({
        openid: wx.getStorageSync('openid'),
        centent: "宣誓留念",
        filetype: "video",
        scene: this.data.scene,
      }).then(res => {
        console.log(res)
      })
    }
  },
  videoPlay() {
    var videoContextPrev = wx.createVideoContext('myVideo')
    videoContextPrev.play()
    this.setData({
      isPlay: true
    })
  },
  ended() {
    this.setData({
      isPlay: false
    })
  },
  //保存视频
  handleDownload() {
    wx.showLoading({
      title: '下载中...'
    })
    let fixname = this.data.url.split('.')
    let fileName = new Date().valueOf();
    wx.downloadFile({
      url: this.data.url,
      filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.' + fixname[fixname.length - 1],
      success: res => {
        let filePath = res.filePath;//下载到本地获取临时路径
        wx.saveVideoToPhotosAlbum({//保存到相册
          filePath,
          success: file => {
            wx.hideLoading()
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
            let fileMgr = wx.getFileSystemManager();
            fileMgr.unlink({//删除临时文件
              filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.' + fixname[fixname.length - 1],
            })
          },
          fail: err => {
            wx.hideLoading()
            wx.showToast({
              title: '保存失败',
              icon: 'none'
            });
          }
        })
      },
      fail(e) {
        wx.hideLoading()
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    })
  },
  //获取用户授权
  download() {
    wx.showLoading({
      title: '加载中...',
      mask: true,
    });
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('打开了授权')
              wx.hideLoading()
              that.handleDownload()
            },
            fail(err) {
              wx.hideLoading()
              wx.showToast({
                title: '授权失败',
                icon: 'none'
              });
            }
          })
        } else if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.openSetting({
            success(res) {
              console.log(res)
              if (res.authSetting['scope.writePhotosAlbum']) {
                console.log('授权了')
                wx.hideLoading()
                that.handleDownload()
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            },
            fail(err) {
              wx.hideLoading()
              wx.showToast({
                title: '授权失败',
                icon: 'none'
              });
            },
          })
        } else {
          wx.hideLoading()
          that.handleDownload()
        }
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    })
  }
})