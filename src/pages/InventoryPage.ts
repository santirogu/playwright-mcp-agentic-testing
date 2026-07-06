import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import type { SortOption } from '../utils/test-data';

/**
 * The product listing shown after a successful login. Exposes intent-revealing
 * actions (add/remove by product name, read prices, sort) so the specs read
 * like acceptance criteria rather than DOM manipulation.
 */
export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly items: Locator;
  readonly title: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.items = page.getByTestId('inventory-item');
    this.title = page.getByText('Products', { exact: true });
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  /** Locator for a single product card, scoped by its visible name. */
  private itemByName(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string): Promise<void> {
    await this.itemByName(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.itemByName(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openProduct(productName: string): Promise<void> {
    await this.itemByName(productName).getByText(productName).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /** Ordered list of the visible product names. */
  async productNames(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allInnerTexts();
  }

  /** Ordered list of prices as numbers (strips the leading `$`). */
  async productPrices(): Promise<number[]> {
    const raw = await this.items.getByTestId('inventory-item-price').allInnerTexts();
    return raw.map((price) => Number(price.replace('$', '')));
  }
}
