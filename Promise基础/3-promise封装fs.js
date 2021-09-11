/**
 * 封装一个函数 mineReadFile 读取文件内容
 * 参数：path 文件路径
 * 返回：Promise对象
 */

const mineReadFile = (path) => {
  const p = new Promise((resolve, reject) => {
    require('fs').readFile(path, (err, data) => {
      if (err) {
        // 请求失败
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
  //   返回Promise对象
  return p
}

// export { mineReadFile }
mineReadFile('./testdata/a.txt')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
