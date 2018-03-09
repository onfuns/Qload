import React, { Component } from 'react';
import { HashRouter as RouterContainer} from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Layout } from 'antd'
const {  Content } = Layout
import Headers from './components/Header'
import Main from './views/Main'
import Login from './views/Login'

class App extends Component{
  render() {
    return (
      <RouterContainer>
        <Layout className="mainLayout">
          <Layout>
            <Headers/>
            <Content className='mainContent'>
              <Route exact path="/" component={Login} />
              <Route exact path="/main" component={Main} />
            </Content>
          </Layout>
        </Layout>
      </RouterContainer>
    );
  }
};
export default App