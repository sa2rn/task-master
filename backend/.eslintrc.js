module.exports = {
  env: {
    es2021: true,
    node: true,
    mocha: true
  },
  extends: [
    'eslint:recommended',
    'plugin:mocha/recommended',
  ],
  plugins: [],
  rules: {
    'space-before-function-paren': ['error', 'never'],
    'no-unused-vars': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never']
  }
}
