const webpack = require('webpack');
let path = require('path');
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config')


const join = (name) => path.join(__dirname, name)

module.exports = merge(baseWebpackConfig, {
	mode: 'production',
	entry: {
		'app': [
			'babel-polyfill',
			join('../app/src/index.js')
		],
	},
	output: {
		path: join('../app/build'),
		filename: 'app.bundle.js',
		publicPath: './',
	},
	plugins: [
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
		new CopyWebpackPlugin([
			{
				from: join('../main.js'),
				to: join('../app/build')
			},
			{
				from: join('../package.json'),
				to: join('../app/build')
			}
		])
	]
})
