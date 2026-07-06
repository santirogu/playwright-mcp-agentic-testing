import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { CheckoutInfo } from '../utils/test-data';

/**
 * Models the two-step SauceDemo checkout plus the confirmation screen. Grouping
 * them in one page object keeps the flow readable — the specs call
 * `fillInformation → assertTotals → finish` in sequence.
 */
export class CheckoutPage extends BasePage {
  // Step one: customer information.
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly postalCode: Locator;
  private readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step two: order summary.
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  // Confirmation.
  readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');

    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInformation(info: CheckoutInfo): Promise<void> {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  /** Submit step one without filling anything — used to assert validation. */
  async continueWithoutInfo(): Promise<void> {
    await this.continueButton.click();
  }

  async errorText(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  /** Parse a currency label like "Item total: $29.99" into a number. */
  private static parseAmount(label: string): number {
    const match = label.match(/\$([\d.]+)/);
    return match?.[1] ? Number(match[1]) : Number.NaN;
  }

  async subtotal(): Promise<number> {
    return CheckoutPage.parseAmount((await this.subtotalLabel.textContent()) ?? '');
  }

  async tax(): Promise<number> {
    return CheckoutPage.parseAmount((await this.taxLabel.textContent()) ?? '');
  }

  async total(): Promise<number> {
    return CheckoutPage.parseAmount((await this.totalLabel.textContent()) ?? '');
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
