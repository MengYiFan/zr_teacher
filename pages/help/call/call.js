// pages/help/call/call.js
import { teacherHelpLink, hangupHelpCall, polling, enterRtcroom, heartbeat, getPusher, teacherHelpLinkFail, teacherSignin, assignLink, hangupApply } from '../../../utils/api'
import { init, sendRoomTextMsg } from '../../../utils/wx/rtcroom'

var app = getApp()
var intervalId = null
var MAX_TRY_LOGIN_IM = 3

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraContext: null,
    teachPusher: null,
    userLive: null,
    controler: {
      muted: false,
      enableCamera: true,
      backgroundMute: true,
      orientation: "vertical",
      beauty: 6.3,
      whiteness: 3.0,
      debug: false,
      minBitrate: 200,
      maxBitrate: 400,
      aspect: '3:4'
    },
    //
    playerConf: {
      orientation: 'vertical',
      objectFit: "fillCrop",
      muted: false,
      backgroundMuted: true,
      debug: false,
      fullScreen: false,
    },
    isShowForm: false,
    connectionFlag: false,
    seconds: 0,
    subjectIds: null,
    canHangupFlag: false,
    intervalId: null,
    roomId: null,
    caseId: null,
    nick: '',
    avatar: '',
    options: {},
    idHangupFlag: false
  },
  callIsLinking: false,
  USER_DATA: {},
  TIME: 20,
  CYCLE: 5,
  isFree: 1,
  userAttribute: {},
  continueHeartBeat: true,
  isIMLoginFailFlag: false,
  isHangupFlag: false,
  roomId: null,
  teacherUserId: null,
  startTime: 0,
  options: null,
  userLive: '',
  teachPusher: '',
  // V3
  getPusherHandle() {
    getPusher({
      method: 'get',
      success: res => {
        console.info('getPusherHandle:', res)
        if (res.code == '1000') {
          this.setData({
            teachPusher: res.msg
          })
          console.warn('teachPusher', res.msg)
          setTimeout(() => this.data.cameraContext.start(), 0)
          this.callIsLinking = true
          if (this.options.type == 'all') {
            this.teacherHelpLinkHandle()
          } else {
            this.assignLinkHandle()
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '服务器忙, 清稍后再试..'
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
      }
    }, wx.getStorageSync('userId'))
  },
  // 挂断
  bindCallHangupTap(e, caseId, type) {
    if (this.isHangupFlag) {
      return
    }
    this.isHangupFlag = true

    if (type != 'initiative' || !type) {// 主动发起
      let data = this.data,
        seconds = this.startTime ? (+new Date() - this.startTime) / 1000 : 0,
        reqData = {
          userId: app.globalData.userId || wx.getStorageSync('userId'),
          caseId: this.caseId || data.caseId || caseId,
          hangupType: 2,
          roomId: this.roomId || this.data.roomId,
          teacherUserId: this.teacherUserId || this.data.teacherUserId,
          seconds: parseInt(seconds),
          isFree: this.isFree || 1
        }

      hangupApply({
        data: reqData,
        complete: () => {
          setTimeout(function () {
            wx.hideLoading()
            this.isHangupFlag = true
            wx.reLaunch({
              url: '../../../pages/index/index/index'
            })
          }, 2000)
        },
        success: res => {
          if (res.code == '1000') {

          } else {
            wx.showToast({
              icon: 'none',
              title: '退出房间..'
            })
          }
        }
      })
      return
    }

    // 被动挂断
    let data = this.data,
      seconds = this.startTime ? (+new Date() - this.startTime) / 1000 : 0,
      reqData = {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        caseId: this.caseId || data.caseId || caseId,
        hangupType: 2,
        teacherUserId: this.teacherUserId || this.data.teacherUserId,
        seconds: parseInt(seconds),
        isFree: this.isFree || 1
      }
    console.info('bindCallHangupTap reqData:', reqData)
    hangupHelpCall({
      data: reqData,
      success: (res) => {
        console.info(res)
      },
      complete() {
        this.isHangupFlag = true
        if (!this.isIMLoginFailFlag) {
          wx.reLaunch({
            url: '../../../pages/index/index/index'
          })
        }
      }
    })
  },
  // 进入房间
  enterRoom() {
    enterRtcroom({
      method: 'get',
      success: res => {
        console.info('enterRtcroom success:', res)
        let pushUri = '', liveUri = '', responseData = res.data
        if (responseData[0].userId == this.options.userId) {
          this.setData({
            canHangupFlag: true,
            userLive: res.data[0].accelerateURL,
            teachPusher: res.data[1].pushURL
          })
        } else {
          this.setData({
            canHangupFlag: true,
            userLive: res.data[1].accelerateURL,
            teachPusher: res.data[0].pushURL
          })
        }
        console.info('teachPusher!!!', this.data.teachPusher, '@userLive@', this.data.userLive)
        this.heartbeat()
      }
    }, this.roomId)
  },
  // 心跳函数
  heartbeat() {
    heartbeat({
      method: 'get',
      closeLoading: 'hidden',
      success: res => {
        if (res.code == '1000') {
          if (this.continueHeartBeat) {
            setTimeout(() => {
              this.heartbeat()
            }, 1000 * this.CYCLE)
          }
        } else {
          this.setData({
            teachPusher: null,
            userLive: null,
            canHangupFlag: false
          })
        }
      }
    }, this.roomId, this.options.userId)
  },
  // 静音
  bindCellMutedTap(e) {
    this.setData({
      ['controler.muted']: !this.data.controler.muted
    })
  },
  // 状态码
  playerStatechange(e) {
    if (!this.userLive) {
      this.userLive = this.data.userLive
    }
    try {
      console.info('live-player code:', e.detail.code)
      console.info('userLive:', this.userLive)
      // let stateCode = e.detail.code
      // if (stateCode == -2301 || stateCode == -2302) {
      //   console.warn('尝试连接live')
      //   this.setData({
      //     userLive: ''
      //   })
      //   setTimeout(() => {
      //     this.setData({
      //       userLive: this.userLive
      //     })
      //   }, 2000)
      // }
    } catch (error) {
      console.error('playerStatechange error', error)
    }
  },
  playerError(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  pusherStatechange(e) {
    if (!this.teachPusher) {
      this.teachPusher = this.data.teachPusher
    }
    console.info('live-pusher code:', e.detail && e.detail.code || 'null')
    console.info('teachPusher:', this.teachPusher)
    try {
      // if (e.detail.code == -1307) {
      //   console.warn('尝试连接pusher', e.detail.code)  
      //   this.setData({
      //     teachPusher: ''
      //   })
      //   setTimeout(() => {
      //     this.setData({
      //       teachPusher: this.teachPusher
      //     })
      //   }, 2000)
      // }
    } catch (error) {
      console.error('pusherStatechange: ', error)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否是付费类型的
    this.userAttribute = wx.getStorageInfoSync('userAttribute') || {}
    let teacherTypeCode = this.userAttribute && this.userAttribute.teacherTypeCode || 'N'
    this.isFree = teacherTypeCode == 'N' ? 1 : 2

    console.warn('options', options)
    this.setData({
      options: options,
      nick: options.nick,
      avatar: options.avatar
    })

    this.options = options
    this.roomId = options.roomId
    this.caseId = options.caseId

    if (options.type == 'one') {
      this.setData({
        userLive: options.userPlayer
      })
      console.warn('userLive', options.userPlayer)
    }
    console.info('options: ', options, this.roomId)

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3c3c3c',
      animation: {
        duration: 800,
        timingFunc: 'linear'
      }
    })
  },
  assignLinkHandle() {
    let that = this
    assignLink({
      data: {
        "caseId": this.options.caseId,
        "userId": this.options.userId,
        "teacherUserId": this.teacherUserId || wx.getStorageSync('userId')
      },
      success: res => {
        if (res.code == '1000') {
          that.setData({
            teachPusher: res.data.teacherPusher
          })
        }
      }
    })
  },
  teacherHelpLinkHandle() {
    let options = this.options,
      that = this
    console.warn('teacherHelpLinkHandle options@@@', options)
    teacherHelpLink({
      data: Object.assign(options, {
        pushUrl: this.data.teachPusher
      }),
      success: res => {
        console.warn('teacherHelpLinkHandle res: ', res)
        if (res.code == '1000') {
          this.setData({
            userLive: res.data.userAccelerateUrl
          })
          console.warn('userLive', res.data.userAccelerateUrl)
          wx.vibrateLong()
          this.heartbeat()
          this.setData({
            connectionFlag: true
          })
          this.startTime = +(new Date())
          // this.enterRoom()
          // var data = res.data,
          //     reg = new RegExp('http:\/\/.+\.flv', 'gi'),
          //     reg2 = new RegExp('http:\/\/.+\.flv', 'gi')


          // let fa = data.teachPusher.replace(/[\'\"]/g, '').split('|')[0].trim(),
          //     shou = data.userLive.replace(/[\'\"]/g, '').split('|')[1].split(',')[0].slice(6).replace('}', '').trim()
          // console.info('userLive播放地址: ', fa, ';;@@@teachPusher播放地址: ', shou)
          // this.setData({
          //   subjectIds: data.caseId || 0,
          //   canHangupFlag: true,
          //   teachPusher: fa, 
          //   userLive: shou
          // })
          // this.setData({
          //   teachPusher: reg.exec(data.teachPusher)[0],
          //   userLive: reg2.exec(data.userLive)[0]
          // })
          // console.log(reg.exec(data.teachPusher)[0])
          // console.log(reg2.exec(data.userLive)[0])
        } else {
          if (this.callIsLinking) {
            return
          }
          if (res.code == '1200' && res.msg == '0') {
            console.log('被抢了')
            teacherHelpLinkFail({
              method: 'get',
              success: res => {
                if (res.code == '1000') {
                  that.setData({
                    isShowForm: true
                  })
                }
              }
            }, wx.getStorageSync('userId'))
          }
        }
      }
    })
  },
  // 提交上线
  bindFormSubmit(e) {
    console.warn('bindFormSubmit', e.detail)
    if (this.data.isShowForm) {
      teacherSignin({
        data: {
          userId: app.globalData.userId || wx.getStorageSync('userId'),
          formId: e.detail.formId
        },
        success: res => {
          this.setData({
            isShowForm: false
          })
          wx.reLaunch({
            url: '../../../pages/index/index/index'
          })
        }
      })
    }
  },
  loginIM(data, failFn) {
    let that = this
    init({
      data: data,
      success: res => {
        this.getPusherHandle()
      },
      fail: failFn,
      cb255: msg => {
        console.warn('我收到信息啦::', msg)

        let msgArr = msg.split('||')

        if (msgArr[0] == '01') {
          this.roomId = msgArr[1]
          this.teacherUserId = msgArr[2]
          this.setData({
            roomId: msgArr[1]
          })
        }
        if (msgArr[0] == '02') {
          this.roomId = msgArr[1]
          this.caseId = msgArr[2]
          this.bindCallHangupTap(null, this.caseId, 'passivity')
        }

        // let msgArr = msg.split('||'),
        //   index = msgArr.length - 1

        // this.setData({
        //   userLive: msgArr[index]
        // })
        // console.warn('地址信息', this.data)
      }
    })
  },
  loginIMFailCb() {
    if (MAX_TRY_LOGIN_IM) {
      this.loginIM(this.USER_DATA.imInfo, this.loginIMFailCb)
      MAX_TRY_LOGIN_IM--
    } else {
      console.error('IM 尝试登录三次均失败')
      this.isIMLoginFailFlag = true
      wx.showToast({
        title: '需要先授权基本权限才能操作,...',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.redirectTo({
          url: `../../../pages/wx/authorize/authorize`,
        })
      }, 1000)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      cameraContext: wx.createLivePusherContext('camera-push')
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.USER_DATA = wx.getStorageSync('userData') || {}
    this.TIME = (this.USER_DATA.imInfo && this.USER_DATA.imInfo.time) || 20
    this.CYCLE = (this.USER_DATA.imInfo && this.USER_DATA.imInfo.cycle) || 5

    this.loginIM(this.USER_DATA.imInfo || {}, this.loginIMFailCb)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!this.isHangupFlag) {
      this.bindCallHangupTap(null, null, 'initiative')
    }
    this.continueHeartBeat = false
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})