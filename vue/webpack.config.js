/**
 * Created by Junhua on 2017/9/28.
 */
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry:['babel-polyfill', './src/main.js'],
    plugins: [new CleanWebpackPlugin(['dist'])],
    output: {
        // 打包到语音导航的public目录下
        // path: process.env.NODE_ENV === 'production' ? path.resolve(__dirname, '../speech_recognition/public/admin/dist') : path.resolve(__dirname, './dev'),
        path: process.env.NODE_ENV === 'production' ? path.resolve(__dirname, './dist/dist') : path.resolve(__dirname, './dev'),
        publicPath: process.env.NODE_ENV === 'production' ? 'dist/' : 'dev/',
        filename: process.env.NODE_ENV === 'production' ? '[name].[hash].js' : 'build.js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg|png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader'],
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: '../index.html',
            chunks: 'index',
            favicon:path.resolve(__dirname, './src/assets/image/favicon.ico'),
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
