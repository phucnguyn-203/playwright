import { Page, Locator, expect } from "@playwright/test";

export default class AlertPopup {
  private page: Page;
  private alertPopupLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertPopupLocator = page.locator(".ui-dialog");
  }

  public async verifyAlertPopupIsVisible(): Promise<void> {
    await expect(this.alertPopupLocator).toBeVisible();
  }

  public async checkAlertPopupTitle(expectedTitle: string): Promise<void> {
    await expect(this.alertPopupLocator.locator(".ui-dialog-title")).toHaveText(expectedTitle);
  }

  public getAlertPopupCloseButton(): Locator {
    return this.alertPopupLocator.locator(".ui-dialog-titlebar-close");
  }

  public async closeAlertPopup(): Promise<void> {
    await this.getAlertPopupCloseButton().click();
  }
}