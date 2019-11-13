/** @format */

module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 1,
    '@typescript-eslint/no-explicit-any': 0,
    // don"t require .vue extension when importing
    'import/extensions': 1,
    'no-new': 'off',
    'linebreak-style': [0, 'error', 'windows'],
    'spaced-comment': 'off',
    'no-dupe-keys': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 0,
    // allow optionalDependencies
    'import/no-extraneous-dependencies': [
      'error',
      {
        optionalDependencies: ['test/unit/index.js'],
      },
    ],
    'no-param-reassign': ['error', { props: false }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
