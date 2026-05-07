import { test, expect } from '../Fixtures/baseFixture';
import userData from '../testData/userData.json';

test.describe('E2E - Register, purchase and confirm order', () => {
  test('Full user flow from account creation to order confirmation', async ({ po, page }) => {
    const uniqueEmail = `${userData.account.emailPrefix}_${Date.now()}@mail.test`;

    await test.step('Open homepage', async () => {
      await po.homePage.open();
    });

    await test.step('Go to Signup/Login page', async () => {
      await po.homePage.goToSignupLogin();
    });

    await test.step('Fill signup name & email and start signup', async () => {
      await po.loginPage.startSignup(userData.account.name, uniqueEmail);
    });

    await test.step('Fill personal info on signup form', async () => {
      await po.signupPage.fillAccountInfo(userData.account);
    });

    await test.step('Submit and confirm account creation', async () => {
      await po.signupPage.submitAccount();
      await po.signupPage.confirmAccountCreated();
    });

    await test.step('Navigate to products page', async () => {
      await po.homePage.goToProducts();
      await po.productsPage.assertLoaded();
    });

    await test.step('Hover over a product', async () => {
      await po.productsPage.hoverFirstProduct();
    });

    await test.step('Open product details', async () => {
      await po.productsPage.openFirstProductDetails();
      await po.productDetailsPage.assertLoaded();
    });

    await test.step('Add product to cart and view cart', async () => {
      await po.productDetailsPage.addToCartAndView();
      await po.cartPage.assertHasItems();
    });

    await test.step('Proceed to checkout', async () => {
      await po.cartPage.proceedToCheckout();
      await po.checkoutPage.assertLoaded();
    });

    await test.step('Place order with comment', async () => {
      await po.checkoutPage.placeOrder('Please handle with care');
    });

    await test.step('Fill payment details and confirm', async () => {
      await po.paymentPage.fillPayment(userData.payment);
      await po.paymentPage.confirmOrder();
    });

    await test.step('Display order confirmation message', async () => {
      await po.paymentPage.assertOrderPlaced();
      await expect(page).toHaveURL(/payment_done|order_confirmed|payment/);
    });
  });
});
