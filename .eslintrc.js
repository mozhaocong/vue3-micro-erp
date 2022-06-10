module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'@vue/typescript/recommended',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint',
	],
	// parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		indent: 'off',
		camelcase: 'off',
		'comma-dangle': [0, 'never'],
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'prettier/prettier': [
			'error',
			{ endOfLine: 'auto' },
			{
				usePrettierrc: true,
				printWidth: 150,
				tabWidth: 2,
				useTabs: true,
			},
		],
	},
}
