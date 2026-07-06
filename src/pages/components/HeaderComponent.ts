import type { Locator, Page } from '@playwright/test';

/**
 * The persistent app header shown on every authenticated SauceDemo page:
 * the cart icon + badge and the hamburger menu (which contains logout).
 *
 * Modelled as a component so the inventory and cart pages can both reuse it
 * instead of duplicating the same locators.
 */
export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  private readonly burgerButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.burgerButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  /** Number of items shown on the cart badge (0 when the badge is absent). */
  async cartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) {
      return 0;
    }
    const text = await this.cartBadge.textContent();
    return Number(text?.trim() ?? '0');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.burgerButton.click();
    await this.logoutLink.click();
  }
}
