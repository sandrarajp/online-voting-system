const path = require("path")

module.exports = {
    entry: "./src/index.js",

    devtool: 'eval-source-map',

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "static/dashboard/"),
        clean: true
    },

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
    
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
    
            {
                test: /\.(js|jsx|mjs)?$/i,
                exclude:  /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", "@babel/preset-env"]
                    }
                }
            }
        ]
    }
}