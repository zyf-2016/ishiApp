const app = getApp()
const { getmemberlist, getLeaderList } = require('../../static/js/api.js')
import pinyin from "wl-pinyin"

Page({
  data: {
    currentIndex: 0,
    memberCount: 0,
    count: 0,
    list: [],
    employeeNameList: null,
    templist: null,
    leaderList: [],
    AlphabetList : ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  },
  onLoad: function (options) {
    this.initList()
    this.getLeaderList()
  },
  onShow() {
    if(app.globalData.shouldUploadList) {
      app.globalData.shouldUploadList = false
      this.initList()
    }
    if(wx.getStorageSync('member_update')) {
      this.getLeaderList()
      wx.removeStorageSync('member_update')
    }
  },
  goback() {
    wx.navigateBack()
  },
  goToUpdate(e) {
    console.log(e)
    const { name, job, keyid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/leader/leader?name=${name}&job=${job}&keyid=${keyid}`,
    })
  },
  getLeaderList() {
    getLeaderList({
      appid: app.globalData.appid
    }).then(res => {
      console.log(res)
      this.setData({
        leaderList: res.data
      })
    })
  },
  search(e) {
    const val = e.detail.value
    let count = 0
    const obj = {}
    Object.keys(this.data.templist).map(item => {
      obj[item] = this.data.templist[item].filter(_item => {
        return _item.name && _item.name.includes(val)
      })
    })
    Object.keys(obj).map(item => {
      obj[item].map(item => {
        if(item) {
          count ++
        }
      })
    })
    this.setData({
      employeeNameList: obj,
      memberCount: count
    })
  },
  initList(search) {
    getmemberlist({
      audit: search === true ? 0 : (this.data.currentIndex == 0 ? 1 : 0)
    }).then(res => {
      if(res.errMsg === 'request:ok') {
        if(search === true) {
          this.setData({
            count: res.data.length
          })
        } else {
          if(this.data.currentIndex == 0) {
            let obj = {}, count = 0
            this.data.AlphabetList.map((item) => {
              obj[item] = [];
              res.data.map((el) => {
                if(el.name) {
                  let first = pinyin.getFirstLetter(el.name).substring(0, 1);
                  if (first == item) {
                    obj[item].push({
                      name: el.name,
                      avatarurl: el.avatarurl,
                      openid: el.openid
                    })
                  }
                }
              })
            })
            Object.keys(obj).map(item => {
              obj[item].map(item => {
                if(item) {
                  count ++
                }
              })
            })
            this.setData({
              memberCount: count,
              employeeNameList: obj,
              templist: obj
            })
          } else {
            this.setData({
              memberCount: res.data.length,
              count: res.data.length,
              list: res.data
            })
          }
        }
      }
    })
  },
  tabChange(e) {
    if(e.target.dataset.index == this.data.currentIndex) return
    this.setData({
      currentIndex: parseInt(e.target.dataset.index)
    })
    this.initList()
  },
  handleClick(e) {
    wx.navigateTo({
      url: `/pages/audit/audit?openid=${e.currentTarget.dataset.openid}&readonly=true`
    })
  },
  onClick(e) {
    wx.navigateTo({
      url: `/pages/audit/audit?openid=${e.currentTarget.dataset.openid}`
    })
  },
  addLeader() {
    wx.navigateTo({
      url: `/pages/leader/leader`
    })
  }
})