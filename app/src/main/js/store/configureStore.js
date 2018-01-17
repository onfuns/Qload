'use strict';

import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { ConnectedRouter, routerMiddleware, push, } from 'react-router-redux';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* 
 * 1) ConnectedRouter 配置 
 * 2) routerReducer 配置 /reducers/index.js 
*  3) push 的使用方式：store.dispatch(push('/foo'))
 */
 
// 配置自定义的中间件
import createHistory from 'history/createBrowserHistory';
export const history = createHistory();


import reducers from '../reducers';

const middleware = [
  routerMiddleware(history),
  thunkMiddleware
];
const createWeSiteStore = applyMiddleware( ...middleware );

export function configureStore() {
  const store = createStore(reducers, composeEnhancers(createWeSiteStore));
  return store;
}