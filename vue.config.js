module.exports = {
  // 基本路径
  publicPath:"./",
  // 输出文件目录
  outputDir: 'web_demo',
  lintOnSave: true,
  devServer: {
    proxy:{
      "/api": {
          target: "http://xz502.tpddns.cn:25008", //目标地址
          ws: true, 
          changeOrigin: true,
          pathRewrite: {
              "^/api": ''
          }
      },
      "/user": {
          target: "http://xz502.tpddns.cn:25003", //目标地址
          ws: true, 
          changeOrigin: true,
          pathRewrite: {
              "^/user": ''
          }
        },
    }
  }
}