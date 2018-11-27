import React from 'react';
import { Upload, message, Button, Icon } from 'antd'
import { inject, observer } from 'mobx-react'
const Dragger = Upload.Dragger;

let uploading = false
const UploadFile = observer(({ onBack, fileStore }) => {
  const uploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: true,
    customRequest: (file) => fileStore.upload(file),
    onChange: (info) => {
      uploading = false
      const status = info.file.status;
      if (status === 'uploading') {
        uploading = true
      } else if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    }
  }

  const back = () => {
    if (uploading) {
      return message.warn('文件正在上传中，请稍候返回')
    }
    onBack && onBack()
  }


  return (
    <div>
      <div style={{ padding: 10 }}>
        <Button type="primary" onClick={back}>返回</Button>
      </div>
      <div style={{ height: 250, padding: 10 }}>
        <Dragger {...uploadProps}>
          <p>
            <Icon type="inbox" />
          </p>
          <p>点击或拖拽上传</p>
        </Dragger>
      </div>
    </div>
  )
})

export default inject('fileStore')(UploadFile)