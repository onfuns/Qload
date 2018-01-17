import React,{ Component } from 'react'
import { Input, Button, Form, Modal, message } from 'antd';
import { renameFile } from '../actions'
const FormItem = Form.Item

const Add = (props) =>{
  const handleSubmit = (e) =>{
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        const { dataSource } = props
        const { bucket,key } = dataSource
        renameFile(bucket,key,values.name).then((data)=>{
          props.handleCancel()
          props.onSubmit()
        }).catch(err => {
          console.log(err)
          message.error(err.error.error)
        })
      }
    })
  }
  const { dataSource,form,handleCancel } = props
  const { getFieldDecorator } = form
  return (
    <Modal
      title="重命名"
      visible={true}
      width={450}
      onCancel={handleCancel}
      footer={[
        <Button key="back" size="large" onClick={handleCancel}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={handleSubmit}>
          确定
        </Button>
      ]}
    >
    <Form>
      <FormItem
        label="文件名"
        labelCol={{span:4}}
        wrapperCol={{span:20}}
      >
        {getFieldDecorator('name', {
          initialValue:dataSource.key,
          rules: [{ required: true, message: '请填写名称' }],
        })(
          <Input  placeholder="请填写名称" />
        )}
      </FormItem>
    </Form>
    </Modal>
  )
}
export default Form.create()(Add)