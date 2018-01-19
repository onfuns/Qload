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
			'./src/main/js/index.js',
		],
	},
	output: {
		path: path.resolve(__dirname, '../app/build'),
		filename: 'app.bundle.js',
		publicPath: './',
	},
	module: {
		loaders: [],
	},
	target: 'electron-renderer',
	node: {
  	__dirname: false,
  	__filename: false
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: './src/main/main.js', 
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
		new webpack.NamedModulesPlugin(),
		// new webpack.DefinePlugin({
		// 	$dirname: '__dirname'
		// }),
	],
})
