import { Page, Locator, expect } from '@playwright/test';

export interface PaymentInfo {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentPage {
  readonly page: Page;
  readonly nameOnCard: Locator;
  readonly cardNumber: Locator;
  readonly cvc: Locator;
  readonly expiryMonth: Locator;
  readonly expiryYear: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameOnCard = page.locator('input[name="name_on_card"]');
    this.cardNumber = page.locator('input[name="card_number"]');
    this.cvc = page.locator('input[name="cvc"]');
    this.expiryMonth = page.locator('input[name="expiry_month"]');
    this.expiryYear = page.locator('input[name="expiry_year"]');
    this.payAndConfirmButton = page.locator('#submit');
    this.orderSuccessMessage = page.locator('[data-qa="order-placed"], h2.title b');
  }

  async fillPayment(info: PaymentInfo) {
    await this.nameOnCard.fill(info.nameOnCard);
    await this.cardNumber.fill(info.cardNumber);
    await this.cvc.fill(info.cvc);
    await this.expiryMonth.fill(info.expiryMonth);
    await this.expiryYear.fill(info.expiryYear);
  }

  async confirmOrder() {
    await this.payAndConfirmButton.click();
  }

  async assertOrderPlaced() {
    await expect(this.page.locator('h2 b', { hasText: 'Order Placed!' })).toBeVisible();
    await expect(this.page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
  }
}
