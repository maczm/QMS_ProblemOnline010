const { defineConfig } = require("@vue/cli-service");

// 添加路径配置
let prodPublicPath = "/Apriso/Portal/VueProject/QMS_ProblemOnline010/";
let devPublicPath = "";
let publicPath = "";
if (process.env.NODE_ENV === "production") {
  //生产环境
  publicPath = prodPublicPath;
} else {
  //开发环境
  publicPath = devPublicPath;
}

module.exports = defineConfig({
  // 添加路径相关配置
  publicPath,
  assetsDir: "",
  productionSourceMap: false,
  filenameHashing: false,

  // 开发服务器配置 - 支持局域网访问
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    open: false,
  },

  // 保留原有配置
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      fallback: {
        url: require.resolve("url/"),
      },
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          plugins: [
            require("postcss-pxtorem")({
              rootValue: 37.5, // 换算的基数
              minPixelValue: 2,
              selectorBlackList: [], // 忽略转换正则匹配项 列入一些ui库, ['.el'] 就是忽略elementUI库
              propList: ["*"],
            }),
          ],
        },
      },
    },
  },
});
