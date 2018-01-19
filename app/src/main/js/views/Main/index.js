import React,{ Component } from 'react'
import { 
  Icon, Input, Button,Table,Select,Modal,
  Checkbox, Upload, message, Row, Col,Tooltip,Popconfirm
} from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment'
import styles from './style.less'
import { getBuckets,getFileList,uploadFile,delBucket,batchDelFile,delFile ,getBucketDomain} from '../../actions'
import { getCache,saveCache,formatFileSize } from '../../utils/util'
import AddBucketModal from '../../components/AddBucketModal'
import EditFileModal from '../../components/EditFileModal'
const electron = require('electron')
const { clipboard } = electron
const { webContents }  = electron.remote.getCurrentWebContents();
const Dragger = Upload.Dragger;

let uploading = false
let fileList = []
class Main extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading:false,
      buckets:[],
      dataSource:[],
      sortedInfo:{},
      selectedRowKeys:[],
      selectedRowInfo:{},
      selectedBucket:'',
      addBucketModalVisible:false,
      uploadModalVisible:false,
      editFileModalVisible:false,
      previewVisible:false,
      bucketDomain:''
    }
  }

  async componentDidMount(){
    this.getBucketsList((key)=> this.onClickBucket(key))
  }

  renderColumns = () =>{
    const { sortedInfo } = this.state
    return [
      {
        title:'文件名',
        dataIndex:'key',
        width:160,
        sorter: (a, b) => a.key.length - b.key.length,
        sortOrder: sortedInfo.columnKey === 'key' && sortedInfo.order,
        render: (text,record) => {
          if(text.length>20){
            return (
              <Tooltip title={text}>
                <span>{text.substring(0,20) + '...'}</span>
              </Tooltip>
            )
          }
          return text
        }
      },{
        title:'类型',
        width:80,
        dataIndex:'mimeType',
        sorter: (a, b) => a.mimeType.length - b.mimeType.length,
        sortOrder: sortedInfo.columnKey === 'mimeType' && sortedInfo.order
      },{
        title:'大小',
        dataIndex:'fsize',
        width:60,
        sorter: (a, b) => a.fsize - b.fsize,
        sortOrder: sortedInfo.columnKey === 'fsize' && sortedInfo.order,
        render:(text)=> formatFileSize(text)
      },{
        title:'修改时间',
        dataIndex:'putTime',
        width:120,
        sorter: (a, b) => a.putTime - b.putTime,
        sortOrder: sortedInfo.columnKey === 'putTime' && sortedInfo.order,
        render:(text)=> {
          if (!text) {
            return ''
          }
          let date = text.toString()
          date = date.substring(0, date.length - 7);
          return moment.unix(date).format('YYYY-MM-DD HH:mm:ss');
        }
      },{
        title:'操作',
        dataIndex:'action',
        width:100,
        render:(text,record)=>(
          <span>
            <Tooltip title="预览">
              <a href="javascript:;" onClick={() => this.showPreviewModal(record)}><Icon type="eye-o" /></a>
            </Tooltip>
            <Tooltip title="重命名">
              <a href="javascript:;" style={{marginLeft:10}} onClick={()=> this.showEditFileModal(record)}><Icon type="edit" /></a>
            </Tooltip>
            <Tooltip title="复制外链">
              <a href="javascript:;" style={{marginLeft:10}} onClick={()=> this.copy(record)}><Icon type="link" /></a>
            </Tooltip>
            <Popconfirm title="确认删除？" onConfirm={()=>this.confirmDelete(record)} okText="确认" cancelText="取消">
              <a href="javascript:;" style={{marginLeft:10}}><Icon type="delete" /></a>
            </Popconfirm>
          </span>
        )
      }
    ]
  }

  confirmDelete = (record) =>{
    const { key } = record
    const { selectedBucket } = this.state
    delFile({key,bucket:selectedBucket}).then(data =>{
      message.success('删除文件成功')
      this.getFileListByBucket()
    }).catch(err => message.error('删除文件失败'))
  }

  down = () =>{
    const { selectedRowInfo,bucketDomain } = this.state
    const { key } = selectedRowInfo
    let index = key.lastIndexOf('/')
    let newName = index > -1 ? key.substring(index+1) : key
    const link = `http://${bucketDomain}/${key}?attname=${newName}`;
    webContents.loadURL(link);
  }

  copy =(record) =>{
    const { selectedRowInfo,bucketDomain } = this.state
    if(!record) record = selectedRowInfo
    const { key } = record
    clipboard.writeText(`http://${bucketDomain}/${key}`)
    message.success('复制链接成功')
  }

  getBucketsList = async (fn) =>{
    let data = await getBuckets({})
    this.setState({
      buckets:data || []
    },() => fn && fn(data.length > 0 ? data[0] : ''))
  }

  createBucketCallback = (values) => {
    this.getBucketsList()
    this.showAddBucketModal()
  }

  getFileListByBucket = () =>{
    const { selectedBucket } = this.state
    this.setState({loading:true})
    let params = {
      bucket:selectedBucket,
      marker:'',
      //limit:20,
      prefix:'',
      delimiter:''
    }
    getFileList(params).then(data =>{
      this.setState({
        dataSource:data.items || [],
        sortedInfo:{},
        loading:false
      })
    })
  }

  getDomainByBucket = () =>{
    const { selectedBucket } = this.state
    getBucketDomain(selectedBucket).then((data)=>{
      const domain = data[0];
      this.setState({bucketDomain:domain})
    }).catch(err => console.log(err))
  }

  onClickBucket = (bucket) =>{
    this.setState({
      selectedBucket:bucket,
      selectedRowKeys:[]
    },()=> {
      this.getDomainByBucket()
      this.getFileListByBucket()
    })
  }

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sortedInfo: sorter
    });
  }

  onSelectChange = (selectedRowKeys,selectedRows) =>{
    this.setState({ 
      selectedRowKeys:selectedRows.map((item)=> item.key)
    })
  }

  showAddBucketModal = (bucket)=>{
    const { addBucketModalVisible } = this.state
    this.setState({
      addBucketModalVisible:!addBucketModalVisible
    })
  }

  showUploadModal = (e) =>{
    const { uploadModalVisible } = this.state
    if(uploadModalVisible){
      if(uploading){
        message.warn('文件正在上传中，请稍候返回')
        return
      }
      if(fileList.length){
        this.getFileListByBucket()
      }
    }
    this.setState({
      uploadModalVisible:!uploadModalVisible
    })
  }

  showEditFileModal = (record)=>{
    const { editFileModalVisible,selectedBucket } = this.state
    if(record){
      record.bucket = selectedBucket
    }
    this.setState({
      editFileModalVisible:!editFileModalVisible,
      selectedRowInfo:record ? record : {}
    })
  }
  showPreviewModal = (record) =>{
    let isImg = true
    if(record && record.mimeType && record.mimeType.indexOf('image') < 0){
      isImg = false
    }
    const { previewVisible,bucketDomain } = this.state
    this.setState({
      previewVisible:!previewVisible,
      selectedRowInfo:record ? record : {},
      previewUrl:record && isImg ? `http://${bucketDomain}/${record.key}?attname=${record.key}.${record.key.split('.')[1]}` :''
    })
  }

  batchDelFiles = () =>{
    const { selectedBucket,selectedRowKeys } = this.state
    Modal.confirm({
      title: `确认删除选择文件？`,
      content: '删除后文件无法恢复',
      okType: 'danger',
      onOk: () => {
        return new Promise((resolve, reject) => {
          batchDelFile({bucket:selectedBucket,keys:selectedRowKeys}).then(data =>{
            resolve()
            this.getFileListByBucket()
          }).catch(err => console.log(err))
        })
      }
    });
  }

  deleteBucket = (bucket) =>{
    Modal.confirm({
      title: `确认删除${bucket}空间?`,
      content: '一旦删除空间，就永远无法再恢复过来，请确认是否有必要删除该空间！此操作会影响到和这个空间相关程序的运行',
      okType: 'danger',
      onOk: () => {
        return new Promise((resolve, reject) => {
          delBucket(bucket).then(data =>{
            resolve()
            this.getBucketsList((key)=>this.onClickBucket(key))
          }).catch(err => console.log(err))
        })
      }
    });
  }

  render() {
    const { buckets,selectedRowKeys,addBucketModalVisible,uploadModalVisible,loading,
      selectedBucket,editFileModalVisible,previewVisible,previewUrl 
    } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const uploadProps = {
      name: 'file',
      multiple: true,
      showUploadList: true,
      customRequest:(file) => uploadFile(file,selectedBucket),
      onChange:(info) => {
        uploading = false
        const status = info.file.status;
        if (status === 'uploading') {
         uploading = true
        }else if (status === 'done') {
          fileList.push(info)
          message.success(`${info.file.name} 上传成功`);
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
    }
    return (
      <div className={styles.main}>
        <div className={styles.left}>
          <ul style={{height:'calc(100% - 50px)',overflowY:'auto',marginBottom:10}}>
            {this.state.buckets.map((item,index)=>(
              <li 
                className={selectedBucket == item ? styles.active : ''} 
                key={index} 
                onClick={()=>this.onClickBucket(item)}>
                <span className={styles.name}>{item}</span>
                <span className={styles.tools}>
                  <Icon type="delete" onClick={()=> this.deleteBucket(item)}/>
                </span>
              </li>
            ))}
          </ul>
          <Button type="primary" icon="add" className={styles.addBucketBtn} onClick={this.showAddBucketModal}>新增空间</Button>
          {addBucketModalVisible ? 
            <AddBucketModal
              handleCancel={this.showAddBucketModal}
              onSubmit={this.createBucketCallback}
            /> : null
          }
        </div>
        <div className={styles.right}>
          {!uploadModalVisible ?
            <div>
              <div style={{padding:10}}>
                <Button type="primary" icon="upload" onClick={this.showUploadModal}>上传</Button>
                <Button type="danger" icon="delete" onClick={this.batchDelFiles} style={{marginLeft:10}} disabled={!(selectedRowKeys.length > 0)}>删除</Button>
              </div>
              <Table 
              scroll={{ y: 465 }}
              loading={loading}
              columns={this.renderColumns()}
              rowKey ={(record,index) => record.key}
              dataSource={this.state.dataSource} 
              pagination={false}
              onChange={this.handleChange}
              rowSelection={rowSelection}
            />
            </div>
          : <div>
              <div style={{padding:10}}>
                <Button type="primary" onClick={this.showUploadModal}>返回</Button>
              </div>
              <div style={{height:250,padding:10}}>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox"/>
                </p>
                <p className="ant-upload-text">点击或拖拽上传</p>
              </Dragger>
            </div>
            </div>
          }
        </div>
        {editFileModalVisible ? 
          <EditFileModal  
            dataSource={this.state.selectedRowInfo}
            handleCancel={() => this.showEditFileModal()}
            onSubmit={()=> this.getFileListByBucket()}
          /> : null}
        <Modal
          title="预览"
          visible={previewVisible}
          width={600}
          onCancel={() => this.showPreviewModal()}
          footer={[
            <Button key="back" size="large" onClick={() =>this.copy()}>复制外链</Button>,
            <Button key="submit" type="primary" size="large" onClick={this.down}>
              下载
            </Button>,
          ]}
        >
        {previewUrl ? <img src = {previewUrl} className={styles.previewImg}/> : '此类型文件不支持预览'}
      </Modal>
      </div>
    )
  }
}
export default Main