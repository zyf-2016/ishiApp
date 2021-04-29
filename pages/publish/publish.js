// pages/publish/publish.js
const app = getApp()

Page({
  data: {
    title: '',
    date: '',
    time: '',
    address: '',
    tempFilePaths: ''
  },
  upload() {
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: (res) => {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        this.setData({
          tempFilePaths: res.tempFilePaths[0]
        })
      }
    })
  },
  goback() {
    wx.navigateBack()
  },
  onChange(e) {
    console.log(e)
    const type = e.currentTarget.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  showTip(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  },
  submit() {
    const { title, date, time, address, tempFilePaths } = this.data
    if(!title || !title.trim().length) {
      this.showTip('请输入活动标题')
    } else if(!date || !date.trim().length) {
      this.showTip('请选择活动日期')
    } else if(!time || !time.trim().length) {
      this.showTip('请选择活动时间')
    } else if(!address || !address.trim().length) {
      this.showTip('请输入活动地点')
    } else if(!tempFilePaths) {
      this.showTip('请上传活动图片')
    } else {
      wx.showLoading()
      wx.uploadFile({
        url: 'https://dj.shi1.cn/activity/newactivity',
        filePath: this.data.tempFilePaths,
        name: 'file',
        header: {
          'content-type': 'application/json',
          token: wx.getStorageSync('token') || ''
        },
        formData: {
          appid: app.globalData.appid,
          title: this.data.title,
          time: this.data.date + ' ' + this.data.time,
          site: this.data.address
        },
        success: function (res) {
          console.log(res)
          debugger
          wx.hideLoading()
          if(res.data.indexOf('success') > -1) {
            wx.showToast({
              title: '活动发布成功',
              icon: 'success',
              duration: 1500
            })
            app.globalData.shouldUploadList = true
            setTimeout(() => {
              wx.navigateBack()
            }, 1500);
          } else {
            wx.showToast({
              title: '活动发布失败',
              icon: 'error',
              duration: 1500
            })
          }
        },
        fail: function(err) {
          console.log(err)
          wx.hideLoading()
        }
      })
    }
    
  }
})