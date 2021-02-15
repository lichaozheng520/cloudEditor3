const qiniu = require('qiniu')
const axios = require('axios')
const fs = require('fs')

class QiniuManager {
  // 构造方法
  constructor(accessKey, secretKey, bucket ) {
    //generate mac
    this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    this.bucket = bucket

    // init config class
    this.config = new qiniu.conf.Config()
    // 空间对应的机房(z0是华东区，其他可以是z1、z2)
    this.config.zone = qiniu.zone.Zone_z0

    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }
  
  uploadFile(key, localFilePath) {
    // generate uploadToken
    const options = {
      scope: this.bucket + ":" + key,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken=putPolicy.uploadToken(this.mac)
    const formUploader = new qiniu.form_up.FormUploader(this.config)
    const putExtra = new qiniu.form_up.PutExtra()
    //文件上传
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, localFilePath, putExtra, 
        this._handleCallback(resolve, reject));
    })
  }
  // 删除文件
  deleteFile(key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, 
        this._handleCallback(resolve, reject))
    })
  }
  // 获得BucketDomain
  getBucketDomain() {
    const reqURL = `http://api.qiniu.com/v6/domain/list?tbl=${this.bucket}`
    const digest = qiniu.util.generateAccessToken(this.mac, reqURL)
    console.log('trigger here')
    return new Promise((resolve, reject) => {
      qiniu.rpc.postWithoutForm(reqURL, digest, this._handleCallback(resolve, reject))
    })
  }
  
  getStat(key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.stat(this.bucket, key, this._handleCallback(resolve, reject))
    })
  }
  // 生成下载链接
  generateDownloadLink(key) {
    // 判断请求是否重复发送。如果有，则直接获取；如果没有，则重新发送请求
    const domainPromise = this.publicBucketDomain ? 
    Promise.resolve([this.publicBucketDomain]) : this.getBucketDomain()
    return domainPromise.then(data => {
      // 判断http是否已经加上了
      if (Array.isArray(data) && data.length > 0) {
        const pattern = /^https?/
        // 如果已经加上了，则不再添加；如果没有加上，则添加http协议
        this.publicBucketDomain = pattern.test(data[0]) ? data[0] : `http://${data[0]}`
        return this.bucketManager.publicDownloadUrl(this.publicBucketDomain, key)
      } else {
        throw Error('域名未找到，请查看存储空间是否已经过期')
      }
    })
  }
  
  downloadFile(key, downloadPath) {
    // step 1 get the download link
    // step 2 send the request to download link, return a readable stream
    // step 3 create a writable stream and pipe to it
    // step 4 return a promise based result
    return this.generateDownloadLink(key).then(link => {
      const timeStamp = new Date().getTime()
      const url = `${link}?timestamp=${timeStamp}`
      return axios({
        url,
        method: 'GET',
        responseType: 'stream',
        headers: {'Cache-Control': 'no-cache'}
      })
    }).then(response => {
      const writer = fs.createWriteStream(downloadPath)
      response.data.pipe(writer)
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    }).catch(err => {
      return Promise.reject({ err: err.response })
    })
  }
  // 高阶函数
  _handleCallback(resolve, reject) {
    return (respErr, respBody, respInfo) => {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody)
      } else {
        reject({
          statusCode: respInfo.statusCode,
          body: respBody
        })
      }
    }
  }
}

module.exports = QiniuManager
