import { Page, Locator, expect } from "@playwright/test";

export default class Header {
  private page: Page;
  private headerLinks: Locator;

  public constructor(page: Page) {
    this.page = page;
    this.headerLinks = page.locator(".header-links");
  }

  public getAccountLink(): Locator {
    return this.headerLinks.locator(".account");
  }

  public async isAccountLinkVisible(): Promise<void> {
    await expect(this.getAccountLink()).toBeVisible();
  }

  public getLoginLink(): Locator {
    return this.headerLinks.locator('.ico-login');
  }

  public clickLoginLink(): Promise<void> {
    return this.getLoginLink().click();
  }

  public getLogoutLink(): Locator {
    return this.headerLinks.locator('.ico-logout');
  }
  public async clickLogoutLink(): Promise<void> {
    await this.getLogoutLink().click();
  }

  public getShoppingCartLink(): Locator {
    return this.headerLinks.locator('#topcartlink a');
  }
  public async clickShoppingCartLink(): Promise<void> {
    await this.getShoppingCartLink().click();
  }
}