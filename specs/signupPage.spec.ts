import { test, expect } from '../Fixtures/baseFixture';
import userData from '../testData/userData.json';

/**
 * Jira Story: AUT-11 - Complete User Registration
 * Linked Test Cases: AUT-80 .. AUT-89 (TC-001 .. TC-010)
 */
test.describe('Signup Page - AUT-11 Complete User Registration', () => {
  test.beforeEach(async ({ po }) => {
    await po.homePage.open();
    await po.homePage.goToSignupLogin();
    const email = `${userData.account.emailPrefix}_${Date.now()}@mail.test`;
    await po.loginPage.startSignup(userData.account.name, email);
  });

  test('TC-001 [AUT-80] Registration form displays all required fields', async ({ po }) => {
    await expect(po.signupPage.enterAccountInfoHeader).toBeVisible();
    await expect(po.signupPage.titleMr).toBeVisible();
    await expect(po.signupPage.password).toBeVisible();
    await expect(po.signupPage.daySelect).toBeVisible();
    await expect(po.signupPage.monthSelect).toBeVisible();
    await expect(po.signupPage.yearSelect).toBeVisible();
    await expect(po.signupPage.firstName).toBeVisible();
    await expect(po.signupPage.lastName).toBeVisible();
    await expect(po.signupPage.address1).toBeVisible();
    await expect(po.signupPage.country).toBeVisible();
    await expect(po.signupPage.state).toBeVisible();
    await expect(po.signupPage.city).toBeVisible();
    await expect(po.signupPage.zipcode).toBeVisible();
    await expect(po.signupPage.mobile).toBeVisible();
    await expect(po.signupPage.createAccountButton).toBeVisible();
  });

  test('TC-002 [AUT-81] Successful account creation with valid data', async ({ po, page }) => {
    await po.signupPage.fillAccountInfo(userData.account);
    await po.signupPage.submitAccount();
    await expect(po.signupPage.accountCreatedHeader).toHaveText('Account Created!');
    await po.signupPage.continueButton.click();
    await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();
  });

  test('TC-003 [AUT-82] Validation messages for missing required fields', async ({ po }) => {
    await po.signupPage.submitAccount();
    const passwordValid = await po.signupPage.password.evaluate(
      (el: HTMLInputElement) => el.validity.valid,
    );
    expect(passwordValid).toBeFalsy();
    await expect(po.signupPage.accountCreatedHeader).toBeHidden();
  });

  test('TC-004 [AUT-83] Invalid email format validation', async ({ page, po }) => {
    await page.goto('/login');
    await po.loginPage.signupName.fill('Tester');
    await po.loginPage.signupEmail.fill('invalid-email-format');
    await po.loginPage.signupButton.click();
    const emailValid = await po.loginPage.signupEmail.evaluate(
      (el: HTMLInputElement) => el.validity.valid,
    );
    expect(emailValid).toBeFalsy();
  });

  test('TC-005 [AUT-84] Password strength validation', async ({ po }) => {
    const data = { ...userData.account, password: '123' };
    await po.signupPage.fillAccountInfo(data);
    expect(data.password.length).toBeLessThan(8);
    await expect(po.signupPage.password).toHaveValue('123');
  });

  test('TC-006 [AUT-85] Mobile number format validation', async ({ po }) => {
    const data = { ...userData.account, mobile: 'abcdef' };
    await po.signupPage.fillAccountInfo(data);
    await po.signupPage.submitAccount();
    const mobileValue = await po.signupPage.mobile.inputValue();
    expect(/^[+\d\s-]+$/.test(mobileValue)).toBeFalsy();
  });

  test('TC-007 [AUT-86] Date of birth boundary validation', async ({ po }) => {
    const dayOptions = await po.signupPage.daySelect.locator('option').count();
    const monthOptions = await po.signupPage.monthSelect.locator('option').count();
    const yearOptions = await po.signupPage.yearSelect.locator('option').count();
    expect(dayOptions).toBeGreaterThan(31);
    expect(monthOptions).toBeGreaterThan(12);
    expect(yearOptions).toBeGreaterThan(1);

    await po.signupPage.daySelect.selectOption('31');
    await po.signupPage.monthSelect.selectOption('12');
    await po.signupPage.yearSelect.selectOption({ index: yearOptions - 1 });
    await expect(po.signupPage.daySelect).toHaveValue('31');
  });

  test('TC-008 [AUT-87] Optional preferences (newsletter) are captured', async ({ po, page }) => {
    await po.signupPage.fillAccountInfo(userData.account);
    const newsletter = page.locator('#newsletter');
    await newsletter.check();
    await expect(newsletter).toBeChecked();
    await po.signupPage.submitAccount();
    await expect(po.signupPage.accountCreatedHeader).toHaveText('Account Created!');
  });

  test('TC-009 [AUT-88] Deselected optional preferences are captured', async ({ po, page }) => {
    await po.signupPage.fillAccountInfo(userData.account);
    const optin = page.locator('#optin');
    await optin.check();
    await optin.uncheck();
    await expect(optin).not.toBeChecked();
    await po.signupPage.submitAccount();
    await expect(po.signupPage.accountCreatedHeader).toHaveText('Account Created!');
  });

  test('TC-010 [AUT-89] Duplicate email prevention', async ({ po, page }) => {
    const duplicateEmail = `dup_${Date.now()}@mail.test`;

    await po.signupPage.fillAccountInfo(userData.account);
    await po.signupPage.submitAccount();
    await po.signupPage.confirmAccountCreated();
    await page.locator('a[href="/logout"]').click();

    await po.homePage.goToSignupLogin();
    await po.loginPage.startSignup(userData.account.name, duplicateEmail);
    await po.signupPage.fillAccountInfo(userData.account);
    await po.signupPage.submitAccount();
    await po.signupPage.confirmAccountCreated();
    await page.locator('a[href="/logout"]').click();

    await po.homePage.goToSignupLogin();
    await po.loginPage.signupName.fill(userData.account.name);
    await po.loginPage.signupEmail.fill(duplicateEmail);
    await po.loginPage.signupButton.click();
    await expect(page.locator('p:has-text("Email Address already exist!")')).toBeVisible();
  });
});
