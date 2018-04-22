/*
 * 支持窗口初始数据（包括打开，金额，优惠信息）
 */
export const payData = {
  switch: false,// 显示支付窗口
  money: 50,// 支付金额
  discounts: {// 优惠券信息
    switch: false,// 展开优惠券
    list: [// 各种优惠券 checked表示没有选用
      { checked: false, name: '优惠5元', reduced: 5 },
      { checked: false, name: '优惠10元', reduced: 10 },
      { checked: false, name: '优惠12元', reduced: 12 },
      { checked: false, name: '优惠20', reduced: 20 },
      { checked: false, name: '优惠30', reduced: 30 },
      { checked: false, name: '优惠3', reduced: 3 }
    ],
    total: 0,// 总共选了几张
    sum: 0// 总共减少的金额
  }
}

/*
 * 关闭支付窗口
 */
export const bindPayClose = (context) => {
  context.setData({
    ['pay.switch']: false
  })
}

/*
 * 优惠券列表展示开关
 */
export const bindDiscountsSwitch = (context) => {
  context.setData({
    ['pay.discounts.switch']: !context.data.pay.discounts.switch
  })
}

/*
 * 监听优惠券选择
 */
export const bindDiscountsChange = (context, e) => {
  let checkedIndexArr = e.detail.value,
    discountsList = context.data.pay.discounts.list
  // 更新选中对勾状态
  for (let [index, val] of discountsList.entries()) {
    discountsList[index].checked = checkedIndexArr.indexOf('' + index) != -1 ? true : false
  }

  // 总共减少数额
  let sum = 0
  for (let val of checkedIndexArr) {
    sum += discountsList[val].reduced
    // 不可能倒贴钱的把~
    if (sum > context.data.pay.money) {
      sum = context.data.pay.money
    }
  }
  context.setData({
    ['pay.discounts.list']: discountsList,
    ['pay.discounts.total']: checkedIndexArr.length,
    ['pay.discounts.sum']: sum
  })
}