import { test, expect } from '../Fixtures/baseFixture';

test.describe('Product Details Page', () => {
  test.beforeEach(async ({ po }) => {
    await po.homePage.open();
    await po.homePage.goToProducts();
    await po.productsPage.openFirstProductDetails();
  });

  test.describe('Positive', () => {
    test('Product information block is visible', async ({ po }) => {
      await po.productDetailsPage.assertLoaded();
      await expect(po.productDetailsPage.addToCartButton.first()).toBeVisible();
    });

    test('Add product to cart and modal allows viewing cart', async ({ po, page }) => {
      await po.productDetailsPage.addToCartButton.first().click();
      await expect(po.productDetailsPage.viewCartLink).toBeVisible();
      await po.productDetailsPage.viewCartLink.click();
      await expect(page).toHaveURL(/view_cart/);
    });

    test('Continue Shopping closes the cart modal', async ({ po }) => {
      await po.productDetailsPage.addToCartButton.first().click();
      await po.productDetailsPage.continueShoppingButton.click();
      await expect(po.productDetailsPage.viewCartLink).toBeHidden();
    });
  });

  test.describe('Negative', () => {
    test('Zero quantity is rejected (treated as invalid)', async ({ po, page }) => {
      await page.locator('#quantity').fill('0');
      await po.productDetailsPage.addToCartButton.first().click();
      await page.waitForTimeout(500);
      await page.goto('/view_cart');
      const rows = page.locator('#cart_info_table tbody tr');
      if (await rows.count() > 0) {
        const qty = await rows.first().locator('.cart_quantity button').innerText();
        expect(parseInt(qty, 10)).toBeGreaterThan(0);
      }
    });

    test('Negative quantity input is not accepted as a valid number', async ({ page }) => {
      const qty = page.locator('#quantity');
      await qty.fill('-5');
      const value = await qty.inputValue();
      expect(parseInt(value, 10)).not.toBeLessThan(0);
    });

    test('Submitting empty review form shows validation', async ({ page }) => {
      await page.locator('#button-review').click();
      const nameValid = await page.locator('#name').evaluate(
        (el: HTMLInputElement) => el.validity.valid,
      );
      expect(nameValid).toBeFalsy();
    });
  });
});
