import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly allProductsHeader: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allProductsHeader = page.locator('h2.title.text-center', { hasText: 'All Products' });
    this.productCards = page.locator('.features_items .product-image-wrapper');
  }

  async assertLoaded() {
    await expect(this.allProductsHeader).toBeVisible();
  }

  async hoverFirstProduct() {
    await this.productCards.first().hover();
  }

  async openFirstProductDetails() {
    await this.productCards.first().locator('a[href^="/product_details/"]').click();
  }
}
