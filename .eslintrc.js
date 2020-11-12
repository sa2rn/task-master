module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'eslint:recommended',
    'plugin:mocha/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  settings: {
    react: {
      version: '17.0.1'
    }
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [],
  rules: {
    'space-before-function-paren': ['error', 'never'],
    'no-unused-vars': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never']
  }
}
