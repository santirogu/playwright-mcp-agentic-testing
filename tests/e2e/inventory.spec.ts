import { test, expect } from '../../src/fixtures/test';
import { sortOption } from '../../src/utils/test-data';

/**
 * Inventory listing + sorting. Uses the `loggedInInventory` fixture so each
 * test starts on an authenticated product page.
 */
test.describe('Inventory & sorting', () => {
  test('shows the full catalogue of six products', async ({ loggedInInventory }) => {
    await expect(loggedInInventory.title).toBeVisible();
    await expect(loggedInInventory.items).toHaveCount(6);
  });

  test('sorts products by name Z→A', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy(sortOption.nameZA);

    const names = await loggedInInventory.productNames();
    const expected = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(expected);
  });

  test('sorts products by price low→high', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy(sortOption.priceLowHigh);

    const prices = await loggedInInventory.productPrices();
    const expected = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(expected);
  });

  test('sorts products by price high→low', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy(sortOption.priceHighLow);

    const prices = await loggedInInventory.productPrices();
    const expected = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(expected);
  });
});
