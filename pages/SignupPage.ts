import { Page, Locator, expect } from '@playwright/test';

export interface AccountInfo {
  password: string;
  title: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobile: string;
}

export class SignupPage {
  readonly page: Page;
  readonly enterAccountInfoHeader: Locator;
  readonly titleMr: Locator;
  readonly password: Locator;
  readonly daySelect: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly company: Locator;
  readonly address1: Locator;
  readonly address2: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly zipcode: Locator;
  readonly mobile: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeader: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.enterAccountInfoHeader = page.locator('h2.title b', { hasText: 'Enter Account Information' });
    this.titleMr = page.locator('#id_gender1');
    this.password = page.locator('#password');
    this.daySelect = page.locator('#days');
    this.monthSelect = page.locator('#months');
    this.yearSelect = page.locator('#years');
    this.firstName = page.locator('#first_name');
    this.lastName = page.locator('#last_name');
    this.company = page.locator('#company');
    this.address1 = page.locator('#address1');
    this.address2 = page.locator('#address2');
    this.country = page.locator('#country');
    this.state = page.locator('#state');
    this.city = page.locator('#city');
    this.zipcode = page.locator('#zipcode');
    this.mobile = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
    this.accountCreatedHeader = page.locator('h2[data-qa="account-created"] b');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
  }

  async fillAccountInfo(info: AccountInfo) {
    await expect(this.enterAccountInfoHeader).toBeVisible();
    if (info.title === 'Mr') await this.titleMr.check();
    await this.password.fill(info.password);
    await this.daySelect.selectOption(info.dobDay);
    await this.monthSelect.selectOption(info.dobMonth);
    await this.yearSelect.selectOption(info.dobYear);
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.company.fill(info.company);
    await this.address1.fill(info.address1);
    await this.address2.fill(info.address2);
    await this.country.selectOption(info.country);
    await this.state.fill(info.state);
    await this.city.fill(info.city);
    await this.zipcode.fill(info.zipcode);
    await this.mobile.fill(info.mobile);
  }

  async submitAccount() {
    await this.createAccountButton.click();
  }

  async confirmAccountCreated() {
    await expect(this.accountCreatedHeader).toHaveText('Account Created!');
    await this.continueButton.click();
  }
}
