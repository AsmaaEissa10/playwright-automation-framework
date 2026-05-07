import { test, expect } from '../Fixtures/baseFixture';
import userData from '../testData/userData.json';

test.describe('Payment Page', () => {
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
    await po.checkoutPage.placeOrder();
  });

  test.describe('Positive', () => {
    test('Payment form fields are visible', async ({ po }) => {
      await expect(po.paymentPage.nameOnCard).toBeVisible();
      await expect(po.paymentPage.cardNumber).toBeVisible();
      await expect(po.paymentPage.cvc).toBeVisible();
    });

    test('Fill payment info and confirm order shows success message', async ({ po }) => {
      await po.paymentPage.fillPayment(userData.payment);
      await po.paymentPage.confirmOrder();
      await po.paymentPage.assertOrderPlaced();
    });
  });

  test.describe('Negative', () => {
    test('Submitting payment with empty fields is blocked', async ({ po }) => {
      await po.paymentPage.confirmOrder();
      const validity = await po.paymentPage.nameOnCard.evaluate(
        (el: HTMLInputElement) => el.validity.valid,
      );
      expect(validity).toBeFalsy();
    });

    test('Submitting payment with missing card number is blocked', async ({ po }) => {
      await po.paymentPage.fillPayment({ ...userData.payment, cardNumber: '' });
      await po.paymentPage.confirmOrder();
      const validity = await po.paymentPage.cardNumber.evaluate(
        (el: HTMLInputElement) => el.validity.valid,
      );
      expect(validity).toBeFalsy();
    });

    test('Submitting payment with missing CVC is blocked', async ({ po }) => {
      await po.paymentPage.fillPayment({ ...userData.payment, cvc: '' });
      await po.paymentPage.confirmOrder();
      const validity = await po.paymentPage.cvc.evaluate(
        (el: HTMLInputElement) => el.validity.valid,
      );
      expect(validity).toBeFalsy();
    });
  });
});
