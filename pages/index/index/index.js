//index.js
import { teacherIsOnline, teacherSignin } from '../../../utils/api'

const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    onlineFlag: false
  },
  //事件处理函数
  bindcellTap(e) {
    let to = e.currentTarget.dataset.to || '',
        toType = e.currentTarget.dataset.totype || ''
    to += toType ? '?toType=' + toType : ''

    if (to) {
      wx.navigateTo({
        url: to
      })
    }
  },
  // 上线按钮
  bindFormSubmit(e) {
    if (!this.data.onlineFlag) {
      teacherSignin({
        data: {
          userId: app.globalData.userId || wx.getStorageSync('userId'),
          formId: e.detail.formId
        },
        success: res => {
          this.setData({
            onlineFlag: true
          })
        }
      })
    }
  },
  initUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initUserInfo()

    wx.setNavigationBarTitle({
      title: '育商师',
    })
  },
  onShow: function() {
    teacherIsOnline({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
      },
      success: res => {
        if (res.code == '1000') {
          this.setData({
            onlineFlag: res.data.isOnline
          })
        } else {
          this.setData({
            onlineFlag: false
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {

  },
})
