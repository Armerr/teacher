// 内置一系列插件处理css：允许你使用未来的 CSS 特性。
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    postcssPresetEnv({
      browsers: ['defaults', 'ios >= 8.0'],
    }),
  ],
};
