import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';
import { ProductsPage } from './ProductsPage';
import { ProductDetailsPage } from './ProductDetailsPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { PaymentPage } from './PaymentPage';

export class PoManager {
  readonly page: Page;
  readonly homePage: HomePage;
  readonly loginPage: LoginPage;
  readonly signupPage: SignupPage;
  readonly productsPage: ProductsPage;
  readonly productDetailsPage: ProductDetailsPage;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;
  readonly paymentPage: PaymentPage;

  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.signupPage = new SignupPage(page);
    this.productsPage = new ProductsPage(page);
    this.productDetailsPage = new ProductDetailsPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.paymentPage = new PaymentPage(page);
  }
}
