const app = getApp()
const { getconteststate, pushcontestuser, getOpenId, getuserinfo, getquestion, getuserlist, pushcontestscore, getranking, pushexamscore, getscorerank } = require('../../static/js/api.js')

Page({
  data: {
    time: 10,
    state: 1,
    score: 0,
    rankNo: 0,
    currentIndex: 0,
    countDownTime: 10,
    selectedIndex: -1,
    username: '',
    avatar: '',
    msg: '',
    gameStart: false,
    showLayer: false,
    isRight: false,
    isError: false,
    list: [],
    userList: [],
    rankList: [],
    self: {},
  },
  onLoad() {
    this.rate = wx.getSystemInfoSync().screenWidth / 375
    this.initrate = 0
    if(app.globalData.userInfo.openid) {
      this.init()
    } else {
      wx.login({
        success: (res) => {
          console.log(res.code)
          getOpenId({
            code: res.code
          }).then(data => {
            wx.setStorageSync('token', data.data.token)
            wx.setStorageSync('openid', data.data.openid)
            return getuserinfo({
              openid: data.data.openid
            })
          }).then(resp => {
            app.globalData.userInfo.nickname = resp.data.nickname
            app.globalData.userInfo.moblie = resp.data.moblie
            app.globalData.userInfo.avatarurl = resp.data.avatarurl
            app.globalData.userInfo.education = resp.data.education
            app.globalData.userInfo.gender = resp.data.gender
            app.globalData.userInfo.idnumber = resp.data.idnumber
            app.globalData.userInfo.jobtitle = resp.data.jobtitle
            app.globalData.userInfo.joinpartytime = resp.data.joinpartytime
            app.globalData.userInfo.name = resp.data.name
            app.globalData.userInfo.openid = resp.data.openid
            app.globalData.userInfo.resume = resp.data.resume
            app.globalData.userInfo.role = resp.data.role
            app.globalData.userInfo.audit = resp.data.audit

            if(!app.globalData.userInfo.nickname) {
              wx.setStorageSync('navigateType', 'navigate')
              app.globalData.page = '/pages/scanStudy/scanStudy'
              wx.navigateTo({
                url: '/pages/login/login'
              })
            } else {
              this.setData({
                username: app.globalData.userInfo.nickname,
                avatar:  app.globalData.userInfo.avatarurl
              })
              this.init(true)
            }
          })
        }
      })
    }
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  initCanvas() {
    const that = this
    wx.createSelectorQuery().select('#myCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
      if(!res[0]) return
      const canvas = res[0].node
      that.ctx = canvas.getContext('2d')

      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      that.ctx.scale(dpr, dpr)
    })
  },
  // 获取绑定用户信息
  init(hasUserinfo) {
    if(!hasUserinfo) {
      getuserinfo({
        openid: app.globalData.userInfo.openid
      }).then(resp => {
        app.globalData.userInfo.nickname = resp.data.nickname
        app.globalData.userInfo.moblie = resp.data.moblie
        app.globalData.userInfo.avatarurl = resp.data.avatarurl
        app.globalData.userInfo.education = resp.data.education
        app.globalData.userInfo.gender = resp.data.gender
        app.globalData.userInfo.idnumber = resp.data.idnumber
        app.globalData.userInfo.jobtitle = resp.data.jobtitle
        app.globalData.userInfo.joinpartytime = resp.data.joinpartytime
        app.globalData.userInfo.name = resp.data.name
        app.globalData.userInfo.openid = resp.data.openid
        app.globalData.userInfo.resume = resp.data.resume
        app.globalData.userInfo.role = resp.data.role
        app.globalData.userInfo.audit = resp.data.audit
        this.setData({
          username: app.globalData.userInfo.nickname,
          avatar:  app.globalData.userInfo.avatarurl
        })
      })
    }
    pushcontestuser({
      openid: app.globalData.userInfo.openid
    }).then(res => {
      console.log(res)
      if(res.data.result === 'success') {
        getconteststate().then(data => {
          console.log(data)
          const time = parseInt(data.data.conteststate)
          if(time > 0) { // 游戏加入中
            this.setData({
              time: time
            })
            this.countDown()
          } else if(time < -100) { // 游戏中
            this.setData({
              gameStart: true,
              msg: '答题已经开始喽~'
            })
          } else { // 游戏结束
            this.setData({
              gameStart: true,
              msg: '答题已经结束喽~'
            })
          }
        })
      } else {
        this.setData({
          gameStart: true,
          msg: '通过组织审核后才能参与答题哦~'
        })
      }
    })
  },
  // 进入游戏倒计时
  countDown() {
    setTimeout(() => {
      this.setData({
        time: --this.data.time
      })
      getuserlist().then(res => {
        console.log(res)
        this.setData({
          userList: res.data
        })
      })
      if(this.data.time < 1) {
        this.initGame()
      } else {
        this.countDown()
      }
    }, 1000);
  },
  // 开始游戏
  initGame() {
    getquestion({
      openid: app.globalData.userInfo.openid,
      topic: null,
      tag: null
    }).then(res => {
      console.log(res)
      if(res.data.length) {
        res.data.map(item => {
          const list = ['a','b','c','d']
          item.answerList = [item.answera, item.answerb, item.answerc, item.answerd]
          item.answer = list.indexOf(item.rightanswer)
        })
      }
      this.setData({
        list: res.data,
        state: 2
      })
      this.initCanvas()
      this.draw()
      this.beginCountDown()
    })
  },
  onChange() {
    
  },
  // 每题倒计时
  beginCountDown() {
    setTimeout(() => {
      if(this.data.countDownTime > 0) {
        this.setData({
          countDownTime: this.data.countDownTime - 1
        })
        if(this.data.countDownTime % 3 === 0) {
          getranking({
            openid: app.globalData.userInfo.openid
          }).then(res => {
            console.log('实时成绩',res)
            this.setData({
              rankNo: res.data.rankno
            })
          })
        }
        this.beginCountDown()
      } else {
        if(this.data.currentIndex < this.data.list.length) {
          if(!this.data.list[this.data.currentIndex].state) {
            this.data.list[this.data.currentIndex].state = 'error'
            pushcontestscore({
              openid: app.globalData.userInfo.openid,
              score: this.data.score
            })
          }
          this.next()
        }
      }
    }, 1000);
  },
  // 下一题
  next() {
    if(this.data.currentIndex == 9) {
      this.setData({
        state: 3
      })
      const list1 = [], list2 = []
      this.data.list.map(item => {
        if(item.state == 'right') {
          list1.push(item.quesid)
        } else {
          list2.push(item.quesid)
        }
      })
      // 上传成绩
      pushexamscore({
        openid: app.globalData.userInfo.openid,
        type: 2,
        score: this.data.score,
        rights: list1.join(),
        wrongs: list2.join()
      }).then(res => {
        // 获取总排名
        this.getRankList()
      })
      return
    }
    this.setData({
      countDownTime: 10,
      currentIndex: this.data.currentIndex+1,
      isRight: false,
      isError: false,
      selectedIndex: -1
    })
    this.draw()
    this.beginCountDown()
  },
  getRankList() {
    getscorerank({
      openid: app.globalData.userInfo.openid
    }).then(res => {
      console.log('排名信息',res)
      if(res.data.length) {
        this.setData({
          self: res.data[res.data.length-1],
          showLayer: true
        })
        if(res.data.length < 4) {
          let list = [...res.data]
          list.splice(res.data.length-1, 1)
          this.setData({
            rankList: list
          })
        } else {
          this.setData({
            rankList: res.data
          })
        }
        setTimeout(() => {
          this.setData({
            showLayer: false
          })
        }, 2000);
      }
    })
  },
  catchTouchMove() {
    return false
  },
  // 选择答案
  handleSelect(e) {
    if(this.data.isRight || this.data.isError) return
    const { index, answer } = e.currentTarget.dataset
    console.log(index, answer)
    const list = ['A','B','C','D']
    // const selectedAnswer = list[index]
    // const rightAnswer = list[answer]
    if(index == answer) {
      console.log('right')
      this.data.list[index].state = 'right'
      this.setData({
        isRight: true,
        selectedIndex: index,
        score: this.data.score + 10
      })
      pushcontestscore({
        openid: app.globalData.userInfo.openid,
        score: this.data.score
      })
      getranking({
        openid: app.globalData.userInfo.openid
      }).then(res => {
        this.setData({
          rankNo: res.data.rankno
        })
      })
    } else {
      console.log('err')
      this.data.list[index].state = 'error'
      this.setData({
        isError: true,
        selectedIndex: index
      })
      pushcontestscore({
        openid: app.globalData.userInfo.openid,
        score: this.data.score
      })
    }
  },
  draw() {
    if(!this.ctx) {
      setTimeout(() => {
        this.draw()
      }, 300);
    }
      if(!this.ctx) {
        return
      }
      
      this.ctx.beginPath()
      this.ctx.lineWidth = 4
      this.ctx.strokeStyle = '#39b54a'
      this.ctx.arc(25, 25, 22, -0.5*Math.PI, -0.5*Math.PI+2*this.initrate*Math.PI)
      this.ctx.stroke()
      this.ctx.closePath()

      this.timer = setTimeout(() => {
        this.ctx.clearRect(0,0,50, 50)
        if(this.initrate < 1) {
          this.initrate += 0.0025
          this.draw()
        } else {
          this.initrate = 0
          if(this.data.currentIndex >9) {
            clearTimeout(this.timer)
            this.timer = null
          }
        }
      }, 25)
  },
  onShareAppMessage: function () {

  }
})