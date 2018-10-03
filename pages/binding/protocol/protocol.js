// pages/binding/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    protocolImages: ['zr_01.jpg', 'zr_02.jpg', 'zr_03.jpg', 'zr_04.jpg', 'zr_05.jpg', 'zr_06.jpg', 'zr_07.jpg', 'zr_08.jpg']
  },
  bindAgreeProtocolTap(e) {
    wx.redirectTo({
      url: '../../../pages/binding/index/binding',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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