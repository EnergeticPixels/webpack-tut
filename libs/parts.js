const webpack = require('webpack');

exports.setupCSS = function(paths) {
    return {
        module: {
            loaders: [{
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: paths
            }]
        }
    };
}

exports.devServer = function(options) {
    return {
        // stating watch options here is to counter issues
        // on certain versions of Windows, Ubuntu and
        // Vagrant. be advised that this is resource heavy.
        watchOptions: {
            // delay the rebuild after the first change
            aggregateTimeout: 300,
            // poll using interval (in ms, accepts boolean too)
            poll: 1000
        },
        devServer: {
            // enable history api fallback so html5 history api based
            // routing works. This is good default that will comple
            // in handy in more complicated setups.
            historyApiFallback: true,

            // unlike the cli flag, this doesn't setups//HotModuleReplacementPlugin!
            hot: true,
            inline: true,

            //display only errors to reduce the amount of output
            stats: 'errors-only',

            // parse host and port from env to allow customization.
            //
            // if use Vagrant or Cloud9, setup
            // host: options.host || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices
            // unlike default 'localhost'
            host: options.host, // defaults to 'localhost'
            port: options.port // defaults to 8080
        },
        plugins: [
            // enable multi-pass compliation for enhanced perf
            // in larger projects.  Good default.
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            })
        ]

    };
}
