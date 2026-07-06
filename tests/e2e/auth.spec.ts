import { test, expect } from '../../src/fixtures/test';
import { env } from '../../src/utils/env';

/**
 * Authentication — happy path plus the two most important negative cases.
 * These exercise the login form directly (not the logged-in fixture) because
 * the login itself is the system under test here.
 */
test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user logs in and lands on the inventory', async ({ loginPage, page }) => {
    await loginPage.login(env.standardUser, env.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('locked-out user is rejected with a clear error', async ({ loginPage }) => {
    await loginPage.login(env.lockedUser, env.password);

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.errorText()).toContain('locked out');
  });

  test('wrong password is rejected and keeps the user on the login page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.login(env.standardUser, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.errorText()).toContain('Username and password do not match');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('logging out returns the user to the login screen', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(env.standardUser, env.password);
    await expect(inventoryPage.title).toBeVisible();

    await inventoryPage.header.logout();

    await expect(loginPage.loginButton).toBeVisible();
  });
});
