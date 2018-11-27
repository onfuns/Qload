import React, { Component } from 'react'
import { Icon } from 'antd'
import FilePanel from '../../components/FilePanel'
import BucketPanel from '../../components/BucketPanel'
import { createNewWindow } from '../../utils/util'
import './style.less'

class Main extends Component {

  logout = () => {
    createNewWindow({
      width: 250,
      height: 345,
      path: '/'
    })
  }

  render() {
    return (
      <div className='main'>
        <div className='left'>
          <BucketPanel />
          <a onClick={this.logout} className="logout">
            <Icon type="logout" />
          </a>
        </div>
        <div className='right'>
          <FilePanel />
        </div>
      </div>
    )
  }
}
export default Main