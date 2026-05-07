import { test, expect } from '../Fixtures/baseFixture';
import userData from '../testData/userData.json';

test.describe('Login / Signup Page', () => {
  test.beforeEach(async ({ po }) => {
    await po.homePage.open();
    await po.homePage.goToSignupLogin();
  });

  test.describe('Positive', () => {
    test('New User Signup section is visible', async ({ po }) => {
      await expect(po.loginPage.signupHeader).toContainText('New User Signup!');
      await expect(po.loginPage.signupName).toBeVisible();
      await expect(po.loginPage.signupEmail).toBeVisible();
    });

    test('Start signup with valid name and unique email', async ({ po, page }) => {
      const email = `${userData.account.emailPrefix}_${Date.now()}@mail.test`;
      await po.loginPage.startSignup(userData.account.name, email);
      await expect(page).toHaveURL(/signup/);
      await expect(po.signupPage.enterAccountInfoHeader).toBeVisible();
    });
  });

  test.describe('Negative', () => {
    test('Signup with empty name and email is blocked', async ({ po, page }) => {
      await po.loginPage.signupButton.click();
      await expect(page).toHaveURL(/login/);
      await expect(po.loginPage.signupName).toBeFocused();
    });

    test('Signup with invalid email format is rejected', async ({ po }) => {
      await po.loginPage.signupName.fill('Tester');
      await po.loginPage.signupEmail.fill('not-an-email');
      await po.loginPage.signupButton.click();
      const validity = await po.loginPage.signupEmail.evaluate(
        (el: HTMLInputElement) => el.validity.valid,
      );
      expect(validity).toBeFalsy();
    });

    test('Login with non-existent credentials shows error', async ({ page }) => {
      await page.locator('input[data-qa="login-email"]').fill(`ghost_${Date.now()}@mail.test`);
      await page.locator('input[data-qa="login-password"]').fill('WrongPass123!');
      await page.locator('button[data-qa="login-button"]').click();
      await expect(page.locator('p:has-text("Your email or password is incorrect!")')).toBeVisible();
    });

    test('Signup with already-registered email is rejected', async ({ po, page }) => {
      const email = `dup_${Date.now()}@mail.test`;
      await po.loginPage.startSignup(userData.account.name, email);
      await po.signupPage.fillAccountInfo(userData.account);
      await po.signupPage.submitAccount();
      await po.signupPage.confirmAccountCreated();

      await page.locator('a[href="/logout"]').click();
      await po.homePage.goToSignupLogin();
      await po.loginPage.startSignup(userData.account.name, email);
      await expect(page.locator('p:has-text("Email Address already exist!")')).toBeVisible();
    });
  });
});
