import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettierConfig,
	{
		languageOptions: {
			parserOptions: {
				sourceType: 'module',
			},
			globals: {
				// Node.js globals
				__dirname: 'readonly',
				__filename: 'readonly',
				Buffer: 'readonly',
				console: 'readonly',
				exports: 'readonly',
				global: 'readonly',
				module: 'readonly',
				process: 'readonly',
				require: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
			'@typescript-eslint/ban-ts-comment': 'off',
			'no-prototype-builtins': 'off',
			'@typescript-eslint/no-empty-function': 'off',
		},
	},
	{
		ignores: [
			'node_modules/**',
			'dist/**',
			'main.js',
			'styles.css',
			'*.config.mjs',
			'**/generated/**',
			'**/*.graphql.ts',
		],
	},
);
