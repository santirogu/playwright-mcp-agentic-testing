import { test, expect } from '../../src/fixtures/test';
import { products } from '../../src/utils/test-data';

/**
 * Cart behaviour: adding, the badge counter, and removal both from the
 * inventory page and from inside the cart.
 */
test.describe('Shopping cart', () => {
  test('adding products updates the cart badge', async ({ loggedInInventory }) => {
    await expect(loggedInInventory.header.cartBadge).toBeHidden();

    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.bikeLight);

    await expect(loggedInInventory.header.cartBadge).toHaveText('2');
    expect(await loggedInInventory.header.cartCount()).toBe(2);
  });

  test('cart lists exactly the products that were added', async ({
    loggedInInventory,
    cartPage,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.fleeceJacket);
    await loggedInInventory.header.openCart();

    await expect(cartPage.items).toHaveCount(2);
    expect(await cartPage.itemNames()).toEqual(
      expect.arrayContaining([products.backpack, products.fleeceJacket]),
    );
  });

  test('removing an item from the cart decrements the badge', async ({
    loggedInInventory,
    cartPage,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.bikeLight);
    await loggedInInventory.header.openCart();

    await cartPage.removeItem(products.backpack);

    await expect(cartPage.items).toHaveCount(1);
    expect(await cartPage.itemNames()).toEqual([products.bikeLight]);
  });
});
