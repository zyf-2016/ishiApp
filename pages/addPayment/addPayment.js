// pages/addPayment/addPayment.js

const app = getApp()
const { newduesrecord, getduesrecord } = require('../../static/js/api.js')

Page({
  data: {
    height: '',
    currentIndex: 0,
    price: 10.00,
    name: '',
    date: '',
    avatar: '',
    title: '',
    state: '',
    monthList: [1,3,6,12],
    priceList: [],
    historyList: [],
    showLayer: false,
    openid: '',
    isSelf: true
  },
  onLoad(options) {
    if(options.isSelf != 1 && app.globalData.userInfo.role == 1) {
      this.setData({
        isSelf: false
      })
    }
    this.setData({
      height: `calc(460rpx - ${app.globalData.navbarHeight}px)` ,
      scrollHeihgt: `calc(100vh - ${app.globalData.navbarHeight}px)`
    })
  },
  onShow() {
    let userinfo = null
    if(wx.getStorageSync('userinfo')) {
      userinfo = JSON.parse(wx.getStorageSync('userinfo'))
    }
    console.log('add',userinfo)
    let date = ''
    if(userinfo && userinfo.duesend) {
      let arr = userinfo.duesend.replace(/\//g,'-').split('-')
      date = arr[0]+'年'+arr[1]+'月'
    }
    this.setData({
      price: userinfo && userinfo.dueslevel ? userinfo.dueslevel.toFixed(2) : '未指定',
      name: userinfo ? (userinfo.name || app.globalData.userInfo.nickname) : app.globalData.userInfo.nickname,
      avatar: userinfo ? userinfo.avatarurl : '',
      openid: userinfo ? userinfo.openid : '',
      date: date,
      state:  userinfo ?  userinfo.state : ''
    })
    var list = this.data.monthList.map (item => {
      return (item * this.data.price).toFixed(2)
    })
    this.setData({
      priceList: list
    })
    getduesrecord({
      openid: userinfo ? userinfo.openid : ''
    }).then(res => {
      if(res.data && res.data.length) {
        this.setData({
          historyList: res.data
        })
      }
    })
  },
  goback() {
    wx.navigateBack()
  },
  goToSet() {
    wx.navigateTo({
      url: '/pages/setPayment/setPayment'
    })
  },
  onMonthChange(e) {
    const index = e.currentTarget.dataset.index
    if(index === this.data.currentIndex) return
    this.setData({
      currentIndex: index
    })
  },
  add() {
    const { name, monthList, currentIndex } = this.data
    this.setData({
      title: `确定给${name}添加${monthList[currentIndex]}个月党费？`,
      showLayer: true
    })
  },
  cancel() {
    this.setData({
      showLayer: false
    })
  },
  confirm() {
    const { openid, monthList, priceList, currentIndex } = this.data
    newduesrecord({
      openid,
      duescount: monthList[currentIndex],
      duesamount: parseFloat(priceList[currentIndex])
    }).then(res => {
      this.setData({
        showLayer: false
      })
      if(res.data.result === 'success') {
        app.globalData.shouldUploadList = true
        wx.showToast({
          title: '党费添加成功',
          icon: 'success',
          mask: true,
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500);
      } else {
        wx.showToast({
          title: '党费添加失败',
          icon: 'none'
        })
      }
    })
  }
})