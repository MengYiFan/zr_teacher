// pages/binding/binging.js
import { isPhone, isPassword, isLegalPassword } from '../../../utils/common'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputFlag: {
      phone: 0,
      verification: 0,
      password: 0
    },
    wxBugText2Password: false,// 小程序bug input 类型text转ps的时候，会置空
    inputPhoneValue: '',
    inputPasswordValue: '',// 密码值
    inputPasswordFocus: false,// 不获得 focus的话，input 类型没法状态改变
    passwordInputSwitch: false,// 闭眼 password
    canSubmit: false,// 提交按钮是否可用
    phoneWarnInfo: '',// 手机警告信息
    passwordWarnInfo: '',// 密码输入提示
    verificationRandomNumber: null,// 先通过简单验证码再请求短信验证码
    canGetRealVerificationCode: false,// 完成随机码验证为true，可发送短信验证码请求
    intervalId: null,// interval id
    verificationCodeInputValue: '',// 验证码输入框的value值
    verificationCodeTag: '发送验证码',// 验证码提示
    countdown: 10,// 验证码可再发送的倒计时
    maxCountdown: 10,
    verificationInputFocusFlag: false,// 验证码输入框获得focus
    realVerificationCode: '',// 真·短信验证码
    verificationInputDisplayFlag: false// 验证码验证成功 不可再输入display
  },
  // 显示和隐藏 密码 开关
  catchPasswordTypeSwitchTap() {
    let passwordInputSwitch = this.data.passwordInputSwitch
    this.setData({
      passwordInputSwitch: !passwordInputSwitch,
      inputPasswordFocus: true
    })
    setTimeout(() => {
      this.setData({
        inputPasswordFocus: false
      })
    }, 0)
  },
  bindInputTap(e) {
    // let key = e.currentTarget.dataset.key
    // this.setData({
    //   [`inputFlag.${key}`]: false
    // })
  },
  // 电话号码输入监听
  bindPhoneInput(e) {
    let value = e.detail.value

    if (isPhone(value)) {
      this.setData({
        ['inputFlag.phone']: 1,
        phoneWarnInfo: '',
        inputPhoneValue: value
      })
    } else if (value.length == 11) {
      this.setData({
        ['inputFlag.phone']: -1,
        phoneWarnInfo: '错误输入'
      })
    } else {
      this.setData({
        ['inputFlag.phone']: 0,
        phoneWarnInfo: ''
      })
    }
    this.canSubmit()
  },
  // 密码输入监听
  bindPasswordInput(e) {
    let value = e.detail.value
    // @@ 待解决
    // @@ input tpye: text => password 会出现重置的bug
    // 微信input text类型转 password类型 value会重置为空
    if (value) {
      let temp = ''
      // if (this.data.wxBugText2Password) {
      //   temp = this.data.inputPasswordValue
      // }
      this.setData({
        inputPasswordValue: '' + temp + value,
        wxBugText2Password: false
      })
    } else {
      // this.setData({
      //   wxBugText2Password: true
      // })
      return
    }

    if (isPassword(value)) {
      this.setData({
        ['inputFlag.password']: 1,
        passwordWarnInfo: ''
      })
    } else if (!isLegalPassword(value)) {
      this.setData({
        ['inputFlag.password']: -1,
        passwordWarnInfo: '只可输入数字、英文和符号._+;=@-'
      })
    } else if (value.length < 6 || value.length > 18) {
      this.setData({
        ['inputFlag.password']: 0,
        passwordWarnInfo: '长度 6~18'
      })
    }
    this.canSubmit()
  },
  // 发送验证码按钮
  bindSendVerificationTap(e) {
    // if (this.data.inputFlag.phone != 1 && !this.data.verificationRandomNumber) {
    if (this.data.inputFlag.phone != 1) {
      this.setData({
        ['inputFlag.phone']: -1
      })
      return
    } 
    // else if (!this.data.canGetRealVerificationCode) {
    //   // 如果还不能获得短信验证码
    //   // 先置入随机验证码
    //   console.log('第一步，生成随机码')
    //   let randomNumber = this.createRandomNumber()
    //   this.setData({
    //     realVerificationCode: '',
    //     verificationRandomNumber: randomNumber,
    //     verificationInputFocusFlag: true,
    //     verificationCodeInputValue: '',
    //     verificationCodeTag: '发送验证码'
    //   })
    // }
    // 短信验证码开始了
    // 短信验证码接口访问
    console.log('我要开始了~~')
    this.setData({
      realVerificationCode: this.createRandomNumber(),
      ['inputFlag.verification']: 0,
      canGetRealVerificationCode: true
    })
    console.log(this.data.realVerificationCode)

    // 验证码可再次点击重获取的倒计时运算
    let countdown = this.data.countdown
    this.setData({
      verificationCodeTag: `已发送(${countdown}s)`,
      countdown: countdown
    })
    let tempInter = setInterval(() => {
      this.setData({
        verificationCodeTag: `已发送(${countdown}s)`,
        countdown: --countdown,
        intervalId: tempInter
      })
      if (countdown < 0) {
        // 清除倒计时 可以重新获取新的验证码
        clearInterval(this.data.intervalId)
        this.setData({
          verificationCodeTag: '重新发送',
          countdown: this.data.maxCountdown,
          canGetRealVerificationCode: false
        })
      }
    }, 1000)
  },
  // 验证码输入 bindinput
  bindVerificationCodeInput(e) {
    let value = e.detail.value.toLocaleLowerCase(),
        verificationRandomNumber = this.data.verificationRandomNumber

    if (true || verificationRandomNumber) {
      // 如果输入的跟随机数相同
      if (true || verificationRandomNumber === value) {
        // this.setData({
        //   verificationRandomNumber: null,
        //   canGetRealVerificationCode: true,
        //   verificationCodeInputValue: ''// 还原输入框，给短信验证码光标
        // })
        this.setData({
          verificationRandomNumber: null,
          canGetRealVerificationCode: true,
          verificationCodeInputValue: value
        })
        // // 短信验证码开始了
        // // 短信验证码接口访问
        // console.log('我要开始了~~')
        // this.setData({
        //   realVerificationCode: this.createRandomNumber(),
        //   ['inputFlag.verification']: 0
        // })
        // console.log(this.data.realVerificationCode)

        // // 验证码可再次点击重获取的倒计时运算
        // let countdown = this.data.countdown
        // this.setData({
        //   verificationCodeTag: `已发送(${countdown}s)`,
        //   countdown: countdown
        // })
        // let tempInter = setInterval(() => {
        //   this.setData({
        //     verificationCodeTag: `已发送(${countdown}s)`,
        //     countdown: --countdown,
        //     intervalId: tempInter
        //   })
        //   if (countdown < 0) {
        //     // 清除倒计时 可以重新获取新的验证码
        //     clearInterval(this.data.intervalId)
        //     this.setData({
        //       verificationCodeTag: '重新发送',
        //       countdown: this.data.maxCountdown,
        //       canGetRealVerificationCode: false
        //     })
        //   }
        // }, 1000)// 1秒
      } else if (value.length == verificationRandomNumber.length) {
        this.setData({
          ['inputFlag.verification']: 1//-1
        })
      }
    } 
    // else if (false || this.data.realVerificationCode) {
    //   console.log('判断短信和输入的')
    //   let inputValue = e.detail.value.toLocaleLowerCase(),
    //       realVerificationCode = this.data.realVerificationCode
    //   if (inputValue == realVerificationCode) {
    //     console.log('OK')
    //     clearInterval(this.data.intervalId)
    //     this.setData({
    //       verificationInputDisplayFlag: true,
    //       verificationCodeTag: '验证成功',
    //       ['inputFlag.verification']: 1
    //     })
    //   } else if (inputValue.length == realVerificationCode.length) {
    //     this.setData({
    //       ['inputFlag.verification']: -1
    //     })
    //   }
    // } 
    else if (!this.data.canGetRealVerificationCode) {
      console.log('ccc')
      let randomNumber = this.createRandomNumber()
      this.setData({
        verificationRandomNumber: randomNumber,
        verificationInputFocusFlag: true
      })
    } 
    this.canSubmit()
  },
  // 验证码input bindtap绑定
  bindVerificationCodeInputTap() {
    if (this.data.inputFlag.phone != 1 && !this.data.verificationRandomNumber) {
      this.setData({
        ['inputFlag.phone']: -1
      })
    } else if (!this.data.verificationInputDisplayFlag 
      && !this.data.verificationRandomNumber
      && !this.data.realVerificationCode) {
      // let randomNumber = this.createRandomNumber()
      // this.setData({
      //   verificationRandomNumber: randomNumber,
      //   verificationInputFocusFlag: true
      // })
    }
  },
  // 生成随机数
  createRandomNumber() {
    return Math.random().toString(16).slice(2, 6).toLocaleLowerCase()
  },
  // 能提交判断
  canSubmit() {
    let res = true, inputFlag = this.data.inputFlag
    for (let k in inputFlag) {
      console.log(k, inputFlag[k])
      if (inputFlag[k] != 1) {
        res = false
        break
      }
    }
    
    if (res) {
      this.setData({
        canSubmit: true
      })
    } else {
      this.setData({
        canSubmit: false
      })
    }
  },
  // 绑定按钮事件
  bindBindingBtnTap(e) {
    if (this.data.canSubmit) {
      app.globalData.userAttributeFlag = true
      wx.redirectTo({
        url: `../../../pages/user/info/info?phone=${this.data.inputPhoneValue}&password=${this.data.inputPasswordValue}`
      })
    }
  },
  // 获得用户信息
  getUserInfo: function (e) {
    console.log(e)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initUserInfo()

    wx.setNavigationBarTitle({
      title: '育商师手机号绑定',
    })
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