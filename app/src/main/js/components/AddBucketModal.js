import React,{ Component } from 'react'
import { Input, Button,Form,Radio,Modal, message } from 'antd';
import { createBucket } from '../actions'
const {RadioButton,RadioGroup} = Radio;
const FormItem = Form.Item

const Add = (props) => {

  const handleSubmit = (e) =>{
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        createBucket({...values}).then((data)=>{
          props.onSubmit(values)
        }).catch(err => message.error('添加失败'))
      }
    })
  }
  const formItemLayout = {
    labelCol: {span:4},
    wrapperCol: {span: 20}
  }
  const { handleCancel,form} = props
  const { getFieldDecorator } = form
  return (
    <Modal
      title="空间"
      visible={true}
      width={450}
      onCancel={handleCancel}
      footer={[
        <Button key="back" size="large" onClick={handleCancel}>取消</Button>,
        <Button key="submit" type="primary" size="large" onClick={handleSubmit}>
          确定
        </Button>,
      ]}
    >
    <Form>
      <FormItem
        label="名称"
        {...formItemLayout}
      >
        {getFieldDecorator('name', {
          initialValue:'',
          rules: [{ required: true, message: '请填写名称!' },{
            validator:(rule, value, callback) => {
            if(value && /^[1-9a-zA-Z\-]{4,63}$/.test(value) == false){
                callback('名称由4 ~ 63个字符组成，可包含 字母、数字、中划线')
              }
              callback()
            }
          }],
        })(
          <Input  placeholder="名称由4 ~ 63个字符组成，可包含 字母、数字、中划线" />
        )}
      </FormItem>
      <FormItem
        label="描述"
        {...formItemLayout}
      >
        {getFieldDecorator('region', {
          initialValue:'z0',
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
}
export default Form.create()(Add)