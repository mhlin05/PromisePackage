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
  const self = this
  // 判断回调函数参数
  if (typeof onRejected !== 'function') {
    // 当then只有一个回调时
    // 把错误放到最后处理 形成穿透
    onRejected = (reason) => {
      throw reason
    }
  }
  if (typeof onResolved !== 'function') {
    onResolved = (value) => value
  }
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

// 添加catch 方法
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected)
}

// 添加resolve方法
Promise.resolve = function (params) {
  return new Promise((resolve, reject) => {
    if (params instanceof Promise) {
      // 传入的是Promise对象
      // 那么resolve的结果为这个对象的结果
      params.then(
        (res) => {
          resolve(res)
        },
        (err) => {
          reject(err)
        }
      )
    } else {
      // 状态设置为成功
      resolve(params)
    }
  })
}
