// 获得星星分数
export const bindStartScoreTap = (context, e) => {
  context.setData({
    ['evaluate.score']: parseInt(e.currentTarget.dataset.index) + 1
  })
}

// 评分关闭
export const bindEvaluateClose = (context) => {
  context.setData({
    ['evaluate.switch']: false
  })
}

// 提交评分
export const bindSubmitScoreTap = (context, data) => {
  if (context.data.evaluate.score == 0) return
  console.log(data)
}