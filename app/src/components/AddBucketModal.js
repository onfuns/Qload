import React from 'react'
import { Input, Form, Radio, Modal, message } from 'antd';
import { inject, observer } from 'mobx-react'
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const FormItem = Form.Item

const Add = observer(({ onSubmit, handleCancel, form, bucketStore }) => {
  const handleSubmit = () => {
    form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await bucketStore.createBucket({ ...values })
          onSubmit && onSubmit(values)
          message.success('添加成功')
        } catch (err) {
          message.error('添加失败')
        }
      }
    })
  }

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }
  const { getFieldDecorator } = form
  return (
    <Modal
      title="空间"
      visible={true}
      width={500}
      onCancel={handleCancel}
      onOk={handleSubmit}
    >
      <Form>
        <FormItem
          label="名称"
          {...formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: '',
            rules: [{
              required: true,
              message: '名称由4 ~ 63个字符组成，可包含 字母、数字、中划线',
              pattern: /^[1-9a-zA-Z\-]{4,63}$/
            }],
          })(
            <Input placeholder="名称由4 ~ 63个字符组成，可包含 字母、数字、中划线" />
          )}
        </FormItem>
        <FormItem
          label="描述"
          {...formItemLayout}
        >
          {getFieldDecorator('region', {
            initialValue: 'z0',
          })(
            <RadioGroup>
              <RadioButton value="z0">华东</RadioButton>
              <RadioButton value="z1">华北</RadioButton>
              <RadioButton value="z2">华南</RadioButton>
              <RadioButton value="na0">北美</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
})

export default inject('bucketStore')(Form.create()(Add))