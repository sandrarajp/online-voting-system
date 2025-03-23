const common = require("./webpack.common")
const { merge } = require("webpack-merge")

module.exports = merge(common, {
    mode: "development",

    watch: true,

    watchOptions: {
        aggregateTimeout: 400,
        poll: 1000,
        ignored: '**/node_modules',

    },
})