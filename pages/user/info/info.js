// pages/userInfo/userInfo.js
import { bindUser, updateUser } from '../../../utils/api'
import { formatTime } from '../../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sexArray: ['男', '女'],
    sexIndex: 0,
    date: '1990-01',
    region: ['广东省', '深圳市', '南山区'],
    userMobile: '',
    smsCode: '',
    password: '',
    userName: '',
    sexConf: ['M', 'F'],
    toType: ''
  },
  bindUserNameInput(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  // 性别选择
  bindSexPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      sexIndex: e.detail.value
    })
  },
  // 省市区
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 获得用户出生年月
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 获得用户信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
  // 提交绑定信息
  bindBindingTap() {
    let data = this.data

    if (!data.userName)
      return

    if (data.toType == 'update') {
      let updateData = {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        userGender: data.sexConf[data.sexIndex],
        userRealname: data.userName,
        userBirthDate: data.date + '-01',
        province: data.region[0],
        city: data.region[1],
        district: data.region[2]
      }
      // 更新用户信息
      updateUser({
        data: updateData,
        success: res => {
          if (res.code == '1000') {
            wx.setStorageSync('userAttribute', Object.assign(wx.getStorageSync('userAttribute'), updateData))
            wx.navigateTo({
              url: '../../../pages/index/index/index',
            })
          }
        }
      })
      return
    } else {
      let userInfoData = {
        userId: app.globalData.userId || wx.getStorageSync('userId'),
        userMobile: data.userMobile,
        smsCode: data.smsCode,
        passwd: data.password,
        userGender: data.sexConf[data.sexIndex],
        userRealname: data.userName,
        userBirthDate: data.date + '-01',
        province: data.region[0],
        city: data.region[1],
        district: data.region[2]
      }

      bindUser({
        data: userInfoData,
        success: res => {
          console.log(res)
          if (res.code == '1000') {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            app.globalData.userAttribute = res.data
            wx.setStorageSync('userAttribute', res.data)
            wx.setStorageSync('teacherMobile', data.userMobile)
            wx.setStorageSync('userInfoData', userInfoData)
            setTimeout(() => {
              wx.redirectTo({
                url: '../../../pages/index/index/index',
              })
            }, 500)
          } else {
            wx.redirectTo({
              url: '../../../pages/binding/index/binding',
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      toType: options.toType || ''
    })
    
    this.initUserInfo()

    if (options.phone) {
      this.setData({
        userMobile: options.phone,
        smsCode: options.code,
        password: options.password
      })
    }
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
    let userAttribute = wx.getStorageSync('userAttribute') || wx.getStorageSync('userData').userAttribute || false
    console.log('storage userAttribute: ', userAttribute)
    if (userAttribute) {
      let userBirthDate = userAttribute.userBirthDate,
          birthDate = userBirthDate.split(' ')[0],
          tempDate = birthDate.split('-'),
          date = tempDate[0] + '-' + tempDate[1],
          region = [],
          sexIndex = 0

      region.push(userAttribute.province, userAttribute.city, userAttribute.district)

      for (let [index, item] of this.data.sexConf.entries()) {
        if (item == userAttribute.userGender)
          sexIndex = index
      }

      this.setData({
        userName: userAttribute.userRealname,
        sexIndex,
        region,
        date: date
      })
    }

    wx.setNavigationBarTitle({
      title: '育商师个人信息',
    })
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