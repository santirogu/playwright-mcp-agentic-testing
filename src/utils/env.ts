/**
 * Small typed accessor over environment variables.
 *
 * Playwright auto-loads a local `.env` when present (see the note in the
 * README). Values fall back to SauceDemo's documented public credentials so the
 * suite runs out-of-the-box with zero configuration — while still allowing a
 * reviewer or CI to override anything via real environment variables.
 */

function fromEnv(key: string, fallback: string): string {
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
}

export const env = {
  baseURL: fromEnv('BASE_URL', 'https://www.saucedemo.com'),
  standardUser: fromEnv('SAUCE_USERNAME', 'standard_user'),
  password: fromEnv('SAUCE_PASSWORD', 'secret_sauce'),
  problemUser: fromEnv('SAUCE_PROBLEM_USERNAME', 'problem_user'),
  lockedUser: fromEnv('SAUCE_LOCKED_USERNAME', 'locked_out_user'),
} as const;
