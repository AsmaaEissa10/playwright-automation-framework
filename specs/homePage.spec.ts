import { test, expect } from '../Fixtures/baseFixture';

test.describe('Home Page', () => {
  test.describe('Positive', () => {
    test.beforeEach(async ({ po }) => {
      await po.homePage.open();
    });

    test('Homepage loads with slider visible', async ({ po }) => {
      await expect(po.homePage.slider).toBeVisible();
    });

    test('Signup/Login link navigates to login page', async ({ po, page }) => {
      await po.homePage.goToSignupLogin();
      await expect(page).toHaveURL(/login/);
      await expect(po.loginPage.signupHeader).toBeVisible();
    });

    test('Products link navigates to products page', async ({ po, page }) => {
      await po.homePage.goToProducts();
      await expect(page).toHaveURL(/products/);
      await expect(po.productsPage.allProductsHeader).toBeVisible();
    });
  });

  test.describe('Negative', () => {
    test('Invalid path returns 404 page', async ({ page }) => {
      const response = await page.goto('/this-page-does-not-exist');
      expect(response?.status()).toBe(404);
    });

    test('Slider is not visible on a non-home route', async ({ page, po }) => {
      await page.goto('/products');
      await expect(po.homePage.slider).toBeHidden();
    });

    test('Empty cart shows the empty-cart message', async ({ page }) => {
      await page.goto('/view_cart');
      await expect(page.locator('#empty_cart')).toContainText(/empty/i);
    });
  });
});
