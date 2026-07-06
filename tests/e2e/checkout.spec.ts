import { test, expect } from '../../src/fixtures/test';
import { products, validCheckout } from '../../src/utils/test-data';

/**
 * End-to-end checkout — the highest-value flow in the app. Covers the happy
 * path (order completes) plus form validation on the customer-info step.
 */
test.describe('Checkout', () => {
  test('completes an order end-to-end', async ({ loggedInInventory, cartPage, checkoutPage }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.header.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInformation(validCheckout);

    // Totals should add up: subtotal + tax = grand total.
    const [subtotal, tax, total] = await Promise.all([
      checkoutPage.subtotal(),
      checkoutPage.tax(),
      checkoutPage.total(),
    ]);
    expect(Number((subtotal + tax).toFixed(2))).toBe(total);

    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toBeVisible();
    expect(await checkoutPage.completeHeader.textContent()).toContain('Thank you for your order');
  });

  test('checkout requires the first name', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInInventory.addToCart(products.bikeLight);
    await loggedInInventory.header.openCart();
    await cartPage.checkout();

    await checkoutPage.continueWithoutInfo();

    await expect(checkoutPage.errorMessage).toBeVisible();
    expect(await checkoutPage.errorText()).toContain('First Name is required');
  });

  test('an order can be assembled from multiple products', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.boltTshirt);
    await loggedInInventory.addToCart(products.fleeceJacket);
    await loggedInInventory.header.openCart();

    await expect(cartPage.items).toHaveCount(3);
    await cartPage.checkout();
    await checkoutPage.fillInformation(validCheckout);
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toBeVisible();
  });
});
