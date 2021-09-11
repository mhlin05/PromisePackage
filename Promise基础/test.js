import { mineReadFile } from './3-promise封装fs.js'
// 为什么这里不行

mineReadFile('./testdata/a.txt')
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
