module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
  ],
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off', // Too strict for library
    '@typescript-eslint/no-explicit-any': 'warn', // Keep as warning
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'off',
    'no-undef': 'off', // TypeScript handles this
  },
  env: {
    node: true,
    es2020: true,
    jest: true,
  },
};