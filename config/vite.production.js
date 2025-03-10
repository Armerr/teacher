export const config = {
  // 打包配置
  build: {
    // 指定输出路径
    outDir: 'dist',
    // 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
    assetsInlineLimit: 2048,
    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,
    // 构建后是否生成 source map 文件
    sourcemap: false,
    // chunk 大小警告的限制
    chunkSizeWarningLimit: 2048,
    // 自定义底层的 Rollup 打包配置
    // 设置为 false 可以禁用最小化混淆，
    // 或是用来指定使用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    minify: 'terser', // terser 构建后文件体积更小
    // 启用/禁用 brotli 压缩大小报告
    brotliSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
        entryFileNames: 'assets/js/[name].[hash].js',
        // 用于命名代码拆分时创建的共享块的输出命名
        chunkFileNames: 'assets/js/[name].[hash].js',
        // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames(assetInfo) {
          const imgExt = ['png', 'jpg', 'jpeg', 'gif'];
          const ext = assetInfo.name.split('.').pop();
          if (imgExt.includes(ext)) {
            return 'assets/img/[name].[hash].[ext]';
          }
          return 'assets/[ext]/[name].[hash].[ext]';
        },
      },
      onwarn(log, handler) {
        if (log.plugin === 'vite-plugin-eslint') {
          return;
        }
        handler(log);
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  plugins: [],
};
