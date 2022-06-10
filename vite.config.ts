import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import visualizer from 'rollup-plugin-visualizer'
import externalGlobals from 'rollup-plugin-external-globals'
import { createHtmlPlugin } from 'vite-plugin-html'
//方便引入cdn 不便于自定义script标签
// import importToCDN from 'vite-plugin-cdn-import'
import commonjs from 'rollup-plugin-commonjs'
import { microViteSub } from './src/plugins'

// 代理地址
const target = 'http://crm_test.htwig.com'

export default ({ mode }: any) => {
	let configBase = ''
	const modeData = loadEnv(mode, process.cwd())
	const addPlugins: any = []
	// 判断是不是vite子应用打包
	if (mode === 'buildMicroChild') {
		configBase = 'http://localhost' + (modeData.VITE_CONFIG_BASE || '/')
		addPlugins.push(microViteSub())
	} else {
		configBase = modeData.VITE_CONFIG_BASE || '/'
	}

	const viteType = modeData.VITE_MICRO_TYPE || 'ViteChild'
	const cdnResource = `
	  <link   ${
			viteType === 'ViteChild' ? 'exclude' : 'global'
		} rel="stylesheet" href="https://cdn.staticfile.org/ant-design-vue/3.2.3/antd.min.css" crossorigin />
    <script  ${
			viteType === 'ViteChild' ? 'exclude' : 'global'
		} src="https://cdn.staticfile.org/vue/3.2.27/vue.runtime.global.prod.min.js" crossorigin ></script>
    <script   ${
			viteType === 'ViteChild' ? 'exclude' : 'global'
		} src="https://cdn.staticfile.org/vuex/4.0.2/vuex.global.prod.min.js" crossorigin ></script>
    <script   ${
			viteType === 'ViteChild' ? 'exclude' : 'global'
		} src="https://cdn.staticfile.org/vue-router/4.0.15/vue-router.global.prod.min.js" crossorigin ></script>
    <script   ${
			viteType === 'ViteChild' ? 'exclude' : 'global'
		} src="https://cdn.staticfile.org/dayjs/1.11.2/dayjs.min.js" crossorigin ></script>
    <script   ${
			viteType === 'ViteChild' ? 'exclude' : 'global'
		} src="https://cdn.staticfile.org/ant-design-vue/3.2.3/antd.min.js" crossorigin ></script>
	`

	if (mode === 'dev') {
		addPlugins.push(
			visualizer({
				open: true,
				gzipSize: true,
				brotliSize: true,
			})
		)
	}

	return defineConfig({
		css: {
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
					additionalData: '@import "./src/assets/css/global.less";',
				},
			},
		},
		plugins: [
			vue({
				template: {
					compilerOptions: {
						isCustomElement: (tag) => tag.startsWith('micro-'),
					},
				},
			}),
			vueJsx(),
			createHtmlPlugin({
				inject: {
					data: {
						appId: loadEnv(mode, process.cwd()).VITE_APP_ID || 'vite',
						cdnResource,
					},
				},
			}),
			eslintPlugin({
				include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
				exclude: ['src/views/test/*', 'src/views/lowCode/*'],
			}),
			...addPlugins,

			// createStyleImportPlugin({
			// 	resolves: [AndDesignVueResolve()],
			// }),
		],
		resolve: {
			alias: {
				'@': '/src',
			},
		},
		server: {
			host: '0.0.0.0',
			port: 8991,
			// 是否开启 https
			https: false,
			proxy: {
				// 代理配置
				'/customer': {
					target: target,
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/erp_test/, ''),
				},
				'/order': {
					target: target,
					changeOrigin: true,
					// rewrite: (path) => path.replace(/^\/erp_test/, ''),
				},
			},
		},
		base: configBase,
		build: {
			rollupOptions: {
				external: ['vue', 'vuex', 'vue-router', 'dayjs', 'ant-design-vue'],
				plugins: [
					commonjs(),
					externalGlobals({
						vue: 'Vue',
						vuex: 'Vuex',
						'vue-router': 'VueRouter',
						dayjs: 'dayjs',
						'ant-design-vue': 'antd',
					}),
				],
			},
		},
	})
}
