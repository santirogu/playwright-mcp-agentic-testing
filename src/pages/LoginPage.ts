import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The SauceDemo login screen — the entry point for every session.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByTestId('username');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  /** Fill both fields and submit. Auto-waiting handles readiness — no sleeps. */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async errorText(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
