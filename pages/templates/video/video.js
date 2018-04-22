export const bindVideoItemTap = (context, e, to) => {
  // let money = e.currentTarget.dataset.money

  // if (money) {
  //   context.setData({
  //     ['pay.switch']: true,
  //     ['pay.money']: money
  //   })
  // } else {
  //   wx.navigateTo({
  //     url: to || '../../../pages/video/play/play'
  //   })
  // }
  let dataset = e.currentTarget.dataset,
      vedioId = dataset.vedioid,
      money = dataset.money
  wx.navigateTo({
    url: to || '../../../pages/video/play/play?vedioid=' + vedioId + '&money=' + money
  })
}