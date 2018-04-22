// pages/user/course/course.js
import { getTeacherCourseList } from '../../../utils/api'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: {
      rankState: false,
      direction: 'row',
      data: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '育商师课程列表',
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
    getTeacherCourseList({
      data: {
        userId: app.globalData.userId || wx.getStorageSync('userId')
      },
      success: res => {
        if (res.code == '1000') {
          this.setData({
            ['courseList.data']: res.data
          })
        }
      }
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