const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry:  './source/app.js',
    mode: 'production',
    output: {
        path: __dirname,
        filename: './example/js/xst_google_events.js'
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: true,
        })],
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader','css-loader'],
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
                parallel: 4
            })]
    }
}
