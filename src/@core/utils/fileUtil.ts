import SparkMD5 from 'spark-md5'

//计算文件md5
let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
  chunkSize = 2097152, // Read in chunks of 2MB
  chunks: number, //分块数量
  currentChunk: number,
  spark = new SparkMD5.ArrayBuffer(),
  fileReader: FileReader

function MD5(file: File): Promise<String> {
  currentChunk = 0
  chunks = Math.ceil(file.size / chunkSize)
  fileReader = new FileReader()

  const loadNext = () => {
    const start = currentChunk * chunkSize
    const end = start + chunkSize > file.size ? file.size : start + chunkSize
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }

  loadNext()

  return new Promise((resolve, reject) => {
    fileReader.onload = async e => {
      const res = e.target.result
      spark.append(res)
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
        // console.log(`第${currentChunk}分片解析完成, 开始第${currentChunk + 1}分片解析`)
      } else {
        resolve(spark.end())
      }
    }
  })
}

export default {
  MD5,
}
