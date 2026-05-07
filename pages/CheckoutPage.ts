import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly addressDelivery: Locator;
  readonly commentArea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressDelivery = page.locator('#address_delivery');
    this.commentArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a.check_out');
  }

  async assertLoaded() {
    await expect(this.addressDelivery).toBeVisible();
  }

  async placeOrder(comment = 'Please deliver ASAP') {
    await this.commentArea.fill(comment);
    await this.placeOrderButton.click();
  }
}
