import { observable, action, autorun } from 'mobx'
import { getBuckets, delBucket, createBucket } from '../actions'
import fileStore from './file'

class Bucket {

  @observable bucket = ''
  @observable bucketList = []

  @action
  setBucket = (bucket) => {
    this.bucket = bucket
  }
  getBucketList = async () => {
    const data = await getBuckets()
    if (data.length) {
      this.bucketList = [...data]
      if (!this.bucket) {
        this.bucket = data[0]
      }
      fileStore.getFileList({ bucket: this.bucket }) //当前bucket不存在则显示第一个
    }
  }
  delBucket = async (bucket) => {
    await delBucket(bucket)
    this.getBucketList()
  }
  createBucket = async (params) => {
    await createBucket(params)
    this.getBucketList()
  }
}

export default new Bucket()