import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The shopping cart. Lets specs assert what's in the cart and move on to
 * checkout without touching the DOM directly.
 */
export class CartPage extends BasePage {
  readonly items: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    // SauceDemo reuses the `inventory-item` test-id for cart rows (same markup
    // as the product cards), scoped here to the cart list container.
    this.items = page.getByTestId('cart-list').getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  /** Names of the products currently in the cart. */
  async itemNames(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allInnerTexts();
  }

  async itemCount(): Promise<number> {
    return this.items.count();
  }

  async removeItem(productName: string): Promise<void> {
    await this.items
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
