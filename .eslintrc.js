module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {},

  overrides: [
    // test files
    {
      files: ['tests/**/*.js'],
      env: {
        qunit: true,
      },
    },
  ],
}
