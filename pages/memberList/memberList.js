const app = getApp()
const { getmemberlist } = require('../../static/js/api.js')
import pinyin from "wl-pinyin"

Page({
  data: {
    memberCount: 0,
    job: '',
    name: '',
    list: [],
    employeeNameList: null,
    templist: null,
    AlphabetList : ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
  },
  onLoad: function (options) {
    if(options.job) {
      this.setData({
        job: options.job
      })
    }
    this.initList()
  },
  goback() {
    wx.navigateBack()
  },
  search(e) {
    const val = e.detail.value
    let count = 0
    const obj = {}
    Object.keys(this.data.templist).map(item => {
      obj[item] = this.data.templist[item].filter(_item => {
        return _item.name && _item.name.includes(e.detail.value)
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
  initList() {
    getmemberlist({
      audit: 1
    }).then(res => {
      if(res.errMsg === 'request:ok') {
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
                  openid: el.openid,
                  keyid: el.keyid
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
      }
    })
  },
  handleClick(e) {
    wx.setStorageSync('member_name', e.currentTarget.dataset.name)
    wx.setStorageSync('member_openid', e.currentTarget.dataset.openid)
    wx.setStorageSync('member_keyid', e.currentTarget.dataset.keyid)
    wx.navigateBack({
      url: `/pages/leader/leader`
    })
  }
})