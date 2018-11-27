import React from 'react'
import { Layout, Icon } from 'antd';
const { Header } = Layout
import './style.less'
import { closeWIndow, hideWIndow } from '../utils/util'

export default () => (
  <Header className='lay-header' style={{ WebkitAppRegion: 'drag' }}>
    <div>Qload</div>
    <div>
      <Icon type="minus" onClick={() => hideWIndow()} />
      <Icon type="close" onClick={() => closeWIndow()} />
    </div>
  </Header>
)