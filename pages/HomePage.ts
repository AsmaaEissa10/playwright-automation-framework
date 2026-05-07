import { Page, expect, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly productsLink: Locator;
  readonly slider: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupLoginLink = page.locator('a[href="/login"]');
    this.productsLink = page.locator('a[href="/products"]');
    this.slider = page.locator('#slider');
  }

  async open() {
    await this.page.goto('/');
    await expect(this.slider).toBeVisible();
  }

  async goToSignupLogin() {
    await this.signupLoginLink.click();
  }

  async goToProducts() {
    await this.productsLink.click();
  }
}
