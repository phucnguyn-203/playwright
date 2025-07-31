import { Page, Locator } from '@playwright/test';

export default class ButtonContainer {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getContinueButtonById(id: string): Locator {
    return this.page.locator(`div#${id}-buttons-container input[type="button"]`);
  }
}