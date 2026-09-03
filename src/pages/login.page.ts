import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '@constants/routes';
import { UserCredentials } from '@test-data/users.data';

/**
 * LoginPage
 * Page Object encapsulating interactions on the OrangeHRM Authentication / Login screen.
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly forgotPasswordLink: Locator;
  readonly fieldValidationErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorAlert = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('.orangehrm-login-forgot');
    this.fieldValidationErrors = page.locator('.oxd-input-field-error-message');
  }

  /**
   * Navigate directly to the Login page
   */
  async navigate(): Promise<void> {
    await this.goto(Routes.AUTH.LOGIN);
    await this.waitForPageLoad();
  }

  /**
   * Perform login operation with specific credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Perform login with a UserCredentials object
   */
  async loginAs(user: UserCredentials): Promise<void> {
    await this.login(user.username, user.password);
  }

  /**
   * Retrieve error banner message (e.g. 'Invalid credentials')
   */
  async getErrorMessage(): Promise<string> {
    await this.errorAlert.waitFor({ state: 'visible' });
    return (await this.errorAlert.textContent())?.trim() ?? '';
  }

  /**
   * Check if login form is displayed
   */
  async isLoaded(): Promise<boolean> {
    return await this.usernameInput.isVisible();
  }
}
