const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|md|html|ico)(\?.*)?$/i;

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  },
  devServer: {
    hot: true,
    port: 8000,
    compress: true,
    disableHostCheck: true
  },
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new TerserPlugin({
        parallel: 16,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        }
      }),
      new CompressionWebpackPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: productionGzipExtensions,
        compressionOptions: {
          level: 11
        }
      })
    ]
  }
}
