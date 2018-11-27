import React, { Component } from 'react'
import { Form, Icon, Input, message } from 'antd'
import { getBuckets } from '../../actions'
import { createNewWindow, BrowserWindow, saveCache, getCache } from '../../utils/util'
import './style.less'
const FormItem = Form.Item

class Login extends Component {
  constructor(props) {
    super(props)
  }

  goMainWindow = async () => {
    try {
      const data = await getBuckets()
      createNewWindow({
        height: 600,
        width: 1100,
        path: '/main'
      })
      saveCache('buckets', data)
    } catch (err) {
      console.log(err)
      message.error('验证不通过，请检查key值是否正确')
    }
  }

  submit = () => {
    let { accessKey, secretKey } = this.props.form.getFieldsValue()
    if (!accessKey || !secretKey) {
      return message.warn('请填写认证key值')
    }
    saveCache('secretKeys', { accessKey, secretKey })
    this.goMainWindow({ accessKey, secretKey })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { accessKey = '', secretKey = '' } = getCache('secretKeys') || {}
    return (
      <div className='login-main'>
        <div className='login-logo'></div>
        <Form className='login-form'>
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator('accessKey', {
              initialValue: accessKey
            })(
              <Input className='login-input' onPressEnter={this.submit} placeholder="输入AccessKey" />
            )}
          </FormItem>
          <FormItem style={{ marginBottom: 0 }}>
            <div style={{ position: 'relative' }}>
              {getFieldDecorator('secretKey', {
                initialValue: secretKey
              })(
                <Input className='login-input' style={{ paddingRight: 30 }} onPressEnter={this.submit} placeholder="输入SecretKey" type="password" />
              )}
              <Icon type="arrow-right" className='login-sure' onClick={this.submit} />
            </div>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Login);