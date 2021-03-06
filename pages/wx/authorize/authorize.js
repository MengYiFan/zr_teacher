// pages/wx/userinfo/userinfo.js
import { userLogin } from '../../../utils/api'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  interval: null,
  redirectUrl: '',
  tryAgain: true,
  getUserInfo(cb) {
    // 调用登录接口
    wx.login({
      success: function (res) {
        console.log(res)
        app.globalData.code = res.code || null
        if (wx.getStorageSync('userInfo')) {
          app.globalData.userInfo = wx.getStorageSync('userInfo')
          typeof cb == "function" && cb()
        } else {
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              typeof cb == "function" && cb()
            },
            // 如果用户拒绝授权
            fail: function (res) {
              this.getUserInfoHandle()
            }
          })
        }
      }
    })
  },
  // 获得当前的位置信息
  getUserLocation(cb) {
    let that = this
    // if (app.globalData.userId) {
    //   return
    // }
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude,
          longitude = res.longitude,
          userInfo = app.globalData.userInfo

        app.globalData.location = {
          latitude, longitude
        }

        userLogin({
          authorization: true,
          data: {
            thirdPartyKey: app.globalData.code,
            longitude, latitude,
            userType: 2,
            userNickname: userInfo.nickName,
            userPortraitUrl: userInfo.avatarUrl,
            userMobile: ''
          },
          success: res => {
            if (res.code == '1000') {
              let data = res.data
              app.globalData.userId = data.userId
              app.globalData.userData = data

              let userAttribute = data.userAttribute
              wx.setStorageSync('userId', data.userId)
              wx.setStorageSync('userData', data)
              wx.setStorageSync('userAttribute', userAttribute)
              app.globalData.userAttribute = userAttribute

              if (!userAttribute.userMobile && !wx.getStorageSync('teacherMobile')) {
                wx.reLaunch({
                  url: '/pages/binding/protocol/protocol'
                })
              } else {
                wx.setStorageSync('userMobile', data.userMobile
                  || userAttribute && userAttribute.userMobile)
                wx.setStorageSync('teacherMobile', userAttribute.userMobile)
                wx.reLaunch({
                  url: '../../../' + that.redirectUrl
                })
              }
              // clearTimeout(this.timeout)
            }
          }
        })
      },
      fail(e) {
        if (that.tryAgain) {
          that.tryAgain = false
          setTimeout(() => that.getUserLocation(cb), 3000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.redirectUrl = options.redirect
    if (!this.redirectUrl || this.redirectUrl == 'pages/wx/authorize/authorize') {
      this.redirectUrl = 'pages/index/index/index'
    }
  },
  getUserInfoHandle() {
    var that = this
    // this.getUserInfo(this.getUserLocation)
    this.timeout =  setTimeout(() => {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            that.getUserInfo(that.getUserLocation)
          } else {
            that.getUserInfoHandle()
          }
        }
      })
    }, 1500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})