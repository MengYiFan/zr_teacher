export const bindCourseTap = (context, e) => {
  let courseid = e.currentTarget.dataset.courseid || false
  if (!courseid) {
    wx.showToast({
      title: '服务器繁忙',
      icon: 'none',
      duration: 2000
    })
    return
  }
  wx.navigateTo({
    url: '../../../pages/course/letter/letter?courseid=' + courseid
  })
}

export const catchCourseEvaluateTap = (context, e) => {
  context.setData({
    ['evaluate.switch']: true,
    ['evaluate.score']: null
  })
}
