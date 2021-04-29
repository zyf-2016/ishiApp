// pages/payment/payment.js
const app = getApp()
const { getdueslist, getduesinfo } = require('../../static/js/api.js')
Page({
  data: {
    currentIndex: 0,
    list: [],
    info: {},
    tabs: ['全部', '已欠费', '已缴纳', '未指定']
  },
  onLoad() {
    const that = this
    this.screenWidth = wx.getSystemInfoSync().screenWidth
    wx.createSelectorQuery().select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log('画布信息：',res)
        if(!res[0]) return
        const canvas = res[0].node
        that.ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        that.ctx.scale(dpr, dpr)

        that.grd = that.ctx.createLinearGradient(that.screenWidth/2-125, 220*(that.screenWidth/375), that.screenWidth/2+125, 220*(that.screenWidth/375))
        that.grd.addColorStop(0, '#ed1c24')
        that.grd.addColorStop(1, '#fbbb0e')
        that.ctx.lineCap = 'round'
      })
    this.initrate = 0
    this.init()
  },
  onShow() {
    if(app.globalData.shouldUploadList) {
      app.globalData.shouldUploadList = false
      this.init()
    }
  },
  goback() {
    wx.navigateBack()
  },
  init() {
    getdueslist().then(res => {
      if(res.data && res.data.length) {
        const list0 = [], list1 = [], list2 = [], list3 = []
        res.data.map(item => {
          list0.push(item)
          if(item.state === '已欠费') {
            list1.push(item)
          } else if(item.state === '已缴纳') {
            list2.push(item)
          } else if(item.state === '未指定') {
            list3.push(item)
          }
        })
        this.setData({
          list: [list0, list1, list2, list3]
        })
      }
    })

    getduesinfo().then(res => {
      this.setData({
        info: res.data
      })
      this.draw()
    })

  },
  draw() {
    if(!this.ctx) {
      setTimeout(() => {
        this.draw()
      }, 300);
      return
    }
    const rate = this.data.info.rate
      this.ctx.beginPath()
      this.ctx.lineWidth = 10
      this.ctx.strokeStyle = '#a42327'
      this.ctx.arc(this.screenWidth/2, 220*(this.screenWidth/375), 125, -Math.PI, 0)
      this.ctx.stroke()
      this.ctx.closePath()
      
      this.ctx.beginPath()
      this.ctx.lineWidth = 14
      this.ctx.strokeStyle = this.grd
      this.ctx.arc(this.screenWidth/2, 220*(this.screenWidth/375), 125, -Math.PI, -(1-this.initrate/100)*Math.PI)
      this.ctx.stroke()
      this.ctx.closePath()

      this.timer = setTimeout(() => {
        if(this.initrate < rate) {
          this.ctx.clearRect(0,0,600,600)
          this.initrate += 0.4
          this.draw()
        } else {
          this.initrate = rate
          clearTimeout(this.timer)
          this.timer = null
        }
      }, 25)
  },
  tabChange(e) {
    const index = e.currentTarget.dataset.index
    if(this.data.currentIndex === index) return
    this.setData({
      currentIndex: index
    })
  },
  goToDetail(e) {
    const params = e.currentTarget.dataset.params
    wx.setStorageSync('userinfo', JSON.stringify(params))
    if(params.state === '已欠费') {
      wx.navigateTo({
        url: `/pages/addPayment/addPayment`
      })
    } else {
      wx.navigateTo({
        url: `/pages/setPayment/setPayment`
      })
    }
  }
})