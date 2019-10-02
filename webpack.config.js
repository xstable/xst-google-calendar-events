const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry:  './source/app.js',
    output: {
        path: __dirname,
        filename: './example/js/xst_google_events.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',

                    options: {
                        presets: ['react','es2015','stage-2']
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }],
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
