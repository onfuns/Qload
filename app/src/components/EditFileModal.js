import React from 'react'
import { Input, Button, Form, Modal, message } from 'antd'
import { inject, observer } from 'mobx-react'
const FormItem = Form.Item

const Add = observer(({ dataSource, handleCancel, form, fileStore }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const { key } = dataSource
          await fileStore.rename(key, values.name)
          handleCancel && handleCancel()
        } catch (error) {
          console.log(error)
          message.error('重命名失败')
        }
      }
    })
  }

  const { getFieldDecorator } = form
  return (
    <Modal
      title="重命名"
      visible={true}
      width={450}
      onCancel={handleCancel}
      footer={[
        <Button key="submit" type="primary" size="large" onClick={handleSubmit}>
          确定
        </Button>
      ]}
    >
      <Form>
        <FormItem
          label="文件名"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          {getFieldDecorator('name', {
            initialValue: dataSource.key,
            rules: [{ required: true, message: '请填写名称' }],
          })(
            <Input placeholder="请填写名称" />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})
export default inject('fileStore')(Form.create()(Add))