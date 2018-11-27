import { request } from '../utils/util'
const { getAccessToken, urlsafeBase64Encode, getQiniuToken } = require('../utils/qiniu')

export const createBucket = async ({ name, region }) => {
  const { url, accessToken } = getAccessToken(`http://rs.qiniu.com/mkbucketv2/${urlsafeBase64Encode(name)}/region/${region}`)
  return request({
    url,
    method: 'POST',
    headers: {
      Authorization: accessToken,
    }
  })
}

export const getBuckets = async () => {
  try {
    const { url, accessToken } = getAccessToken('http://rs.qbox.me/buckets')
    return request({
      url,
      method: 'POST',
      headers: {
        Authorization: accessToken,
      }
    })
  } catch (err) {
    console.log(err)
  }
}

export const delBucket = async (bucket) => {
  const { url, accessToken } = getAccessToken(`http://rs.qiniu.com/drop/${bucket}`)
  return request({
    url,
    method: 'POST',
    headers: {
      Authorization: accessToken
    }
  })
}
export const getBucketDomain = async (bucket) => {
  const { url, accessToken } = getAccessToken(`http://api.qiniu.com/v6/domain/list?tbl=${bucket}`)
  return request({
    url,
    method: 'POST',
    headers: {
      Authorization: accessToken,
    }
  })
}

export const batchDelFile = async ({ bucket, keys }) => {
  let query = ''
  keys.forEach((key) => {
    const url = urlsafeBase64Encode(`${bucket}:${key}`);
    query += `op=/delete/${url}&`;
  });
  query = query.substring(0, query.length - 1);
  const { url, accessToken } = getAccessToken(`http://rs.qiniu.com/batch?${query}`)
  return request({
    url,
    method: 'POST',
    headers: {
      Authorization: accessToken,
    }
  })
}

export const delFile = async ({ bucket, key }) => {
  const { url, accessToken } = getAccessToken(`http://rs.qiniu.com/delete/${urlsafeBase64Encode(`${bucket}:${key}`)}`)
  return request({
    url,
    method: 'POST',
    headers: {
      Authorization: accessToken,
    }
  })
}
export const renameFile = async (bucket, oldName, newName) => {
  const encodedEntryurlSrc = urlsafeBase64Encode(`${bucket}:${oldName}`);
  const encodedEntryurlDest = urlsafeBase64Encode(`${bucket}:${newName}`);
  const { url, accessToken } = getAccessToken(`http://rs.qiniu.com/move/${encodedEntryurlSrc}/${encodedEntryurlDest}`)
  return request({
    url,
    method: 'POST',
    headers: {
      Authorization: accessToken,
    }
  })
}

export const getFileList = async (data) => {
  let params = ''
  for (let i in data) {
    params += `${i}=${data[i]}&`
  }
  const { url, accessToken } = getAccessToken(`http://rsf.qbox.me/list?${params}`)
  return request({
    url,
    headers: {
      Authorization: accessToken,
    }
  })
}

export const uploadFile = async (info, bucket) => {
  const token = getQiniuToken(bucket)
  const oMyForm = new FormData();
  oMyForm.append('token', token);
  oMyForm.append('key', info.file.name);
  oMyForm.append('file', info.file);
  const oReq = new XMLHttpRequest();
  oReq.upload.onprogress = (e) => {
    if (e.total > 0) {
      e.percent = (e.loaded / e.total) * 100;
    }
    info.onProgress(e);
  };
  oReq.open('POST', 'http://upload.qiniu.com');
  oReq.onload = () => {
    if (oReq.status === 200) {
      info.onSuccess({ response: oReq.response });
    } else {
      info.onError(oReq.response);
    }
  };
  oReq.onerror = () => {
    info.onError(oReq.response)
  }
  oReq.send(oMyForm);
}