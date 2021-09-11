const p = new Promise((resolve, reject) => {
  // 包裹一个异步操作
  setTimeout(() => {
    let n = Math.random()
    if (n <= 0.5) {
      resolve(n) // 将promise对象的状态设置为【成功】
    } else {
      reject(n) // 将promise对象的状态设置为【失败】
    }
  }, 1000)
})

p.then(
  (res) => {
    console.log('成功了', res)
  },
  (err) => {
    console.log('失败了', err)
  }
)
