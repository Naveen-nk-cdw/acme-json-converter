import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: ['dist', 'node_modules', 'coverage'],
    },
    ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
    {
        plugins: {
            '@typescript-eslint': tsEslintPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/interface-name-prefix': 'off',

            '@typescript-eslint/explicit-function-return-type': 'warn',

            '@typescript-eslint/explicit-module-boundary-types': 'off',

            '@typescript-eslint/no-explicit-any': 'warn',

            'no-unused-vars': 'off',

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],

            'no-empty-function': 'off',

            '@typescript-eslint/no-empty-function': [
                'error',
                {
                    allow: ['constructors'],
                },
            ],

            'require-await': 'off',

            '@typescript-eslint/require-await': 'error',

            '@typescript-eslint/no-floating-promises': 'error',

            'max-len': [
                'error',
                {
                    code: 100,
                    tabWidth: 4,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreComments: false,
                },
            ],

            'no-restricted-syntax': [
                'error',

                {
                    selector:
                        'CallExpression[callee.object.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true])), CallExpression[callee.object.property.name=configService][callee.property.name=/^(get|getOrThrow)$/]:not(:has([arguments.1] Property[key.name=infer][value.value=true]))',

                    message:
                        'Add "{ infer: true }" to configService.get() for correct typechecking. Example: configService.get("database.port", { infer: true })',
                },

                {
                    selector: 'CallExpression[callee.name=it][arguments.0.value!=/^should/]',
                    message: '"it" should start with "should"',
                },
            ],
        },
    },
];
