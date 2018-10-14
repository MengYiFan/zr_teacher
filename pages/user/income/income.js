// pages/user/income/income.js
import { getIncome } from '../../../utils/api'
import { formatTime } from '../../../utils/util'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeList: [],
    userInfo: null,
    userAttribute: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo || wx.getStorageSync('userInfo')
    })

    getIncome({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId')
      },
      success: res => {
        if (res.code == '1000') {
          let data = res.data
          this.setData({
            incomeList: data.loyaltyRecordList
          })
        }
      }
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

  }
})