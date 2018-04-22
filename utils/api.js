'use strict';

import * as C from 'constants'

// 请求数据
// @params { method, data, success, fail, complete }
const wxRequest = (params, url) => {
  if (params.showToast) {
    wx.showToast({
      mask: true,
      title: '加载中...',
      icon: 'loading'
    })
  }

  if (!wx.getStorageSync('userId') && !params.authorization) {
    return
  } else {
    // params.data.userId = params.data.userId || wx.getStorageSync('userId')
  }


  wx.showNavigationBarLoading()

  if (!params.showLoading) {
    wx.showLoading({
      title: '加载中...',
    })
  }

  wx.request({
    url: url,
    method: params.method || 'POST',
    data: params.data || {},
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      params.success && params.success(res.data)
      if (params.showToast) {
        wx.hideToast()
      }
      wx.hideNavigationBarLoading()
      console.log('URL: ', url)
      console.log('参数:', params.data)
      console.log('结果:', res.data)
    },
    fail: (res) => {
      console.log(res)
      params.fail && params.fail(res)
    },
    complete: (res) => {
      if (!params.showLoading) {
        wx.hideLoading()
      }
      params.complete && params.complete(res.data)
    }
  })
}

// 转url query传值
export let _obj2uri = (obj) => {
  return Object.keys(obj).map((i) => {
    return encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
  }).join('&');
}

// 登录/打开小程序
export const userLogin = (params) => wxRequest(params, C.USER_LOGON)

// 绑定用户信息
export const bindUser = (params) => wxRequest(params, C.BIND_USER)

export const updateUser = (params) => wxRequest(params, C.UPDATE_USER)

// 用户订单列表
export const getCaseList = (params) => wxRequest(params, C.CASE_LIST)

// 家长我的课程列表
export const getCourseList = (params) => wxRequest(params, C.COURSE_LIST)
// 老师专栏订阅
export const getTeacherColumnSubscribe = (params) => wxRequest(params, C.TEACHER_COLUMN_SUBSCRIBE)

// 老师专栏文章列表
export const getTeacherContentList = (params) => wxRequest(params, C.TEACHER_CONTENT_LIST)

// 老师课程列表 
export const getTeacherCourseList = (params) => wxRequest(params, C.MY_COURSE_LIST)

export const assignLink = (params) => wxRequest(params, C.ASSIGN_LINK)

// 是否在线
export const teacherIsOnline = (params) => wxRequest(params, C.IS_ONLINE)
export const teacherSignin = (params) => wxRequest(params, C.TEACHER_SIGNIN)

// 老师连上
export const teacherHelpLink = (params) => wxRequest(params, C.HELP_LINK)
// 挂断call
export const hangupHelpCall = (params) => wxRequest(params, C.HELP_CALL_HANGUP)
// 抢失败
export const teacherHelpLinkFail = (params, teacherUserId) => wxRequest(params, C.HELP_LINK + '/' + teacherUserId)

// 问题分类
export const getCategoryQus = (params) => wxRequest(params, C.CATEGORY_QUS)

// 用户关注问题领域（包括家长和育商师）
export const getSubjectList = (params) => wxRequest(params, C.SUBJECT_LIST)
// 更新用户关注问题领域（包括家长和育商师）-增加关注
export const updateSubject = (params) => wxRequest(params, C.UPDATE_SUBJECT)

// 验证码
export const phoneValidationCode = (params) => wxRequest(params, C.PHONE_VALIDATION_CODE)

export const getImInfo = (params, id) => wxRequest(params, C.GET_IM + '/' + id)
export const polling = (params, caseId, userId) => wxRequest(params, C.POLLING_URI + '/' + caseId + '/' + userId)
export const enterRoom = (params, rootId, userId) => wxRequest(params, C.ENTER_ROOM + '/' + rootId + '/' + userId)
export const enterRtcroom = (params, rootId) => wxRequest(params, C.ENTER_RTCROOM + '/' + rootId + '/pushers')
export const exitRtcroom = (params, rootId, userId) => wxRequest(params, C.ENTER_RTCROOM + '/' + rootId + '/' + userId)
export const heartbeat = (params, rootId, userId) => wxRequest(params, C.HEARTBEAT + '/' + rootId + '/' + userId)

//
//
export const getPusher = (params, userId) => wxRequest(params, C.GET_PUSHER + '/' + userId)


export const hangupApply = (params, userId) => wxRequest(params, C.HANGUP_APPLY)
