const webpack = require('webpack');
let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCss = new ExtractTextPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === "development"
})
const extractLib = new ExtractTextPlugin({
  filename: 'lib.css',
  disable: process.env.NODE_ENV === "development"
})
module.exports = {
	module: {
		loaders: [
		  {
        test: /(\.css|\.less)$/, include: [path.resolve(__dirname,'../app/src/main/js/components'), path.resolve(__dirname,'../app/src/main/js/views/')], use: extractCss.extract({
          use: [{
              loader: "css-loader",
              options: {
								modules: true,
								url: false,
                minimize: process.env.NODE_ENV === 'production'
              }
          }, {
              loader: "less-loader"
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /(\.css|\.less)$/, exclude: [path.resolve(__dirname,'../app/src/main/js/components'), path.resolve(__dirname,'../app/src/main/js/views/')], use: extractLib.extract({
          use: [{
              loader: "css-loader",
              options: {
                modules: false,
                url: false,
                minimize: process.env.NODE_ENV === 'production'
              }
          }, {
              loader: "less-loader"
          }],
          fallback: "style-loader"
        })
      },{
				exclude: /node_modules/,
				test : /\.js$/,
				loaders: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-1'],
				},
			},
		]
  },
  target: 'electron',
	plugins: [
		extractCss,
    extractLib
	]
};
