// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules', 'playwright-report', 'test-results', 'blob-report', 'ai/generated'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Playwright-specific lint rules only apply to the test files.
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // Turn off any stylistic rules that would fight Prettier. Must be last.
  prettier,
);
