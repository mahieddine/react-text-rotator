const path = require('path')
const webpack = require('webpack')
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin
const Dotenv = require('dotenv-webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const relSrcRoot = ''
const srcRoot = path.resolve(__dirname, relSrcRoot)
const bundleOutputDir = './dist'

module.exports = (env) => {

    const isDev = !(env && env.production)

    return [{
        context: path.resolve(srcRoot),
        entry: {
            'main': './examples/index.tsx',
            vendor: [
                'react', 'react-dom', 'event-source-polyfill', 'react-router-dom',
            ]
        },
        output: {
            path: path.resolve(__dirname, bundleOutputDir),
            filename: isDev ? 'js/[name].bundle.js' : 'js/[name].[hash].bundle.js',
            sourceMapFilename: isDev ? 'js/[name].bundle.map' : 'js/[name].[chunkhash].bundle.map',
            chunkFilename: isDev ? 'js/[id].chunk.js' : 'js/[id].[chunkhash].chunk.js',
            publicPath: ''
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: srcRoot,
                    use: 'awesome-typescript-loader?silent=true'
                },
                {
                    test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
                    loader: 'babel-loader',
                    query: {
                        'presets': [
                            ['env', {
                                'modules': false,
                                'browserslist': [
                                    'last 2 version'
                                ]
                            }],
                            //Webpack understands the native import syntax, and uses it for tree shaking
                            'stage-2',
                            //Specifies what level of language features to activate.
                            //State 2 is "draft", 4 is finished, 0 is strawman.
                            //See https://tc39.github.io/process-document/
                            'react'
                            //Transpile React components to JS
                        ],
                        'plugins': [
                            'react-hot-loader/babel',
                            'reflective-bind/babel',
                            //Enables React code to work with HMR.
                        ]
                    },
                    exclude: [
                        /node_modules/,
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif)$/,
                    loader: 'file-loader',
                    query: {
                        name: '/static/assets/img/[name].[ext]'
                    }
                },
                {test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url-loader?limit=10000'},
                {test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000'}
            ]
        },
        stats: isDev ? 'normal' : 'minimal',
        performance: {
            hints: false
        },
        devtool: isDev ? 'eval' : 'cheap-source-map',
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
            alias: {}
        },
        externals: [
            // since we are running our js in the browser we exclude those native node libraries
            'child_process', 'fs', 'tls', 'net', 'location', 'navigator', 'xmlhttprequest'
        ],
        plugins: [
            new webpack.DefinePlugin({
                process: {
                    env: {
                        NODE_ENV: isDev ? '"development"' : '"production"'
                    }
                }
            }),
            new Dotenv({
                path: isDev ? path.join(srcRoot, '.env.dev') : path.join(srcRoot, '.env.prod')
            }),
            new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.optimize.SplitChunksPlugin({
                name: 'vendor',
                filename: 'js/[hash].vendor.js',
                minChunks: Infinity,
            }),
            new HtmlWebpackPlugin({
                hash: true,
                filename: 'index.html'
            }),
            new CheckerPlugin()
        ].concat(isDev ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin(),
        ])
    }]
}