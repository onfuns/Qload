import React,{ Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, message } from 'antd'
import { getBuckets } from '../../actions'
import { createNewWindow, BrowserWindow, getCache,saveCache,clearCacheByKey} from '../../utils/util'
import styles from './style.less'
const FormItem = Form.Item

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  submit = async ()=>{
    let  { accessKey,secretKey } = this.props.form.getFieldsValue()
    if(!accessKey || !secretKey){
      message.error('请填写认证key值')
      return;
    }
    saveCache('secretKeys',{accessKey, secretKey})
    getBuckets().then(data =>{
      const win = createNewWindow({
        height: 600,
        width: 1000,
        path:'/main'
      })
      let wins = BrowserWindow.getAllWindows()
      wins.length > 1 && wins[1].destroy()
      saveCache('buckets',data)
    }).catch((err) => {
      console.log(err)
      clearCacheByKey('secretKeys')
      message.error('验证不通过，请检查key值是否正确')
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.loginMain}>
      <div className={styles.logo}></div>
      <Form className={styles.loginForm}>
        <FormItem style={{marginBottom:0}}>
          {getFieldDecorator('accessKey', {
          })(
            <Input className={styles.loginInput} onPressEnter={this.submit} style={{borderBottom:'1px solid #ccc'}}  placeholder="输入AccessKey" />
          )}
        </FormItem>
        <FormItem  style={{marginBottom:0}}>
          <div>
          {getFieldDecorator('secretKey', {
          })(
            <Input className={styles.loginInput} style={{paddingRight:30}} onPressEnter={this.submit} placeholder="输入SecretKey" type="password"/>
          )}
          <Icon type="arrow-right" className={styles.loginSure} onClick={this.submit}/>
          </div>
        </FormItem>
      </Form>
      </div>
    )
  }
}

export default Form.create()(Login);