const fse = require('fs-extra')
const path = require('path')
const crypto = require('crypto')
const compressing = require('compressing')
const num = 100
const singleLen = 100
const prefix = 'a_'
const suffix = '.png'
const logPath = './write.log'
const fp = path.resolve(__dirname, 'imgs')

async function stringHandler (str) {
  await fse.mkdirp(fp)
  let logs = []
  for (let i = 0; i < num; i++) {
    const content = str.substr(singleLen * i, singleLen)
    const filePath = path.resolve(fp, `./${prefix}${i}${suffix}`)
    await fse.writeFile(`${filePath}`, content).then(() => {
      const info = `${content}  =>  ${filePath}`
      console.log(info)
      logs.push(info)
    })
  }
  await fse.writeFile(logPath, logs.join('\n'))
  console.log('等待压缩完成')
  await compressing.zip.compressDir(fp, fp + '.zip')
  await fse.remove(fp).then(() => {
    console.log('压缩完成！')
  })
}

crypto.randomBytes(singleLen * num * 0.5, (err, buf) => {
  if (err) throw err
  const str = buf.toString('hex')
  stringHandler(str)
})
