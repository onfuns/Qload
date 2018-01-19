const request = require('request-promise')
const { getAccessToken,urlsafeBase64Encode,getQiniuToken } = require('../utils/qiniu')

module.exports ={
  createBucket:async (data) =>{
    let { name,region } = data
    name = urlsafeBase64Encode(name)
    const r = getAccessToken(`http://rs.qiniu.com/mkbucketv2/${name}/region/${region}`)
    return request({
      uri: r.url,
      method: 'POST',
      headers: {
        Authorization: r.accessToken,
      },
      json: true,
    })
  },
  getBuckets: async () => {
    const r = getAccessToken('http://rs.qbox.me/buckets')
    return request({
      uri: r.url,
      headers: {
        Authorization: r.accessToken,
      },
      json: true
    })
  },
  delBucket: async (bucket) => {
    const r = getAccessToken(`http://rs.qiniu.com/drop/${bucket}`)
    return request({
      uri: r.url,
      method: 'POST',
      headers: {
        Authorization: r.accessToken,
      },
      json: true
    })
  },
  getBucketDomain(bucket) {
    const r = getAccessToken(`http://api.qiniu.com/v6/domain/list?tbl=${bucket}`)
    return request({
      uri: r.url,
      method: 'POST',
      headers: {
        Authorization: r.accessToken,
      },
      json: true
    })

    return rp(options);
  },
  batchDelFile:({bucket,keys}) =>{
    let query = ''
    keys.forEach((key) => {
      const url = urlsafeBase64Encode(`${bucket}:${key}`);
      query += `op=/delete/${url}&`;
    });
    query = query.substring(0, query.length - 1);
    const r = getAccessToken(`http://rs.qiniu.com/batch?${query}`)
    return request({
      uri: r.url,
      method: 'POST',
      headers: {
        Authorization: r.accessToken,
      },
      json: true
    })
  },
  delFile:async ({bucket, key})=>{
    const url = urlsafeBase64Encode(`${bucket}:${key}`);
    const r = getAccessToken(`http://rs.qiniu.com/delete/${url}`)
    return request({
      uri: r.url,
      method: 'POST',
      headers: {
        Authorization: r.accessToken,
      },
      json: true,
    })
  },
  renameFile:async (bucket,oldName,newName) =>{
    const encodedEntryURISrc = urlsafeBase64Encode(`${bucket}:${oldName}`);
    const encodedEntryURIDest = urlsafeBase64Encode(`${bucket}:${newName}`);
    const r = getAccessToken(`http://rs.qiniu.com/move/${encodedEntryURISrc}/${encodedEntryURIDest}`)
    return request({
      uri: r.url,
      method: 'POST',
      headers: {
        Authorization: r.accessToken,
      },
      json: true,
    })
  },
  getFileList:async (data)=>{
    let params = ''
    for(let i in data){
      params += `${i}=${data[i]}&`
    }
    const r = getAccessToken(`http://rsf.qbox.me/list?${params}`)
    return request({
      uri: r.url,
      headers: {
        Authorization: r.accessToken,
      },
      json: true,
    })
  },
  uploadFile: (info,bucket) => {
    const token = getQiniuToken(bucket)
    const oMyForm = new FormData();
    oMyForm.append('token', token);
    oMyForm.append('key', info.file.name);
    oMyForm.append('file', info.file);
    const oReq = new XMLHttpRequest();
    oReq.upload.onprogress = function (e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      info.onProgress(e);
    };
    oReq.open('POST', 'http://upload.qiniu.com');
    oReq.onload = function (oEvent) {
      if (oReq.status === 200) {
        info.onSuccess({ response: oReq.response });
      } else {
        info.onError(oReq.response);
      }
    };
    oReq.onerror = function (oEvent) {
      info.onError(oReq.response);
    };
    oReq.send(oMyForm);
  }
}