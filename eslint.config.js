import globals from 'globals';
import { recommended as jsRecommended } from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  jsRecommended,
];