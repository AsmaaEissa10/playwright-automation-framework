import { test, expect } from '../Fixtures/baseFixture';
import userData from '../testData/userData.json';

test.describe('Checkout Page', () => {
  test.describe('Positive', () => {
    test.beforeEach(async ({ po }) => {
      await po.homePage.open();
      await po.homePage.goToSignupLogin();
      const email = `${userData.account.emailPrefix}_${Date.now()}@mail.test`;
      await po.loginPage.startSignup(userData.account.name, email);
      await po.signupPage.fillAccountInfo(userData.account);
      await po.signupPage.submitAccount();
      await po.signupPage.confirmAccountCreated();

      await po.homePage.goToProducts();
      await po.productsPage.openFirstProductDetails();
      await po.productDetailsPage.addToCartAndView();
      await po.cartPage.proceedToCheckout();
    });

    test('Delivery address block is shown with user data', async ({ po }) => {
      await po.checkoutPage.assertLoaded();
      await expect(po.checkoutPage.addressDelivery).toContainText(userData.account.firstName);
    });

    test('Place order moves user to payment page', async ({ po, page }) => {
      await po.checkoutPage.placeOrder('Sample comment');
      await expect(page).toHaveURL(/payment/);
      await expect(po.paymentPage.nameOnCard).toBeVisible();
    });
  });

  test.describe('Negative', () => {
    test('Checkout from unauthenticated session redirects to login', async ({ page, po }) => {
      await po.homePage.open();
      await po.homePage.goToProducts();
      await po.productsPage.openFirstProductDetails();
      await po.productDetailsPage.addToCartAndView();
      await po.cartPage.proceedToCheckout();
      await expect(page).toHaveURL(/login/);
    });

    test('Direct visit to /checkout without items does not show address block', async ({ page, po }) => {
      await page.goto('/checkout');
      await expect(po.checkoutPage.addressDelivery).toBeHidden();
    });
  });
});
