/**
 * 定义promise的构造函数
 * @param {*} executor
 */
function Promise(executor) {
  this.promiseState = 'pending'
  this.promiseResult = null
  // 这里将callback改为数组
  // 实现多个then的成功调用
  this.callback = []
  const self = this
  function resolve(data) {
    if (self.promiseState !== 'pending') {
      return
    }
    self.promiseState = 'fullfilled'
    self.promiseResult = data

    if (self.callback.length !== 0) {
      self.callback.forEach((cb) => {
        cb.onResolved(data)
      })
    }
  }

  function reject(data) {
    if (self.promiseState !== 'pending') {
      return
    }
    self.promiseState = 'rejected'
    self.promiseResult = data

    if (self.callback.length !== 0) {
      self.callback.forEach((cb) => {
        cb.onRejected(data)
      })
      // self.callback.onRejected(data)
    }
  }

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  if (this.promiseState === 'fullfilled') {
    onResolved(this.promiseResult)
  }
  if (this.promiseState === 'rejected') {
    onRejected(this.promiseResult)
  }
  if (this.promiseState === 'pending') {
    //   保存回调函数
    this.callback.push({
      onResolved,
      onRejected
    })
    // this.callback = {
    //   onResolved,
    //   onRejected
    // }
  }
}
