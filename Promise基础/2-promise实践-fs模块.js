const fs = require('fs')

// 回调函数形式
// fs.readFile('./testdata/a.txt', (err, data) => {
//   if (err) {
//     throw err
//   }
//   console.log(data.toString())
// })

const p = new Promise((resolve, reject) => {
  // 包裹一个异步操作
  fs.readFile('./testdata/a.txt', (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

p.then(
  (res) => {
    console.log(res.toString())
  },
  (err) => {
    console.log(err)
  }
)
