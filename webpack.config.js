const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

const common = {
    // entry accepts a path or an object of entries.
    // we'll be using the latter form given it's
    // convenient with more complex configs
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack Demo'
        })
    ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common,
        {devtool: 'source-map'},
        parts.minify(),
        parts.setupCSS(PATHS.app)
    );
    break;
  default:
    config = merge(common,
        {devtool: 'eval-source-map'},
        parts.setupCSS(PATHS.app),
        parts.devServer({
            host: process.env.HOST,
            port: process.env.PORT
        })
    );
}

module.exports = validate(config);
