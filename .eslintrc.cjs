module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    node: true,
    es2018: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint', 'import'],
  rules: {
    // vue base
    'vue/no-unused-vars': [
      'error',
      {
        ignorePattern: '^_',
      },
    ],
    'vue/valid-attribute-name': 0,
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea', 'span', 'i'],
        allowEmptyLines: false,
      },
    ],
    // 'vue/name-property-casing': ['error', 'PascalCase'],
    'vue/no-v-html': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/valid-v-slot': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always', // "always" 需要在没有内容的元素上自动关闭
          normal: 'always',
          component: 'always', // Vue.js 自定义组件的样式
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/html-indent': 0,
    'vue/max-attributes-per-line': 0,
    'vue/custom-event-name-casing': 0,
    'vue/eqeqeq': [2, 'always', { null: 'ignore' }],
    'vue/multi-word-component-names': 0,
    'vue/v-on-event-hyphenation': 0,
    'vue/first-attribute-linebreak': 0,
    'vue/no-reserved-props': 0,
    // common
    'no-unused-vars': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: [2, 'always'],
    'jsx-quotes': 0,
    'semi-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'comma-dangle': [2, 'only-multiline'],
    'comma-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'comma-style': [2, 'last'],
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'no-async-promise-executor': 0,
    'space-before-function-paren': 0,
    'no-empty': 0,
    'spaced-comment': ['error', 'always'],
    'no-undef': 0,
    // import
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'import/first': 2,
    // typescript
    '@typescript-eslint/no-explicit-any': 0,
    // 防止<script setup>使用的变量<template>被标记为未使用
    'vue/script-setup-uses-vars': 2,
    'vue/require-prop-types': process.env.NODE_ENV === 'production' ? 'off' : 'warn',
    '@typescript-eslint/no-unused-vars': [
      process.env.NODE_ENV === 'production' ? 'off' : 'warn',
      { varsIgnorePattern: 'props' },
    ],
    '@typescript-eslint/consistent-type-imports': [2, { disallowTypeAnnotations: false }],
    '@typescript-eslint/no-var-requires': 0,
    'newline-per-chained-call': 0,
    '@typescript-eslint/no-empty-function': process.env.NODE_ENV === 'production' ? 'off' : 'warn',
    'vue/one-component-per-file': 0,
    '@typescript-eslint/no-this-alias': 0,
    'vue/require-explicit-emits': 0,
    'vue/require-default-prop': process.env.NODE_ENV === 'production' ? 'off' : 'warn',
    'vue/no-template-shadow': process.env.NODE_ENV === 'production' ? 'off' : 'warn',
    'vue/no-lone-template': process.env.NODE_ENV === 'production' ? 'off' : 'warn',
  },
};
