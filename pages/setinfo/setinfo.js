const app  = getApp()
const { saveUserInfo } = require('../../static/js/api.js')

Page({
    data: {
        avatarurl: '',
        name: null,
        idnumber: null,
        joinpartytime: null,
        education: null,
        jobtitle: null,
        resume: null,
        buttonText: '提交'
    },
    onLoad() {
        console.log(app.globalData.userInfo)
        const {avatarurl, name, idnumber, joinpartytime, education, jobtitle, resume} = app.globalData.userInfo
        
        if(app.globalData.userInfo.audit == 1) { // 已通过审核
            this.setData({
                buttonText: '保存'
            })
        }

        this.setData({
            avatarurl: avatarurl || '',
            name: name || null,
            idnumber: idnumber || null,
            joinpartytime: joinpartytime || null,
            education: education || null,
            jobtitle: jobtitle || null,
            resume: resume || null,
            height: `calc(100vh - ${app.globalData.navbarHeight}px)`
        })
    },
    goback() {
        wx.navigateBack()
    },
    onChange(e) {
        console.log(e)
        this.setData({
            [e.target.dataset.type]: e.detail.value
        })
    },
    showToast(title) {
        wx.showToast({
            title,
            icon: 'none'
        })
    },
    submit() {
        const { name,idnumber,joinpartytime,education,jobtitle,resume } = this.data
        if(!name || !name.trim().length) {
            this.showToast('请输入姓名')
        } else if(name.trim().length < 2) {
            this.showToast('姓名最少两个字符')
        } else if(!/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(name)) {
            this.showToast('姓名只能输入中文')
        } else if(!idnumber || !idnumber.trim().length) {
            this.showToast('请输入身份证号')
        } else if(!/^(\d{18,18}|\d{15,15}|\d{17,17}X)$/.test(idnumber)) {
            this.showToast('身份证号格式错误')
        } else if(!joinpartytime || !joinpartytime.trim().length) {
            this.showToast('请选择入党时间')
        } else {
            saveUserInfo({
                openid: app.globalData.userInfo.openid,
                name,
                idnumber,
                joinpartytime,
                education,
                jobtitle,
                resume
            }).then(res => {
                if(res.data.result === 'success') {
                    app.globalData.userInfo.name = name || null
                    app.globalData.userInfo.idnumber = idnumber || null
                    app.globalData.userInfo.joinpartytime = joinpartytime || null
                    app.globalData.userInfo.education = education || null
                    app.globalData.userInfo.jobtitle = jobtitle || null
                    app.globalData.userInfo.resume = resume || null
                    wx.showToast({
                        title: this.data.buttonText == '保存' ? '保存成功' : '提交成功', 
                        icon: 'success',
                        mask: true,
                        duration: 1500
                    })
                    setTimeout(() => {
                        wx.navigateBack()
                    }, 1500)
                }
            })
        }
    }
})