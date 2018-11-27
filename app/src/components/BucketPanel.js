import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import { Button, Icon, Modal } from 'antd'
import AddBucketModal from './AddBucketModal'

@inject('bucketStore', 'fileStore')
@observer
class BucketPanel extends Component {
  constructor(props) {
    super(props)

    this.bucketStore = props.bucketStore
    this.fileStore = props.fileStore

    this.state = {
      addBucketModalVisible: false
    }
  }

  componentDidMount() {
    this.bucketStore.getBucketList()
  }


  onChange = (bucket) => {
    this.bucketStore.setBucket(bucket)
    this.fileStore.getFileList({ bucket })
    this.setState({ selectedRowKeys: [] })
  }

  //显示或隐藏新增bucket弹窗
  showAddBucketModal = () => {
    const { addBucketModalVisible } = this.state
    this.setState({
      addBucketModalVisible: !addBucketModalVisible
    })
  }

  deleteBucket = (e, bucket) => {
    e.stopPropagation()
    Modal.confirm({
      title: `确认删除${bucket}空间?`,
      content: '一旦删除空间，就永远无法再恢复过来，请确认是否有必要删除该空间！此操作会影响到和这个空间相关程序的运行',
      okType: 'danger',
      onOk: () => {
        return new Promise(async (resolve) => {
          await this.bucketStore.delBucket(bucket)
          resolve()
        })
      }
    })
  }

  onAddSubmit = () => {
    this.showAddBucketModal()
    this.bucketStore.getBucketList()
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <ul style={{ height: 'calc(100% - 80px)', overflowY: 'auto', marginBottom: 10 }}>
          {this.bucketStore.bucketList.map((item, index) => (
            <li
              className={this.bucketStore.bucket == item ? 'active' : ''}
              key={index}
              onClick={() => this.onChange(item)}>
              <span className='name'>{item}</span>
              <span className='tools'>
                <Icon type="delete" theme="filled" onClick={(e) => this.deleteBucket(e, item)} />
              </span>
            </li>
          ))}
        </ul>
        <Button type="primary" icon="add" className='addBucketBtn' onClick={this.showAddBucketModal}>新增空间</Button>
        {this.state.addBucketModalVisible ?
          <AddBucketModal
            handleCancel={this.showAddBucketModal}
            onSubmit={this.onAddSubmit}
          /> : null
        }
      </div>
    )
  }
}

export default BucketPanel