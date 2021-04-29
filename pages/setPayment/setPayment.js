// pages/setPayment/setPayment.js
const app = getApp()
const { setinitialize } = require('../../static/js/api.js')

Page({
  data: {
    date: '',
    count: '',
    info: {},
    showLayer: false
  },
  onLoad() {
    if(wx.getStorageSync('userinfo')) {
      const userinfo = JSON.parse(wx.getStorageSync('userinfo'))
      let date = ''
      if(userinfo.duesend) {
        let arr = userinfo.duesend.replace(/\//g,'-').split('-')
        date = arr[0]+'-'+(arr[1]<10?('0'+arr[1]):arr[1])
      }
      this.setData({
        storage: userinfo,
        info: userinfo,
        date: date || '',
        count: userinfo.dueslevel && userinfo.dueslevel.toString()
      })
    }
    console.log(wx.getStorageSync('userinfo'))
  },
  goback() {
    wx.navigateBack()
  },
  change(e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
  },
  showToast(title) {
    wx.showToast({
      title,
      icon: 'none'
    })
  },
  add() {
    const {count, date } = this.data
    if(count && count.trim() == '') {
      this.showToast('请输入党费额度')
    } if(count && count.trim() == '0') {
      this.showToast('党费额度不能为0')
    } else if(!date) {
      this.showToast('请选择起始时间')
    } else {
      this.setData({
        showLayer: true
      })
    }
  },
  cancel() {
    this.setData({
      showLayer: false
    })
    this.flag = false
  },
  confirm() {
    if(this.flag) return
    this.flag = true
    const {count, date } = this.data
    setinitialize({
      openid: this.data.info.openid,
      dueslevel: parseFloat(count),
      duesbegin: date+'-01'
    }).then(res => {
      console.log(res)
      if(res.data.result === "success") {
        this.setData({
          storage: Object.assign({}, this.data.storage, {dueslevel: parseFloat(count)})
        })
        wx.setStorageSync('userinfo', JSON.stringify(this.data.storage))
        app.globalData.shouldUploadList = true
        wx.showToast({
          title: '额度添加成功',
          icon: 'success',
          mask: true,
          duration: 1500
        })
        this.flag = false
        setTimeout(() => {
          wx.navigateBack()
        }, 1500);
        this.flag = false
      } else {
        this.flag = false
      }
      this.setData({
        showLayer: false
      })
    })
  }
})