const fs = require('fs')
let mineReadFile = require('util').promisify(fs.readFile)

mineReadFile('./testdata/a.txt')
  .then((res) => {
    console.log(res.toString())
  })
  .catch((err) => {
    console.log(err)
  })
