module.exports = {
    entry: {
        'index': './index.js',
        'example': './example.js'
    },
    output: {
        path: './dist',
        filename: '[name].js',
        library: "vueDotnetValidator",
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            { test: /\.(babel|js)$/, loader: 'babel' },
        ]
    }
};
