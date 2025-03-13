import path from 'path';
import {defineConfig} from 'vite';
import {merge} from 'lodash-es';
import vue from '@vitejs/plugin-vue';
import defineOptions from 'unplugin-vue-define-options';
import eslintPlugin from 'vite-plugin-eslint';
import legacy from '@vitejs/plugin-legacy';
import Components from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
const baseConfig = {
    base: './', server: {
        proxy: {
            // 代理规则示例
            '/api': {
                target: 'http://your-backend-server.com', // 替换为你的后端地址
                changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, '') // 可选路径重写
            }
        }
    }, resolve: {
        alias: {
            '@api': path.resolve(__dirname, './src/api'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@common': path.resolve(__dirname, './src/common'),
            '@components': path.resolve(__dirname, './src/components'),
            '@views': path.resolve(__dirname, './src/views'),
        }, extensions: ['.vue', '.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'], css: {
            devSourcemap: true, // 在开发过程中是否启用 sourcemap
            preprocessorOptions: {
                scss: {
                    // 自动导入scss变量，可在任意文件内访问，无需导入
                    additionalData: `@import './src/common/scss/variables.scss';`,
                },
            },
        },
    }, plugins: [vue({
        script: {
            defineModel: true,
        },
    }), defineOptions.vite(), Components({
        resolvers: [AntDesignVueResolver({
            importStyle: false, // css in js
        }),],
    }), eslintPlugin({
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue', 'src/*.ts'],
        exclude: ['node_modules'],
        cache: false,
        failOnWarning: process.env.NODE_ENV === 'production',
        failOnError: true,
    }), legacy({
        targets: ['> 1%', 'last 2 versions', 'not ie <= 8'], additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),],
};

export default async ({mode}) => {
    const {config} = await import(`./config/vite.${mode}.js`);
    return defineConfig(merge(baseConfig, config));
};
