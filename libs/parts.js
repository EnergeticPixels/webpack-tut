const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

exports.minify = function() {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                // Dont beautify output (enable for neater output)
                beautify: false,
                // eliminate comments
                comments: false,
                // complression specific options
                compress: {
                    warnings: false,
                    // drop console statements
                    drop_console: true
                },
                // mangling specific options
                mangle: {
                    // dont mangle $
                    except: ['webpackJsonp'],
                    // dont care about IE8
                    screw_ie8: true,
                    // dont mangle function names
                    keep_fnames: true
                }
            })
        ]
    };
}

exports.setFreeVariable = function(key, value) {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [
            new webpack.DefinePlugin(env)
        ]
    };
}

exports.extractBundle = function(options) {
    const entry = {};
    entry[options.name] = options.entries;

    return {
        // define an entry point needed for splitting
        entry: entry,
        plugins: [
            // extract bundle and manifest files. manifest is
            // needed for reliable caching
            new webpack.optimize.CommonsChunkPlugin({
                names: [options.name, 'manifest']
            })
        ]
    };
}

exports.clean = function(path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                // without 'root' CleanWebpackPlugin won't point to our
                // project and will fail to work
                root: process.cwd()
            })
        ]
    };
}

exports.extractCSS = function(paths) {
    return {
        module: {
            loaders: [
                // Extract CSS during build
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css'),
                    include: paths
                }
            ]
        },
        plugins: [
            //output extracted CSS to a files
            new ExtractTextPlugin('[name].[chunkhash].css')
        ]
    };
}
