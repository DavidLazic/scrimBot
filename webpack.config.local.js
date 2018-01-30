const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const staticSourcePath = path.join(__dirname, 'src/scss');
const sourcePath = path.join(__dirname, 'src/js');
const buildPath = path.join(__dirname, 'dist');

module.exports = {
    devtool: 'source-map',
    entry: {
        app: path.resolve(sourcePath, 'index.js')
    },
    output: {
        path: buildPath,
        filename: '[name].js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            path.resolve(__dirname, sourcePath),
            path.resolve(__dirname, 'node_modules')
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('local')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks (module) {
                return module.context && module.context.indexOf('node_modules') >= 0;
            }
        }),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin('[name].css')
    ],
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
                include: sourcePath
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader?sourceMap'
                    ]
                })
            },
            {
                test: /\.(eot?.+|svg?.+|ttf?.+|otf?.+|woff?.+|woff2?.+)$/,
                use: 'file-loader'
            },
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                use: 'url-loader?limit=20480',
                include: staticSourcePath
            }
        ]
    },
    devServer: {
        contentBase: sourcePath,
        historyApiFallback: true,
        port: 4000,
        compress: false,
        inline: true,
        hot: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m'
            }
        }
    }
};
