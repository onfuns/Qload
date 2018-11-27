import { observable, action } from 'mobx'
import { getFileList, delFile, getBucketDomain, batchDelFile, renameFile, uploadFile } from '../actions'
import bucketStore from './bucket'

class Files {

  @observable fileList = []
  @observable bucketDomain = ''
  @observable loading = false

  @action
  getFileList = async ({ bucket = '', marker = '', prefix = '', delimiter = '' } = {}) => {
    const c_bucket = bucket || bucketStore.bucket
    const params = { bucket: c_bucket, marker, prefix, delimiter }
    try {
      this.loading = true
      const { items } = await getFileList(params)
      this.loading = false
      this.fileList = [...items]
      this.getDomain(c_bucket)  //获取当前bucket域名，预览、复制需要
    } catch (error) {
      this.loading = false
    }
  }
  deleteFile = async ({ key }) => {
    const { bucket } = bucketStore
    await delFile({ key, bucket })
    this.getFileList()
  }
  getDomain = async (bucket) => {
    const data = await getBucketDomain(bucket)
    if (data.length) {
      this.bucketDomain = data[0]
    }
  }
  batchDelFiles = async ({ keys }) => {
    const { bucket } = bucketStore
    await batchDelFile({ keys, bucket })
    this.getFileList()
  }
  rename = async (key, name) => {
    const { bucket } = bucketStore
    await renameFile(bucket, key, name)
    this.getFileList()
  }
  upload = async (file) => {
    const { bucket } = bucketStore
    await uploadFile(file, bucket)
  }
}

export default new Files()