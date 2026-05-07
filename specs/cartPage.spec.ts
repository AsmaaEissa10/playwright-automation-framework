import { test, expect } from '../Fixtures/baseFixture';

test.describe('Cart Page', () => {
  test.describe('Positive', () => {
    test.beforeEach(async ({ po }) => {
      await po.homePage.open();
      await po.homePage.goToProducts();
      await po.productsPage.openFirstProductDetails();
      await po.productDetailsPage.addToCartAndView();
    });

    test('Cart shows the added product', async ({ po }) => {
      await po.cartPage.assertHasItems();
      expect(await po.cartPage.cartItems.count()).toBeGreaterThan(0);
    });

    test('Proceed to checkout navigates to checkout/login page', async ({ po, page }) => {
      await po.cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/checkout|login/);
    });
  });

  test.describe('Negative', () => {
    test('Cart is empty when no products were added', async ({ page }) => {
      await page.goto('/view_cart');
      await expect(page.locator('#empty_cart')).toContainText(/empty/i);
    });

    test('Proceed to checkout from empty cart does not load checkout', async ({ page }) => {
      await page.goto('/view_cart');
      await expect(page.locator('a.check_out')).toHaveCount(0);
    });

    test('Removing the only product empties the cart', async ({ po, page }) => {
      await po.homePage.open();
      await po.homePage.goToProducts();
      await po.productsPage.openFirstProductDetails();
      await po.productDetailsPage.addToCartAndView();
      await page.locator('a.cart_quantity_delete').first().click();
      await expect(page.locator('#empty_cart')).toContainText(/empty/i);
    });
  });
});
