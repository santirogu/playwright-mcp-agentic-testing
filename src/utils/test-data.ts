/**
 * Central test data. Keeping literals out of the specs makes intent obvious and
 * lets us reuse the same fixtures across E2E and API layers.
 */

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const validCheckout: CheckoutInfo = {
  firstName: 'Santiago',
  lastName: 'Rodriguez',
  postalCode: '050001',
};

/** Well-known product names on SauceDemo, used to assert cart/checkout flows. */
export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTshirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
} as const;

/** Product sort options exposed by the inventory dropdown. */
export const sortOption = {
  nameAZ: 'az',
  nameZA: 'za',
  priceLowHigh: 'lohi',
  priceHighLow: 'hilo',
} as const;

export type SortOption = (typeof sortOption)[keyof typeof sortOption];
