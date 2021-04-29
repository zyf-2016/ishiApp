const { request } = require("./request.js")

// 获取openid
const getOpenId = (data) => request('/user/getopenid', data)
// 保存用户信息
const login = (data) => request('/user/login', data)
// 完善个人信息
const saveUserInfo = (data) => request('/user/pushuserinfo', data)
// 获取用户信息
const getuserinfo = (data) => request('/user/getuserinfo', data)
// 获取成员列表
const getmemberlist = (data) => request('/member/getmemberlist', data)
// 审核成员
const setaudit = (data) => request('/member/setaudit', data)
// 获取手机号
const getmoblie = (data) => request('/user/decrypt', data)
// 获取图片视频列表
const getmedialist = (data) => request('/media/getmedialist', data)
// 绑定用户到图片视频
const pushmedia = (data) => request('/media/pushmedia', data)
// 创建活动
const newactivity = (data) => request('/activity/newactivity', data)
// 获取活动列表
const getactivitylist = (data) => request('/activity/getactivitylist', data)
// 获取未签到活动列表
const getunsignlist = (data) => request('/activity/getunsignlist', data)
// 设置成员签到状态
const setsign = (data) => request('/activity/setsign', data)
// 获取已签到活动列表
const getsignedlist = (data) => request('/activity/getsignedlist', data)
// 获取活动详情
const getactivitydetail = (data) => request('/activity/getactivitydetail', data)
// 删除活动
const delactivity = (data) => request('/activity/delactivity', data)
// 获取成员党费列表
const getdueslist = (data) => request('/dues/getdueslist', data)
// 设置党费额度
const setinitialize = (data) => request('/dues/setinitialize', data)
// 新增党费
const newduesrecord = (data) => request('/dues/newduesrecord', data)
// 获取党费历史记录
const getduesrecord = (data) => request('/dues/getduesrecord', data)
// 获取个人党费详情
const getduesdetail = (data) => request('/dues/getduesdetail', data)
// 获取组织内党费总数据
const getduesinfo = (data) => request('/dues/getduesinfo', data)
// 获取每日答题题目
const getquestion = (data) => request('/exam/getquestion', data)
// 上传答题成绩
const pushexamscore = (data) => request('/exam/pushexamscore', data)
// 获取多人答题游戏状态
const getconteststate = (data) => request('/exam/getconteststate', data)
// 加入多人答题游戏
const pushcontestuser = (data) => request('/exam/pushcontestuser', data)
// 获取当前游戏玩家列表
const getuserlist = (data) => request('/exam/getuserlist', data)
// 上传实时成绩
const pushcontestscore = (data) => request('/exam/pushcontestscore', data)
// 获取个人实时排名
const getranking = (data) => request('/exam/getranking', data)
// 获取成绩总排名
const getscorerank = (data) => request('/exam/getscorerank', data)
// 查询委员列表
const getLeaderList = (data) => request('/member/getcommittee', data)
// 新增修改委员
const addLeaderList = (data) => request('/member/setcommittee', data)
// 删除委员
const delLeaderList = (data) => request('/member/delcommittee', data)

module.exports = {
	getOpenId,
	login,
	saveUserInfo,
	getuserinfo,
	getmemberlist,
	setaudit,
	getmoblie,
	getmedialist,
	pushmedia,
	newactivity,
	getactivitylist,
	getunsignlist,
	setsign,
	getsignedlist,
	getactivitydetail,
	delactivity,
	getdueslist,
	setinitialize,
	newduesrecord,
	getduesrecord,
	getduesdetail,
	getduesinfo,
	getquestion,
	pushexamscore,
	getconteststate,
	pushcontestuser,
	getuserlist,
	pushcontestscore,
	getranking,
	getscorerank,
	getLeaderList,
	addLeaderList,
	delLeaderList
}