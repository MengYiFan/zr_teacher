//app.js
import { userLogin } from './utils/api'
import { obj2uri } from './utils/common'

App({
  onLaunch: function (e) {
    // 当前访问链接保存
    this.globalData.currentUri = e.path + '?' + obj2uri(e.query)
    this.getUserInfo(this.getUserLocation)
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // 获得用户信息
  getUserInfo(cb) {
    var that = this,
        globalData = this.globalData

    if (globalData.userId && globalData.teacherMobile) {
      console.log('globalData')
      typeof cb == "function" && cb(globalData.userInfo)
    } else if ( wx.getStorageSync('userId') && wx.getStorageSync('teacherMobile') ) {
      console.log('Get Storage')
      // 返回缓存内容
      that.globalData.userId = wx.getStorageSync('userId')
      that.globalData.userInfo = wx.getStorageSync('userInfo')
      that.globalData.teacherMobile = wx.getStorageSync('teacherMobile')
      // 用户绑定信息
      if (wx.getStorageSync('userAttribute')) {
        that.globalData.userAttribute = wx.getStorageSync('userAttribute')
      }
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {
      // 调用登录接口
      console.log('login')
      wx.login({
        success: function (res) {
          that.globalData.code = res.code || null
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              wx.setStorageSync('userInfo', res.userInfo)
              typeof cb == "function" && cb(that.globalData.userInfo)
            },
            // 如果用户拒绝授权
            fail: function () {
              that.checkUserInfo()
            }
          })
        }
      })
    }
  },
  // 获得当前的位置信息
  getUserLocation(cb) {
    if (wx.getStorageSync('userId') && wx.getStorageSync('teacherMobile')) {
      return
    }
    
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude,
            longitude = res.longitude,
            userInfo = that.globalData.userInfo
        that.globalData.location = {
          latitude, longitude
        }

        userLogin({
          authorization: true,
          data: {
            thirdPartyKey: that.globalData.code,
            longitude, latitude,
            userType: 2,
            userNickname: userInfo.nickName,
            userPortraitUrl: userInfo.avatarUrl
          },
          success: res => {
            if (res.code == '1000') {
              let data = res.data
              that.globalData.userId = data.userId
              that.globalData.userData = res.data
              let userAttribute = data.userAttribute
              that.globalData.userAttribute = userAttribute
              console.log('get userAttribute::', userAttribute)
              wx.setStorageSync('userId', data.userId)
              wx.setStorageSync('userData', res.data) 
              wx.setStorageSync('userAttribute', userAttribute)
              if (!userAttribute.userMobile && !wx.getStorageSync('teacherMobile')) {
                wx.reLaunch({
                  url: '/pages/binding/protocol/protocol'
                })
              } else {
                wx.setStorageSync('teacherMobile', userAttribute.userMobile)
                wx.setStorageSync('userAttribute', userAttribute)
                wx.reLaunch({
                  url: '/' + that.globalData.currentUri
                })
              }
            }
          }
        })
      }
    })
  },
  // 小程序授权确定
  checkUserInfo() {
    let that = this
    wx.showModal({
      showCancel: false,
      title: '您好',
      content: '该小程序需要授权方能继续...',
      success: function (res) {
        // 打开授权设置页面
        // wx.openSetting({
        //   success: (res) => {
        //     let setting = res.authSetting
        //     if (setting['scope.userInfo'] && setting['scope.userLocation']) {
        //       that.getUserInfo()
        //     } else {
        //       that.checkUserInfo()
        //     }
        //   }
        // })
        let redirectUrl = that.globalData.currentUri.split('?')[0]
        wx.redirectTo({
          url: `../../../pages/wx/authorize/authorize?redirect=${redirectUrl}`,
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    location: {
      latitude: null,
      longitude: null
    },
    userId: null,
    code: null,
    userAttribute: null,
    userAttributeFlag: true,
    currentUri: '',
    teacherMobile: ''
  }
})



