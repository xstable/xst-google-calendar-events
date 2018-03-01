const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry:  './source/app.js',
    output: {
        filename: './example/js/xst_google_events.js'
    },
    plugins: [
        new UglifyJsPlugin({
                parallel: 4
            })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react','es2015','stage-2']
                }
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
    }
}
