// pages/self/attention/attention.js
import { getCategoryQus, getFeeQus, getSubjectList, updateSubject } from '../../../utils/api'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qusArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的关注领域'
    })
  },
  bindTagTap(e) {
    let dataset = e.target.dataset,
        key = dataset.key,
        flag = dataset.flag,
        index = dataset.index
    // 更新关注的领域
    updateSubject({
      data: {
        "operationCode": flag ? 0 : 1,
        "userId": app.globalData.userId || wx.getStorageSync('userId'),
        "userType": 2,
        "subjectId": key
      },
      success: (res) => {
        this.setData({
          ['qusArr[' + index + '].flag']: !flag
        })
      }
    })
  },
  // 获得标签列表后的回调函数
  getCategoryQusCb() {
    // 用户关注的内容
    getSubjectList({
      data: {
        "userId": app.globalData.userId || wx.getStorageSync('userId'),
        "userType": 2
      },
      success: res => {
        if (res.code == '1000') {
          let data = res.data,
              qusArr = this.data.qusArr
          // 对比数据, 生成用户关注状态flag
          for (var item of data) {
            let key = item.subjectId
            for (var [idx, qus] of qusArr.entries()) {
              if (key == qus.key) {
                qusArr[idx].flag = true
                break
              }
            }
          }
          this.setData({
            qusArr
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
    let userAttribute = app.globalData.userAttribute || wx.getStorageSync('userAttribute'),
        teacherTypeCode = app.globalData.teacherTypeCode || wx.getStorageSync('teacherTypeCode') || userAttribute.teacherTypeCode
    // N 免费 Y 收费
    console.warn(teacherTypeCode)
    if (teacherTypeCode == 'Y') {
      getFeeQus({
        method: 'get',
        success: (res) => {
          console.log(res)
          if (res.code == '1000') {
            this.setData({
              qusArr: res.data.category
            })
            this.getCategoryQusCb()
          }
        }
      })
    } else {
      getCategoryQus({
        method: 'get',
        success: (res) => {
          if (res.code == '1000') {
            this.setData({
              qusArr: res.data
            })
            this.getCategoryQusCb()
          }
        }
      })
    }
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