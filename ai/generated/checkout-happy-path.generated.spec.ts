/**
 * ⚠️  AI-GENERATED ARTIFACT — committed for transparency, NOT run in CI.
 *
 * Origin:  Playwright MCP server (@playwright/mcp) + a coding agent.
 * Input:   ai/prompts/checkout-acceptance-criteria.md
 * Date:    2026-07-05
 * Human review: Santiago Rodriguez — see notes at the bottom of this file.
 *
 * The agent opened https://www.saucedemo.com through the MCP server, read the
 * accessibility tree to confirm locators, and emitted the spec below against the
 * project's existing Page Object Model and fixtures.
 *
 * This file lives in `ai/generated/` (excluded from `testDir`) so it documents
 * the workflow without affecting the maintained suite. The reviewed, canonical
 * version of this scenario lives in `tests/e2e/checkout.spec.ts`.
 */
import { test, expect } from '../../src/fixtures/test';
import { products, validCheckout } from '../../src/utils/test-data';

test.describe('Guest checkout — happy path (AI-generated)', () => {
  test('buying a single item yields an order confirmation', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    // Criterion 1–2: authenticated, add the backpack.
    await loggedInInventory.addToCart(products.backpack);

    // Criterion 3: open cart → checkout.
    await loggedInInventory.header.openCart();
    await cartPage.checkout();

    // Criterion 4: customer information.
    await checkoutPage.fillInformation(validCheckout);

    // Criterion 5: item total + tax === grand total.
    const subtotal = await checkoutPage.subtotal();
    const tax = await checkoutPage.tax();
    const total = await checkoutPage.total();
    expect(Number((subtotal + tax).toFixed(2))).toBe(total);

    // Criterion 6–7: finish and confirm.
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});

/**
 * ── HUMAN REVIEW NOTES (the human-in-the-loop, on purpose) ──────────────────
 *
 * ✅ Kept:  reuse of the existing POM + fixtures; no arbitrary sleeps; the
 *          totals-arithmetic assertion matches the acceptance criteria.
 *
 * ✏️  Changed on merge into tests/e2e/checkout.spec.ts:
 *   - The agent first proposed `page.locator('.complete-header')` (brittle CSS).
 *     Replaced with the `completeHeader` test-id locator already modelled in
 *     CheckoutPage.
 *   - Loosened the confirmation assertion from an exact string to `toContain`
 *     in the canonical spec, since SauceDemo occasionally appends punctuation.
 *   - The agent duplicated three `await` reads sequentially; the canonical spec
 *     batches them with `Promise.all` for speed.
 *
 * Takeaway: MCP + a11y-tree grounding gets you ~90% of a correct spec fast, but
 * a senior engineer still owns locator quality and assertion strictness before
 * it enters the maintained suite. This is augmentation, not autopilot.
 */
