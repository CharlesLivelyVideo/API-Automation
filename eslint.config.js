// eslint.config.js
import mochaPlugin from 'eslint-plugin-mocha';
import globals from 'globals';

export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'helpers/debugHelper.js', 'mochawesome-report/**'],
    
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.mocha
      }
    },
    
    plugins: {
      mocha: mochaPlugin
    },
    
    rules: {
      // General rules
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      
      // Mocha specific rules
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-skipped-tests': 'warn',
      'mocha/no-identical-title': 'error',
      'mocha/no-nested-tests': 'error',
      'mocha/no-mocha-arrows': 'warn'
    }
  }
];