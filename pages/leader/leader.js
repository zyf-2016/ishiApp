// pages/leader/leader.js
const app = getApp()
const {  addLeaderList, delLeaderList } = require('../../static/js/api.js')
Page({
  data: {
    value: '',
    name: '',
    keyid: '',
    showLayer: false,
    showDelBtn: false,
    jobList: [
      '支部书记',
      '支部副书记',
      '组织委员',
      '宣传委员',
      '保密委员',
      '青年委员',
      '纪检委员'
    ]
  },
  goback() {
    wx.navigateBack()
  },
  onLoad(options) {
    const {name, job, keyid} = options
    if(name) {
      this.setData({
        name
      })
    }
    if(job) {
      this.oldJob = job
      const index = this.data.jobList.findIndex(item => item == job)
      this.setData({
        value: index
      })
    }
    if(keyid) {
      this.setData({
        keyid
      })
    }
    if(name && job && keyid) {
      this.setData({
        showDelBtn: true
      })
    }
  },
  onShow() {
    if(wx.getStorageSync('member_name')) {
      this.setData({
        name: wx.getStorageSync('member_name')
      })
      wx.removeStorageSync('member_name')
    }
    if(wx.getStorageSync('member_keyid')) {
      this.setData({
        keyid: wx.getStorageSync('member_keyid')
      })
      wx.removeStorageSync('member_keyid')
    }
  },
  delete() {
    this.setData({
      showLayer: true
    })
  },
  cancel() {
    this.setData({
      showLayer: false
    })
  },
  confirm() {
    delLeaderList({
      appid: app.globalData.appid,
      committee: this.oldJob
    }).then(res => {
      if(res.data && res.data.result == 'success') {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        this.setData({
          showLayer: false
        })
        wx.setStorageSync('member_update', '1')
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/member/member`,
          })
        }, 1500);
      }
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  goToList() {
    const {value, jobList} = this.data
    wx.navigateTo({
      url: `/pages/memberList/memberList?job=${jobList[value]}`,
    })
  },
  submit() {
    const { jobList, value, name, keyid } = this.data
    if(!jobList[value]) {
      wx.showToast({
        title: '请选择职位',
        icon: 'none'
      })
      return
    } else if(!name) {
      wx.showToast({
        title: '请指定成员',
        icon: 'none'
      })
    } else {
      addLeaderList({
        appid: app.globalData.appid,
        committee: jobList[value],
        keyid: keyid || null
      }).then(res => {
        if(res.data && res.data.result == 'success') {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            wx.setStorageSync('member_update', '1')
            wx.navigateBack()
          }, 1500);
        }
      })
    }
  },
  onShareAppMessage: function () {

  }
})