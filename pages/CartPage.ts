import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.locator('a.check_out');
  }

  async assertHasItems() {
    await expect(this.cartItems.first()).toBeVisible();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.click();
  }
}
