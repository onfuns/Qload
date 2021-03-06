import React, { Component } from 'react';
import { HashRouter as RouterContainer } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Provider } from 'mobx-react'
import stores from './store'
import { Layout, LocaleProvider } from 'antd'
import Headers from './components/Header'
import Main from './views/Main'
import Login from './views/Login'
const { Content } = Layout

import zhCN from 'antd/lib/locale-provider/zh_CN';

class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <LocaleProvider locale={zhCN}>
          <RouterContainer>
            <Layout className="mainLayout">
              <Headers />
              <Content className='mainContent'>
                <Route exact path="/" component={Login} />
                <Route exact path="/main" component={Main} />
              </Content>
            </Layout>
          </RouterContainer>
        </LocaleProvider>
      </Provider>
    );
  }
};
export default App