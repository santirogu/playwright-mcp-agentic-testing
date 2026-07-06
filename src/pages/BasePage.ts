import type { Page } from '@playwright/test';

/**
 * Shared behaviour for every page object. Concrete pages extend this and expose
 * their own locators + intent-revealing methods. Keeping navigation and the
 * `page` handle here keeps subclasses DRY.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path relative to the configured `baseURL`. */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Current URL — handy for asserting navigation without brittle waits. */
  url(): string {
    return this.page.url();
  }
}
