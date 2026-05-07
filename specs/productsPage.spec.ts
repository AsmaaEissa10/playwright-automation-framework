import { test, expect } from '../Fixtures/baseFixture';

test.describe('Products Page', () => {
  test.beforeEach(async ({ po }) => {
    await po.homePage.open();
    await po.homePage.goToProducts();
  });

  test.describe('Positive', () => {
    test('All Products page loads with product cards', async ({ po }) => {
      await po.productsPage.assertLoaded();
      expect(await po.productsPage.productCards.count()).toBeGreaterThan(0);
    });

    test('Hover over the first product reveals add-to-cart overlay', async ({ po }) => {
      await po.productsPage.hoverFirstProduct();
      await expect(
        po.productsPage.productCards.first().locator('a.add-to-cart').first(),
      ).toBeVisible();
    });

    test('Click View Product opens product details page', async ({ po, page }) => {
      await po.productsPage.openFirstProductDetails();
      await expect(page).toHaveURL(/product_details/);
      await expect(po.productDetailsPage.productInfo).toBeVisible();
    });
  });

  test.describe('Negative', () => {
    test('Search with a non-existent term returns no products', async ({ page }) => {
      await page.locator('#search_product').fill('zzzzzzz-no-such-product');
      await page.locator('#submit_search').click();
      await expect(page.locator('h2:has-text("Searched Products")')).toBeVisible();
      await expect(page.locator('.features_items .product-image-wrapper')).toHaveCount(0);
    });

    test('Invalid product details URL does not render product info', async ({ page, po }) => {
      await page.goto('/product_details/999999');
      await expect(po.productDetailsPage.productInfo).toBeHidden();
    });

    test('Empty search submission keeps the original product list', async ({ page, po }) => {
      await page.locator('#search_product').fill('');
      await page.locator('#submit_search').click();
      expect(await po.productsPage.productCards.count()).toBeGreaterThan(0);
    });
  });
});
