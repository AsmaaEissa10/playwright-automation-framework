import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailsPage {
  readonly page: Page;
  readonly productInfo: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productInfo = page.locator('.product-information');
    this.addToCartButton = page.locator('button.cart');
    this.viewCartLink = page.locator('#cartModal a[href="/view_cart"]');
    this.continueShoppingButton = page.locator('#cartModal button.close-modal');
  }

  async assertLoaded() {
    await expect(this.productInfo).toBeVisible();
  }

  async addToCartAndView() {
    await this.addToCartButton.first().click();
    await this.viewCartLink.click();
  }
}
