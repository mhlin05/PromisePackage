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
      self.callback.forEach((item) => {
        item.onResolved(data)
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
      self.callback.forEach((item) => {
        item.onRejected(data)
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

/**
 *
 * @param {*} onResolved
 * @param {*} onRejected
 * @return {Promise}
 */

Promise.prototype.then = function (onResolved, onRejected) {
  // then的返回结果由回调函数决定
  // 回调函数返回非promise then返回promise fullfilled
  // 回调函数返回promise then返回这个promise的结果

  // 封装函数
  // 如果用箭头函数解决了 this的指向问题
  // 但是resolve和reject函数需要传递
  // const myfunc = () => {}

  // const callBack = (typeFunc, resolve, reject) => {
  //   try {
  //     // 获取回调函数执行的结果
  //     let res = typeFunc(this.promiseResult)
  //     if (res instanceof Promise) {
  //       res.then(
  //         (v) => {
  //           resolve(v)
  //         },
  //         (err) => {
  //           reject(err)
  //         }
  //       )
  //     } else {
  //       resolve(res)
  //     }
  //   } catch (error) {
  //     reject(error)
  //   }
  // }
  const self = this
  return new Promise((resolve, reject) => {
    // 封装函数
    function callBack(typeFunc) {
      try {
        // 获取回调函数执行的结果
        let res = typeFunc(self.promiseResult)
        if (res instanceof Promise) {
          res.then(
            (v) => {
              resolve(v)
            },
            (err) => {
              reject(err)
            }
          )
        } else {
          resolve(res)
        }
      } catch (error) {
        reject(error)
      }
    }
    if (this.promiseState === 'fullfilled') {
      // 回调函数throw error时处理直接reject
      callBack(onResolved)
    }
    if (this.promiseState === 'rejected') {
      callBack(onRejected)
    }
    if (this.promiseState === 'pending') {
      // push了一个新的onResolved函数
      this.callback.push({
        onResolved: function () {
          callBack(onResolved)
        },
        onRejected: function () {
          callBack(onRejected)
        }
      })
    }
  })
}
