import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { env } from '../utils/env';

/**
 * Custom fixtures = the backbone of a maintainable Playwright suite.
 *
 *  - Each page object is provided as a fixture so specs never `new` them up.
 *  - `loggedInInventory` performs the login once and hands back an already
 *    authenticated InventoryPage, so cart/checkout tests skip the boilerplate
 *    while login itself is still covered by dedicated auth specs.
 */
interface Pages {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** An InventoryPage that is already past authentication. */
  loggedInInventory: InventoryPage;
}

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  loggedInInventory: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.login(env.standardUser, env.password);
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
