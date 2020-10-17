module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-quotes': 0,
    'jsx-quotes': [2, 'prefer-double'],
    strict: 0,
    'no-underscore-dangle': 0,
    quotes: [
      2,
      'single'
    ],
    'comma-dangle': 0,
    'prefer-const': 0,
    'space-after-keywords': 0,
    'one-var': 0,
    'object-curly-spacing': [2, 'always'],
    indent: [2, 2, { SwitchCase: 1 }],
    'func-names': 0,
    camelcase: [2, { properties: 'never' }],
    'id-length': 0,
    'react/jsx-boolean-value': 0,
    'no-undef': 2
  },
};
