import path from 'path';
import { createLogger } from 'vite';

const logger = createLogger();
const loggerWarn = logger.warn;

logger.warn = (msg, options) => {
  // 忽略空 CSS 文件的警告
  if (msg.includes('eslint')) return;
  loggerWarn(msg, options);
};
export const config = {
  server: {
    host: true, // 将监听所有地址，包括局域网和公网地址
    https: false, // 是否启用 http 2
    cors: false, // 为开发服务器配置 CORS , 默认启用并允许任何源
    port: 4001, // 端口
    strictPort: true, // 若端口已被占用则会直接退出，而不是尝试下一个可用端口
    hmr: true, // 禁用或配置 HMR 连接
    force: true, // 是否强制依赖预构建
  },
  plugins: [],
  customLogger: logger,
};
