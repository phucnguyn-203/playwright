import { Page, Locator, expect } from "@playwright/test";

export default class Dialog {
  private page: Page;
  private dialogLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialogLocator = page.locator(".ui-dialog");
  }

  public async verifyDialogIsVisible(): Promise<void> {
    await expect(this.dialogLocator).toBeVisible();
  }

  public async checkDialogTitle(expectedTitle: string): Promise<void> {
    await expect(this.dialogLocator.locator(".ui-dialog-title")).toHaveText(expectedTitle);
  }

  public getDialogCloseButton(): Locator {
    return this.dialogLocator.locator(".ui-dialog-titlebar-close");
  }

  public async closeDialog(): Promise<void> {
    await this.getDialogCloseButton().click();
  }

}