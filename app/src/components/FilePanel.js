import React, { Component } from 'react'
import { Icon, Button, Table, Modal, message, Tooltip, Popconfirm } from 'antd';
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import UploadPanel from './UploadPanel'
import EditFileModal from './EditFileModal'
import { formatFileSize } from '../utils/util'
const electron = require('electron')
const { clipboard } = electron
const { webContents } = electron.remote.getCurrentWebContents();

@inject('fileStore')
@observer
class FilePanel extends Component {
  constructor(props) {
    super(props)
    this.fileStore = props.fileStore
    this.state = {
      sortedInfo: {},
      selectedRowKeys: [],
      selectedRowInfo: {},
      uploadModalVisible: false,
      editFileModalVisible: false,
      previewVisible: false,
    }
  }

  renderColumns = () => {
    const { sortedInfo } = this.state
    return [
      {
        title: '文件名',
        width: 220,
        dataIndex: 'key',
        sorter: (a, b) => a.key.length - b.key.length,
        sortOrder: sortedInfo.columnKey === 'key' && sortedInfo.order,
        render: (text) => {
          if (text.length > 20) {
            return (
              <Tooltip title={text}>
                <span>{text.substring(0, 20) + '...'}</span>
              </Tooltip>
            )
          }
          return text
        }
      }, {
        title: '类型',
        dataIndex: 'mimeType',
        width: 150,
        sorter: (a, b) => a.mimeType.length - b.mimeType.length,
        sortOrder: sortedInfo.columnKey === 'mimeType' && sortedInfo.order
      }, {
        title: '大小',
        dataIndex: 'fsize',
        width: 120,
        sorter: (a, b) => a.fsize - b.fsize,
        sortOrder: sortedInfo.columnKey === 'fsize' && sortedInfo.order,
        render: (text) => formatFileSize(text)
      }, {
        title: '修改时间',
        width: 170,
        dataIndex: 'putTime',
        sorter: (a, b) => a.putTime - b.putTime,
        sortOrder: sortedInfo.columnKey === 'putTime' && sortedInfo.order,
        render: (text) => {
          if (!text) return ''
          let date = text.toString()
          date = date.substring(0, date.length - 7);
          return moment.unix(date).format('YYYY-MM-DD HH:mm:ss');
        }
      }, {
        title: '操作',

        dataIndex: 'action',
        render: (text, record) => (
          <span className="file-panel-tools">
            <Tooltip title="预览">
              <a onClick={() => this.showPreviewModal(record)}><Icon type="eye-o" theme="outlined" /></a>
            </Tooltip>
            <Tooltip title="重命名">
              <a onClick={() => this.showEditFileModal(record)}><Icon type="edit" /></a>
            </Tooltip>
            <Tooltip title="复制外链">
              <a onClick={() => this.copy(record)}><Icon type="link" /></a>
            </Tooltip>
            <Popconfirm title="确认删除？" onConfirm={() => this.confirmDelete(record)} okText="确认" cancelText="取消">
              <a><Icon type="delete" /></a>
            </Popconfirm>
          </span>
        )
      }
    ]
  }

  confirmDelete = async (record) => {
    const { key } = record
    try {
      await this.fileStore.deleteFile({ key })
      message.success('删除文件成功')
    } catch (error) {
      message.error('删除文件失败')
    }
  }

  down = () => {
    const { selectedRowInfo } = this.state
    const { key } = selectedRowInfo
    let index = key.lastIndexOf('/')
    let newName = index > -1 ? key.substring(index + 1) : key
    const link = `http://${this.fileStore.bucketDomain}/${key}?attname=${newName}`;
    webContents.loadURL(link);
  }

  copy = (record) => {
    const { selectedRowInfo } = this.state
    if (!record) record = selectedRowInfo
    const { key } = record
    clipboard.writeText(`http://${this.fileStore.bucketDomain}/${key}`)
    message.success('复制链接成功')
  }



  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys
    })
  }

  showUploadModal = () => {
    const { uploadModalVisible } = this.state
    if (uploadModalVisible) {
      this.fileStore.getFileList()
    }
    this.setState({
      uploadModalVisible: !uploadModalVisible
    })
  }

  showEditFileModal = (record = {}) => {
    const { editFileModalVisible } = this.state
    this.setState({
      editFileModalVisible: !editFileModalVisible,
      selectedRowInfo: record
    })
  }

  showPreviewModal = (record = {}) => {
    let isImg = true
    if (record.mimeType && record.mimeType.indexOf('image') < 0) {
      isImg = false
    }
    const { previewVisible } = this.state
    this.setState({
      previewVisible: !previewVisible,
      selectedRowInfo: record || {},
      previewUrl: record.mimeType && isImg ? `http://${this.fileStore.bucketDomain}/${record.key}?attname=${record.key}.${record.key.split('.')[1]}` : ''
    })
  }

  batchDelFiles = () => {
    const { selectedRowKeys: keys } = this.state
    Modal.confirm({
      title: `确认删除选择文件？`,
      content: '删除后文件无法恢复',
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: () => {
        return new Promise(async (resolve) => {
          try {
            await this.fileStore.batchDelFiles({ keys })
            this.setState({ selectedRowKeys: [] })
            resolve()
          } catch (err) {
            message.error('删除失败')
          }
        })
      }
    });
  }
  render() {
    const { selectedRowKeys, uploadModalVisible, editFileModalVisible, previewVisible, previewUrl } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    return (
      <div style={{ padding: 10 }}>
        {!uploadModalVisible ?
          <div>
            <div style={{ marginBottom: 10 }}>
              <Button type="primary" icon="upload" onClick={this.showUploadModal}>上传</Button>
              <Button type="danger" icon="delete" onClick={this.batchDelFiles} style={{ marginLeft: 10 }} disabled={!selectedRowKeys.length}>删除</Button>
            </div>
            <Table
              scroll={{ y: 465 }}
              loading={this.fileStore.loading}
              columns={this.renderColumns()}
              rowKey={({ key }) => key}
              dataSource={this.fileStore.fileList}
              pagination={false}
              onChange={this.handleChange}
              rowSelection={rowSelection}
              bordered
            />
          </div>
          : <UploadPanel onBack={this.showUploadModal} />
        }
        {editFileModalVisible ?
          <EditFileModal
            dataSource={this.state.selectedRowInfo}
            handleCancel={() => this.showEditFileModal()}
          /> : null}
        <Modal
          title="预览"
          visible={previewVisible}
          width={600}
          onCancel={() => this.showPreviewModal()}
          footer={[
            <Button key="back" size="large" onClick={() => this.copy()}>复制外链</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.down}>
              下载
            </Button>,
          ]}
        >
          {previewUrl ? <img src={previewUrl} className='previewImg' /> : '此类型文件不支持预览'}
        </Modal>
      </div>
    );
  }
}

export default FilePanel;