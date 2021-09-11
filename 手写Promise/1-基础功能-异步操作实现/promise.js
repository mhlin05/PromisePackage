/**
 * 定义promise的构造函数
 * @param {*} executor
 */
function Promise(executor) {
  // Promise属性
  this.promiseState = 'pending'
  this.promiseResult = null
  //
  this.callback = {}
  // 保存this指向
  const self = this
  //   resolve函数
  function resolve(data) {
    //   实现状态只能修改一次功能
    if (self.promiseState !== 'pending') {
      return
    }
    // 改变状态
    self.promiseState = 'fullfilled'
    // 设置结果
    self.promiseResult = data

    // 执行回调函数
    if (self.callback.onResolved) {
      self.callback.onResolved(data)
    }
  }

  // reject函数
  function reject(data) {
    //   实现状态只能修改一次功能
    if (self.promiseState !== 'pending') {
      return
    }
    // 改变状态
    self.promiseState = 'rejected'
    // 设置结果
    self.promiseResult = data

    // 执行回调函数
    if (self.callback.onRejected) {
      self.callback.onRejected(data)
    }
  }

  try {
    // 同步调用执行器函数
    executor(resolve, reject)
  } catch (error) {
    //   实现throw error改变Promise状态
    reject(error)
  }
}

// 添加 then 方法
Promise.prototype.then = function (onResolved, onRejected) {
  // 调用回调函数
  if (this.promiseState === 'fullfilled') {
    onResolved(this.promiseResult)
  }
  if (this.promiseState === 'rejected') {
    onRejected(this.promiseResult)
  }
  //   Promise中执行一个异步方法
  if (this.promiseState === 'pending') {
    //   保存回调函数
    this.callback = {
      onResolved,
      onRejected
    }
  }
}
