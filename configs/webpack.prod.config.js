const webpack = require('webpack');
let path = require('path');
const merge = require('webpack-merge')
let CopyWebpackPlugin = require('copy-webpack-plugin');
let baseWebpackConfig = require('./webpack.base.config')

module.exports = merge(baseWebpackConfig,{
	context: path.join(__dirname, '../app'),
	entry: {
		'app': [
			'babel-polyfill',
			'react-hot-loader/patch',
			'./src/main/js/index.js',
		],
	},
	output: {
		path: path.resolve(__dirname, '../app/build'),
		filename: 'app.bundle.js',
		publicPath: '/',
	},
	module: {
		loaders: [],
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: './src/main/app.js', 
				to: path.join(__dirname, '../app/build')
			},
			{
				from: './src/main/index.html', 
				to: path.join(__dirname, '../app/build')
			},
			{
				from: '../package.json', 
				to: path.join(__dirname, '../app/build')
			}
		]),
		new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
		new webpack.NamedModulesPlugin()
	],
})
