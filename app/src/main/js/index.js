import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { configureStore } from './store/configureStore'
import  './assets/css/Common.less'
import App from './app'

const render = (Component) => {
	ReactDOM.render(
		<Provider store={configureStore()}>
			<Component />
		</Provider>,
		document.getElementById('root')
	)
}

render(App)