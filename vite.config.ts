import { ConfigEnv, defineConfig, loadEnv, PluginOption, ProxyOptions } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { inspectorServer } from '@react-dev-inspector/vite-plugin';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig((env: ConfigEnv) => {
  const { mode } = env;
  const envVar = loadEnv(mode, process.cwd());

  const { VITE_APP_TITLE, VITE_APP_BASE_API_URL, VITE_APP_ENV } = envVar;

  const isDev = VITE_APP_ENV === 'development';

  // 开发环境插件
  const devPlugin: PluginOption[] = [visualizer({ open: true })];

  // 后端服务地址（根据实际环境修改）
  const API_TARGET = 'http://localhost:8080';

  // 打印真实请求url
  const logProxyUrl: ProxyOptions['configure'] = (proxy, options) => {
    proxy.on('proxyReq', (_, req) => {
      console.log(`[Proxy Url] ${req.method} ${req.url} -> ${options.target}${req.url}`);
    });
  };

  return {
    plugins: [
      react(),
      tailwindcss(),
      inspectorServer(),
      createHtmlPlugin({ inject: { data: { documentTitle: VITE_APP_TITLE } } }),
      ...(isDev ? devPlugin : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      proxy: {
        // 主后端（projects、auth 及其他 /api/* 路径）
        [VITE_APP_BASE_API_URL]: {
          target: API_TARGET,
          configure: logProxyUrl,
        },
      },
    },
  };
});
